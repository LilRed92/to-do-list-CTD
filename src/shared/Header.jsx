import Logoff from "../features/Logoff.jsx";
import Navigation from "./Navigation.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useTheme } from "../contexts/ThemeContext.jsx";
import styles from "./Header.module.css";

function Header() {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.headerContainer}>
      <h1 className={styles.title}>Todo List</h1>
      <div className={styles.controls}>
        <Navigation />
        {isAuthenticated && <Logoff />}
        <button className={styles.themeToggle} onClick={toggleTheme}>
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>
    </header>
  );
}

export default Header;
