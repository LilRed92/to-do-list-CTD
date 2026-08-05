import TodoList from './TodoList.jsx';
import TodoForm from './TodoForm.jsx';
import { useState } from 'react'
import './App.css'


function App() {
const [todoList, setTodoList] = useState([]);

function addTodo(todoTitle) {
  const newTodo = {
    id: Date.now(),
    title: todoTitle,
  };

setTodoList(previous => [newTodo, ...previous]);
};

  return (
    <div className="to-do">
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} />
    </div>
  )
}

export default App
