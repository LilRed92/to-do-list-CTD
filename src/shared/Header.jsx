import Logoff from "../features/Logoff.jsx";
import Navigation from "./Navigation.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

function Header() {
  const { isAuthenticated } = useAuth();
  return (
    <header>
      <h1>Todo List</h1>
      <Navigation />
      {isAuthenticated && <Logoff />}
    </header>
  );
}

export default Header;
