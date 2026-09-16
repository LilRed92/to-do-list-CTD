import styles from "./FilterInput.module.css";

function FilterInput({ filterTerm, onFilterChange }) {
  return (
    <div className={styles.filterContainer}>
      <label htmlFor="filterInput">Search todos:</label>
      <input
        id="filterInput"
        type="text"
        value={filterTerm}
        onChange={(e) => onFilterChange(e.target.value)}
        placeholder="Search by title..."
        maxLength={100}
        className={styles.filterInput}
        />
    </div>
  );
}

export default FilterInput;