import TodoList from './TodoList.jsx';
import TodoForm from './TodoForm.jsx';
import { useState } from 'react'
import './App.css'

const todos = [
  {id: 1, title: "review resources"},
  {id: 2, title: "take notes"},
  {id: 3, title: "code out app"},
];

function App() {
const [todoList, setTodoList] = useState(todos);


  return (
    <div className="to-do">
      <h1>Todo List</h1>
      <TodoForm />
      <TodoList todoList={todoList} />
    </div>
  )
}

export default App
