import TodosPage from "./features/Todos/TodosPage.jsx";
import Logon from "./features/Logon.jsx";
import "./App.css";
import { Routes, Route } from "react-router";
// Page Imports
import Header from "./shared/Header.jsx";

function App() {
  return (
    <div className="to-do">
      <Header />
      <Routes>{/* Routes go here*/}</Routes>
    </div>
  );
}

export default App;
