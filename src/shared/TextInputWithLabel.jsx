import styles from "./TextInputWithLabel.module.css";

function TextInputWithLabel({
    elementId,
    labelText,
    onChange,
    ref,
    value,
    maxLength,
    required,
    placeholder
  }) {
    const isAtLimit = Boolean(maxLength) && (value?.length || 0) >= maxLength;

    return (
      <div className={styles.inputGroup}>
        <label htmlFor={elementId} className={styles.label}>{labelText}</label>
        {isAtLimit && (
          <p className={styles.limitMessage}>
            Maximum length reached ({maxLength} characters).
          </p>
        )}
        <input
          type="text"
          id={elementId}
          ref={ref}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          required={required}
          placeholder={placeholder}
          className={styles.input}
        />
      </div>
    );
  }

  export default TextInputWithLabel;