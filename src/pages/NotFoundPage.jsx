import { Link } from "react-router";

function NotFoundPage() {
  return (
    <div>
      <h2>404: Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/login">Log In</Link>
      </nav>
    </div>
  );
}

export default NotFoundPage;
