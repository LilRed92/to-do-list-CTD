import styles from "./TextInputWithLabel.module.css";

function TextInputWithLabel({
    elementId,
    labelText,
    onChange,
    ref,
    value,
    maxLength,
    required
  }) {
    return (
      <div className={styles.inputGroup}>
        <label htmlFor={elementId} className={styles.label}>{labelText}</label>
        <input
          type="text"
          id={elementId}
          ref={ref}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          required={required}
          className={styles.input}
        />
      </div>
    );
  }

  export default TextInputWithLabel;