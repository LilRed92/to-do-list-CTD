import styles from "./ErrorBanner.module.css";

function ErrorBanner({ variant = "error", children }) {
  const variantClass = variant === "warning" ? styles.warning : "";

  return <div className={`${styles.banner} ${variantClass}`}>{children}</div>;
}

export default ErrorBanner;
