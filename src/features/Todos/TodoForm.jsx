import { useState } from 'react';
import InputField from '../../shared/InputField.jsx';
import { isValidTodoTitle } from '../../utils/todoValidation.js';
import { sanitizeText } from '../../utils/sanitizeText.js';
import styles from './TodoForm.module.css';

function TodoForm ({ onAddTodo }) {
    const [workingTodoTitle, setWorkingTodoTitle] = useState("");

    const handleAddTodo = (event) => {
        event.preventDefault();

        if (isValidTodoTitle(workingTodoTitle)) {
            onAddTodo(sanitizeText(workingTodoTitle));
            setWorkingTodoTitle("");
        }
    };

    return (
        <form onSubmit={handleAddTodo} className={styles.formContainer}>
            <InputField
                elementId="todoTitle"
                labelText='New'
                value={workingTodoTitle}
                onChange={(event) => setWorkingTodoTitle(event.target.value)}
                maxLength={100}
                required={true}
                placeholder="Add new todo..."
            />
            <button type="submit" className={styles.addBtn} disabled={!isValidTodoTitle(workingTodoTitle)}>Add Todo</button>
        </form>
    );
};

export default TodoForm;
