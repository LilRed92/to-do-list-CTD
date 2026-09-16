import styles from "./AboutPage.module.css";

function AboutPage() {
  return (
    <div className={styles.aboutContainer}>
      <h2 className={styles.title}>About This App</h2>
      <p>
        This is a todo list app for creating, sorting, filtering, and completing
        tasks. Todos are saved to a server so they persist across sessions.
      </p>
      <h3>Features</h3>
      <ul>
        <li>Create and complete todos</li>
        <li>Sort todos by creation date or title</li>
        <li>Search todos by title</li>
        <li>Filter todos by status via the URL</li>
        <li>Protected pages that require login</li>
      </ul>
      <h3>Built With</h3>
      <ul>
        <li>React</li>
        <li>React Router</li>
        <li>Vite</li>
      </ul>
    </div>
  );
}

export default AboutPage;
