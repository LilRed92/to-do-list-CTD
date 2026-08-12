import { useEditableTitle } from '../../hooks/useEditableTitle.js';
import TextInputWithLabel from '../../shared/TextInputWithLabel.jsx';
import { isValidTodoTitle } from '../../utils/todoValidation.js';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
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
    event.preventDefault();
    if (!isEditing) return;
    if (!isValidTodoTitle(workingTitle)) return;

    const finalTitle = finishEdit();
    onUpdateTodo({ ...todo, title: finalTitle });
  };

  return (
      <li>
        <form onSubmit={handleUpdate}>
          {isEditing ? (
            <>
              <TextInputWithLabel
                elementId={`edit-todo-${todo.id}`}
                labelText="Edit Todo"
                value={workingTitle}
                onChange={handleEdit}
              />
              <button type="button" onClick={handleCancel}>
              Cancel
              </button>
              <button
                type="submit"
                disabled={!isValidTodoTitle(workingTitle)}>
                Update
              </button>
            </>
          ) : (
            <>
              <label>
                <input
                  type="checkbox"
                  id={`checkbox${todo.id}`}
                  checked={todo.isCompleted}
                  onChange={() => onCompleteTodo(todo.id)}
                />
              </label>
              <span onClick={startEditing}>{todo.title}</span>
            </>
          )}
        </form>
      </li>
  );
}

export default TodoListItem;
