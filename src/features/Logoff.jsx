import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext.jsx";
import styles from "./Logoff.module.css";

function Logoff() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOff, setIsLoggingOff] = useState(false);
  const [error, setError] = useState("");

  async function handleLogoff() {
    setIsLoggingOff(true);
    setError("");

    const result = await logout();

    if (result.success) {
      navigate("/login");
    } else {
      setError(result.error);
      setIsLoggingOff(false);
    }
  }

  return (
    <div className={styles.logoffContainer}>
      {error && <p className={styles.error}>{error}</p>}
      <button className={styles.logoffBtn} onClick={handleLogoff} disabled={isLoggingOff}>
        {isLoggingOff ? "Logging off..." : "Log Off"}
      </button>
    </div>
  );
}

export default Logoff;
