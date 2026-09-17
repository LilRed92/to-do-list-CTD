import styles from "./SortBy.module.css";
import selectStyles from "./Select.module.css";

function SortBy ({ sortBy, sortDirection, onSortByChange, onSortDirectionChange }) {

  return(
    <>
      <label htmlFor="sortBy" className={styles.selectLabel}>
          Sort by
          <select
              id="sortBy"
              value={sortBy}
              name="sortBy"
              onChange={(e) => onSortByChange(e.target.value)}
              className={selectStyles.select}
              >
                <option value="createdAt">Created At</option>
                <option value="title">Title</option>
          </select>
        </label>

        <label htmlFor="sortDirection" className={styles.selectLabel}>
          Order
          <select
              id="sortDirection"
              value={sortDirection}
              name="sortDirection"
              onChange={(e) => onSortDirectionChange(e.target.value)}
              className={selectStyles.select}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
          </select>
        </label>
    </>
  );
}

export default SortBy;