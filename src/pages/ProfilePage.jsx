import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import ErrorBanner from "../shared/ErrorBanner.jsx";
import styles from "./ProfilePage.module.css";

function ProfilePage() {
  const { email, token } = useAuth();
  const [todoStats, setTodoStats] = useState({
    total: 0,
    completed: 0,
    active: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTodoStats() {
      if (!token) return;

      try {
        setLoading(true);
        setError("");

        const options = {
          method: "GET",
          headers: { "X-CSRF-TOKEN": token },
          credentials: "include",
        };

        const response = await fetch("/api/tasks", options);

        if (response.status === 401) {
          throw new Error("Unauthorized");
        }

        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }

        const todos = await response.json();
        const total = todos.tasks.length;
        const completed = todos.tasks.filter((todo) => todo.isCompleted).length;
        const active = total - completed;

        setTodoStats({ total, completed, active });
      } catch (err) {
        setError(`Error loading statistics: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchTodoStats();
  }, [token]);

  const completionPercentage =
    todoStats.total > 0
      ? Math.round((todoStats.completed / todoStats.total) * 100)
      : 0;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>{email}'s Profile</h2>
        <span className={styles.statusBadge}>Logged In</span>
      </div>

      <h3 className={styles.statsHeading}>📊 Todo Statistics</h3>
      {loading && (
        <p className={styles.loadingIndicator}>Loading statistics...</p>
      )}
      {error && <ErrorBanner>{error}</ErrorBanner>}
      {!loading && !error && (
        <div className={styles.statsList}>
          <div className={styles.statsRow}>
            <p>Total: {todoStats.total}</p>
            <p>Completed: {todoStats.completed}</p>
            <p>Active: {todoStats.active}</p>
          </div>
          {todoStats.total > 0 && (
            <div className={styles.completionSection}>
              <p>Completion: {completionPercentage}%</p>
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
