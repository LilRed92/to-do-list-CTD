import { useState } from 'react';


function TodoForm ({ onAddTodo }) {
    const [workingTodoTitle, setWorkingTodoTitle] = useState("");

    const handleAddTodo = (event) => {
        event.preventDefault();

        if (workingTodoTitle.trim()) {
            onAddTodo(workingTodoTitle);
            setWorkingTodoTitle("");
        }
    };

    return (
        <form onSubmit={handleAddTodo}>
            <label htmlFor="todoTitle">Todo</label>
            <input
            value={workingTodoTitle}
            onChange={(event) => setWorkingTodoTitle(event.target.value)}
            type="text"
            id="todoTitle"
            name="todoTitle"
            placeholder={'Todo text'}
            required
             />
            <button type="submit" disabled={!workingTodoTitle.trim()}>Add Todo</button>
        </form>
    );
};

export default TodoForm;