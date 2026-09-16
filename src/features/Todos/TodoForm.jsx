import { useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel.jsx';
import { isValidTodoTitle } from '../../utils/todoValidation.js';
import styles from './TodoForm.module.css';

function TodoForm ({ onAddTodo }) {
    const [workingTodoTitle, setWorkingTodoTitle] = useState("");

    const handleAddTodo = (event) => {
        event.preventDefault();

        if (isValidTodoTitle(workingTodoTitle)) {
            onAddTodo(workingTodoTitle.trim());
            setWorkingTodoTitle("");
        }
    };

    return (
        <form onSubmit={handleAddTodo} className={styles.formContainer}>
            <TextInputWithLabel
                elementId="todoTitle"
                labelText='Todo'
                value={workingTodoTitle}
                onChange={(event) => setWorkingTodoTitle(event.target.value)}
                maxLength={100}
                required={true}
            />
            <button type="submit" className={styles.addBtn} disabled={!isValidTodoTitle(workingTodoTitle)}>Add Todo</button>
        </form>
    );
};

export default TodoForm;