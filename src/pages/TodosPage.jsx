import { useAuth } from "../contexts/AuthContext.jsx";
import { useEffect, useReducer } from "react";
import { useSearchParams } from "react-router";
import TodoForm from "../features/Todos/TodoForm.jsx";
import TodoList from "../features/Todos/TodoList/TodoList.jsx";
import SortBy from "../shared/SortBy.jsx";
import FilterInput from "../shared/FilterInput.jsx";
import StatusFilter from "../shared/StatusFilter.jsx";
import {
  todoReducer,
  initialTodoState,
  TODO_ACTIONS,
} from "../reducers/todoReducer.js";
import styles from "./TodosPage.module.css";

function TodosPage() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const [state, dispatch] = useReducer(todoReducer, initialTodoState);
  const {
    todoList,
    error,
    isTodoListLoading,
    sortBy,
    sortDirection,
    filterTerm,
    dataVersion,
  } = state;

  const statusFilter = searchParams.get("status") || "all";

  useEffect(() => {
    async function fetchTodos() {
      if (!token) return;
      dispatch({ type: TODO_ACTIONS.FETCH_START });

      try {
        const params = new URLSearchParams({ sortBy, sortDirection, limit: 100 });
        const response = await fetch(`/api/tasks?${params}`, {
          headers: { "X-CSRF-TOKEN": token },
          credentials: "include",
        });

        if (response.status === 401) throw new Error("unauthorized");
        if (!response.ok) throw new Error("Failed to fetch tasks");

        const data = await response.json();
        dispatch({
          type: TODO_ACTIONS.FETCH_SUCCESS,
          payload: { todos: data.tasks || [] },
        });
      } catch (err) {
        dispatch({
          type: TODO_ACTIONS.FETCH_ERROR,
          payload: { message: `Error fetching todos: ${err.message}` },
        });
      }
    }

    fetchTodos();
  }, [token, sortBy, sortDirection]);

  const addTodo = async (todoTitle) => {
    const tempId = Date.now();
    const tempTodo = { id: tempId, title: todoTitle, isCompleted: false };
    dispatch({ type: TODO_ACTIONS.ADD_TODO_START, payload: { tempTodo } });

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": token },
        credentials: "include",
        body: JSON.stringify({ title: todoTitle, isCompleted: false }),
      });

      if (!response.ok) throw new Error("Server rejected creation");
      const realTodo = await response.json();

      dispatch({
        type: TODO_ACTIONS.ADD_TODO_SUCCESS,
        payload: { tempId, realTodo },
      });
    } catch (err) {
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_ERROR,
        payload: { tempId, message: `Failed to create todo. ${err.message}` },
      });
    }
  };

  const completeTodo = async (id) => {
    const originalTodo = todoList.find((t) => t.id === id);
    const newStatus = !originalTodo.isCompleted;
    dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_START,
      payload: { id, isCompleted: newStatus },
    });

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": token },
        credentials: "include",
        body: JSON.stringify({ isCompleted: newStatus }),
      });

      if (!response.ok) throw new Error("Server rejected updates");
      dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS });
    } catch (err) {
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
        payload: {
          id,
          originalTodo,
          message: `Status update failed. ${err.message}`,
        },
      });
    }
  };

  const deleteTodo = async (id) => {
    dispatch({ type: TODO_ACTIONS.DELETE_TODO_START });

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: { "X-CSRF-TOKEN": token },
        credentials: "include",
      });

      if (!response.ok) throw new Error("Server rejected deletion");
      dispatch({ type: TODO_ACTIONS.DELETE_TODO_SUCCESS, payload: { id } });
    } catch (err) {
      dispatch({
        type: TODO_ACTIONS.DELETE_TODO_ERROR,
        payload: { message: `Failed to delete todo. ${err.message}` },
      });
    }
  };

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((t) => t.id === editedTodo.id);
    dispatch({ type: TODO_ACTIONS.UPDATE_TODO_START, payload: { editedTodo } });

    try {
      const response = await fetch(`/api/tasks/${editedTodo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": token },
        credentials: "include",
        body: JSON.stringify({
          title: editedTodo.title,
          isCompleted: editedTodo.isCompleted,
        }),
      });

      if (!response.ok) throw new Error("Server rejected edits");
      dispatch({ type: TODO_ACTIONS.UPDATE_TODO_SUCCESS });
    } catch (err) {
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: {
          id: editedTodo.id,
          originalTodo,
          message: `Todo edit failed. ${err.message}`,
        },
      });
    }
  };

  return (
    <div className={styles.todosContainer}>
      {error && (
        <p className={styles.errorMessage}>
          {error}{" "}
          <button
            onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })}
            className={styles.clearErrorLink}
          >
            Clear
          </button>
        </p>
      )}

      {isTodoListLoading && (
        <p className={styles.loadingIndicator}>
          Syncing data with server database...
        </p>
      )}

      <div className={styles.topRow}>
        <TodoForm onAddTodo={addTodo} />
        <FilterInput
          filterTerm={filterTerm}
          onFilterChange={(newTerm) =>
            dispatch({
              type: TODO_ACTIONS.SET_FILTER,
              payload: { filterTerm: newTerm },
            })
          }
        />
      </div>

      <div className={styles.metaRow}>
        <SortBy
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortByChange={(newSortBy) =>
            dispatch({
              type: TODO_ACTIONS.SET_SORT,
              payload: { sortBy: newSortBy, sortDirection },
            })
          }
          onSortDirectionChange={(newDirection) =>
            dispatch({
              type: TODO_ACTIONS.SET_SORT,
              payload: { sortBy, sortDirection: newDirection },
            })
          }
        />
        <StatusFilter />
      </div>

      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        onDeleteTodo={deleteTodo}
        dataVersion={dataVersion}
        statusFilter={statusFilter}
        filterTerm={filterTerm}
      />
    </div>
  );
}

export default TodosPage;
