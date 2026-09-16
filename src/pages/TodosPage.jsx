import { useAuth } from "../contexts/AuthContext.jsx";
import { useEffect, useReducer } from "react";
import { useSearchParams } from "react-router";
import TodoForm from "../features/Todos/TodoForm.jsx";
import TodoList from "../features/Todos/TodoList/TodoList.jsx";
import SortBy from "../shared/SortBy.jsx";
import FilterInput from "../shared/FilterInput.jsx";
import StatusFilter from "../shared/StatusFilter.jsx";
import ErrorBanner from "../shared/ErrorBanner.jsx";
import useDebounce from "../utils/useDebounce.js";
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
    filterError,
    isTodoListLoading,
    sortBy,
    sortDirection,
    filterTerm,
    dataVersion,
  } = state;

  const statusFilter = searchParams.get("status") || "all";
  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  useEffect(() => {
    async function fetchTodos() {
      if (!token) return;
      dispatch({ type: TODO_ACTIONS.FETCH_START });

      try {
        const paramsObject = { sortBy, sortDirection, limit: 100 };
        if (debouncedFilterTerm) {
          paramsObject.find = debouncedFilterTerm;
        }
        const params = new URLSearchParams(paramsObject);
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
        const isFilterError =
          Boolean(debouncedFilterTerm) ||
          sortBy !== "createdAt" ||
          sortDirection !== "asc";
        dispatch({
          type: TODO_ACTIONS.FETCH_ERROR,
          payload: {
            message: isFilterError
              ? `Error filtering/sorting todos: ${err.message}`
              : `Error fetching todos: ${err.message}`,
            isFilterError,
          },
        });
      }
    }

    fetchTodos();
  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

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
    dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_START, payload: { id } });

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": token },
        credentials: "include",
        body: JSON.stringify({ isCompleted: true }),
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
        <ErrorBanner>
          <span>{error}</span>
          <button
            onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })}
            className={styles.clearErrorBtn}
          >
            Clear Error
          </button>
        </ErrorBanner>
      )}

      {filterError && (
        <ErrorBanner variant="warning">
          <p>{filterError}</p>
          <button
            onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_FILTER_ERROR })}
            className={styles.clearErrorBtn}
          >
            Clear Filter Error
          </button>
          <button
            onClick={() => dispatch({ type: TODO_ACTIONS.RESET_FILTERS })}
            className={styles.clearErrorBtn}
          >
            Reset Filters
          </button>
        </ErrorBanner>
      )}

      {isTodoListLoading && (
        <p className={styles.loadingIndicator}>
          Syncing data with server database...
        </p>
      )}

      <div className={styles.controlsRow}>
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

      <div className={styles.searchRow}>
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

      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        onDeleteTodo={deleteTodo}
        dataVersion={dataVersion}
        statusFilter={statusFilter}
      />
    </div>
  );
}

export default TodosPage;
