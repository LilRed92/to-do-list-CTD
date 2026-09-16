import { useState } from "react";
import { useEditableTitle } from "../../../hooks/useEditableTitle.js";
import TextInputWithLabel from "../../../shared/TextInputWithLabel.jsx";
import { isValidTodoTitle } from "../../../utils/todoValidation.js";
import styles from "./TodoListItem.module.css";

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo, onDeleteTodo }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    isEditing,
    workingTitle,
    startEditing,
    cancelEdit,
    updateTitle,
    finishEdit,
  } = useEditableTitle(todo.title);

  const handleEdit = (event) => updateTitle(event.target.value);
  const handleCancel = () => cancelEdit();

  const handleUpdate = (event) => {
    if (!isEditing) return;
    event.preventDefault();
    if (!isValidTodoTitle(workingTitle)) return;

    const finalTitle = finishEdit();
    onUpdateTodo({ ...todo, title: finalTitle });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDeleteTodo(todo.id);
    setIsDeleting(false);
  };

  return (
    <li
      className={`${styles.listItem} ${todo.isCompleted ? styles.completed : ""}`}
    >
      <form onSubmit={handleUpdate} className={styles.itemForm}>
        {isEditing ? (
          <div className={styles.editMode}>
            <TextInputWithLabel
              elementId={`edit-todo-${todo.id}`}
              labelText="Edit Todo"
              value={workingTitle}
              onChange={handleEdit}
              maxLength={100}
              required={true}
            />
            <div className={styles.editActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.updateBtn}
                onClick={handleUpdate}
                disabled={!isValidTodoTitle(workingTitle)}
              >
                Update
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.viewMode}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                id={`checkbox${todo.id}`}
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
                className={styles.checkbox}
              />
              <span className={styles.customCheck}></span>
            </label>
            <span className={styles.todoText} onClick={startEditing}>
              {todo.title}
            </span>
            <button
              type="button"
              className={styles.deleteBtn}
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;
