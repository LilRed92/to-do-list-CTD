import { useState, useEffect, useCallback } from 'react';
import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList/TodoList.jsx';
import SortBy from '../../shared/SortBy.jsx';
import FilterInput from '../../shared/FilterInput.jsx';
import useDebounce from '../../utils/useDebounce.js';

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterTerm, setFilterTerm] = useState('');
  const [filterError, setFilterError] = useState('');
  const [dataVersion, setDataVersion] = useState(0);
  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  const handleFilterChange = (newTerm) => {
    setFilterTerm(newTerm);
  };

  const invalidateCache = useCallback(() => {
    console.log('Invalidating memo cache after todo mutation');
    setDataVersion(prev => prev + 1);
  }, []);

  useEffect(() => {
    async function fetchTodos() {
      if (!token) return;
      setIsTodoListLoading(true);
      setError('');

      try {
        const paramsObject = { sortBy, sortDirection, limit: 100};
        if (debouncedFilterTerm) {
          paramsObject.find = debouncedFilterTerm;
        }
        const params = new URLSearchParams(paramsObject);
        const response = await fetch(`/api/tasks?${params}`, {
          headers: { 'X-CSRF-TOKEN': token },
          credentials: 'include',
        });

        if (response.status === 401) throw new Error('unauthorized');
        if (!response.ok) throw new Error('Failed to fetch tasks');

        const data = await response.json();
        setTodoList(data.tasks || []);
        setFilterError('');
      } catch (err) {
        if (debouncedFilterTerm || sortBy !== 'createdAt' || sortDirection !== 'desc') {
          setFilterError(`Error filtering/sorting todos: ${err.message}`);
        } else {
          setError(`Error fetching todos: ${err.message}`);
        }
      } finally {
        setIsTodoListLoading(false);
      }
    }

    fetchTodos();
  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

  const addTodo = async (todoTitle) => {
    const tempId = Date.now();
    const temporaryTodo = { id: tempId, title: todoTitle, isCompleted: false };

    setTodoList(prev => [temporaryTodo, ...prev]);
    setError('');

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token
        },
        credentials: 'include',
        body: JSON.stringify({ title: todoTitle, isCompleted: false })
      });

      if (!response.ok) throw new Error('Server rejected creation');
      const realTodo = await response.json();

      setTodoList(prev => prev.map(t => t.id === tempId ? realTodo : t));
      invalidateCache();
    } catch (err) {
      setError(`Failed to create todo. ${err.message}`);
      setTodoList(prev => prev.filter(t => t.id !== tempId));
    }
  };

  const completeTodo = async (id) => {
    const originalTodo = todoList.find(t => t.id === id);

    setTodoList(prev => prev.map(t => t.id === id ? { ...t, isCompleted: true } : t));

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token
        },
        credentials: 'include',
        body: JSON.stringify({ isCompleted: true })
      });

      if (!response.ok) throw new Error('Server rejected updates');
      invalidateCache();
    } catch (err) {
      setError(`Status update failed. ${err.message}`);
      setTodoList(prev => prev.map(t => t.id === id ? originalTodo : t));
    }
  };

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find(t => t.id === editedTodo.id);

    setTodoList(prev => prev.map(t => t.id === editedTodo.id ? editedTodo : t));

    try {
      const response = await fetch(`/api/tasks/${editedTodo.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token
        },
        credentials: 'include',
        body: JSON.stringify({ title: editedTodo.title, isCompleted: editedTodo.isCompleted })
      });

      if (!response.ok) throw new Error('Server rejected edits');
      invalidateCache();
    } catch (err) {
      setError(`Todo edit failed. ${err.message}`);
      setTodoList(prev => prev.map(t => t.id === editedTodo.id ? originalTodo : t));
    }
  };


  return (
    <div className="todos-page-layout">
      {error && (
        <div
          className="error-banner"
          style={{ background: '#ffcccc', padding: '10px', margin: '10px 0' }}>
          <span>{error}</span>
          <button onClick={() => setError('')} style={{ marginLeft: '15px' }}>Clear Error</button>
        </div>
      )}

      {filterError && (
        <div
          className="filter-error-banner"
          style={{ background: '#fff3cd', padding: '10px', margin: '10px 0' }}
        >
          <p>{filterError}</p>
          <button onClick={() => setFilterError('')}>Clear Filter Error</button>
          <button
            onClick={() => {
            setFilterTerm('');
            setSortBy('createdAt');
            setSortDirection('desc');
            setFilterError('');
            }}
            style={{ marginLeft: '10px' }}>
          Reset Filters
          </button>
        </div>
      )}

      {isTodoListLoading && <p className="loading-indicator">Syncing data with server database...</p>}

      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={setSortBy}
        onSortDirectionChange={setSortDirection}
      />
      <FilterInput filterTerm={filterTerm} onFilterChange={handleFilterChange} />
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        dataVersion={dataVersion}
      />
    </div>
  );
}

export default TodosPage;