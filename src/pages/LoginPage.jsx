import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext.jsx";

import styles from "./LoginPage.module.css";

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoggingOn, setIsLoggingOn] = useState(false);

  const from = location.state?.from?.pathname || "/todos";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoggingOn(true);
    setAuthError("");

    const result = await login(email, password);
    if (!result.success) {
      setAuthError(result.error);
    }

    setIsLoggingOn(false);
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.title}>Log On</h2>
      {authError && <p className={styles.error}>{authError}</p>}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={100}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            maxLength={100}
          />
        </div>
        <button type="submit" className={styles.submitBtn} disabled={isLoggingOn}>
          {isLoggingOn ? "Logging in..." : "Log On"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
