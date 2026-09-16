import { Link } from "react-router";
import styles from "./NotFoundPage.module.css";

function NotFoundPage() {
  return (
    <div className={styles.notFoundContainer}>
      <h2 className={styles.title}>404: Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <nav className={styles.navLinks}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/login">Log In</Link>
      </nav>
    </div>
  );
}

export default NotFoundPage;
