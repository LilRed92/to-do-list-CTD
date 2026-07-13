import TodoList from './Components/TodoList.jsx';
import TodoForm from './Components/TodoForm.jsx';
import './App.css'

function App() {



  return (
    <div className="to-do">
      <h1>My To-dos</h1>
      <TodoForm />
      <TodoList />
    </div>
  )
}

export default App
