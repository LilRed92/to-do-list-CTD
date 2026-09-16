import styles from "./InputField.module.css";

function InputField({
  elementId,
  labelText,
  value,
  onChange,
  maxLength,
  required,
  placeholder,
}) {
  const isAtLimit = Boolean(maxLength) && (value?.length || 0) >= maxLength;

  return (
    <div className={styles.container}>
      {isAtLimit && (
        <p className={styles.limitMessage}>
          Maximum length reached ({maxLength} characters).
        </p>
      )}
      <div className={styles.row}>
        <label htmlFor={elementId} className={styles.label}>
          {labelText}
        </label>
        <input
          type="text"
          id={elementId}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          required={required}
          placeholder={placeholder}
          className={styles.input}
        />
      </div>
    </div>
  );
}

export default InputField;
