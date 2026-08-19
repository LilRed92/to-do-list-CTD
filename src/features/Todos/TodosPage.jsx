import { useState, useEffect } from 'react';
import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList/TodoList.jsx';

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  useEffect(() => {
    async function fetchTodos() {
      if (!token) return;
      setIsTodoListLoading(true);
      setError('');

      try {
        const params = new URLSearchParams({ limit: 100 });
        const response = await fetch(`/api/tasks?${params}`, {
          headers: { 'X-CSRF-TOKEN': token },
          credentials: 'include',
        });

        if (response.status === 401) throw new Error('unauthorized');
        if (!response.ok) throw new Error('Failed to fetch tasks');

        const data = await response.json();
        setTodoList(data.tasks || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsTodoListLoading(false);
      }
    }

    fetchTodos();
  }, [token]);

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
    } catch (err) {
      setError(`Todo edit failed. ${err.message}`);
      setTodoList(prev => prev.map(t => t.id === editedTodo.id ? originalTodo : t));
    }
  };


  return (
    <div className="todos-page-layout">
      {error && (
        <div className="error-banner" style={{ background: '#ffcccc', padding: '10px', margin: '10px 0' }}>
          <span>{error}</span>
          <button onClick={() => setError('')} style={{ marginLeft: '15px' }}>Clear Error</button>
        </div>
      )}

      {isTodoListLoading && <p className="loading-indicator">Syncing data with server database...</p>}

      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo} />
    </div>
  );
}

export default TodosPage;