import { useMemo } from "react";
import TodoListItem from "./TodoListItem.jsx";
import styles from "./TodoList.module.css";

function TodoList({
  todoList,
  onCompleteTodo,
  onUpdateTodo,
  onDeleteTodo,
  dataVersion,
  statusFilter = "all",
  filterTerm = "",
}) {
  const filteredTodoList = useMemo(() => {
    let filteredTodos;
    switch (statusFilter) {
      case "completed":
        filteredTodos = todoList.filter((todo) => todo.isCompleted);
        break;
      case "active":
        filteredTodos = todoList.filter((todo) => !todo.isCompleted);
        break;
      case "all":
      default:
        filteredTodos = todoList;
        break;
    }

    if (filterTerm) {
      const lowerTerm = filterTerm.toLowerCase();
      filteredTodos = filteredTodos.filter((todo) =>
        todo.title.toLowerCase().includes(lowerTerm),
      );
    }

    return {
      version: dataVersion,
      todos: filteredTodos,
    };
  }, [todoList, dataVersion, statusFilter, filterTerm]);

  const getEmptyMessage = () => {
    if (filterTerm) {
      return `No todos are matching your search: "${filterTerm}"`;
    }

    switch (statusFilter) {
      case "completed":
        return "No completed todos yet. Complete some tasks to see them here.";
      case "active":
        return "No active todos. Add a todo above to get started.";
      case "all":
      default:
        return "Add todo above to get started.";
    }
  };

  return filteredTodoList.todos.length === 0 ? (
    <p className={filterTerm ? styles.noSearchResults : styles.emptyMessage}>
      {getEmptyMessage()}
    </p>
  ) : (
    <ul className={styles.todoUl}>
      {filteredTodoList.todos.map((todo) => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          onCompleteTodo={onCompleteTodo}
          onUpdateTodo={onUpdateTodo}
          onDeleteTodo={onDeleteTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;
