function SortBy ({ sortBy, sortDirection, onSortByChange, onSortDirectionChange }) {

  return(
    <>
      <label htmlFor="sortBy">
          Sort by
          <select
              id="sortBy"
              value={sortBy}
              name="sortBy"
              onChange={(e) => onSortByChange(e.target.value)}
              >
                <option value="createdAt">Created At</option>
                <option value="title">Title</option>
          </select>
        </label>

        <label htmlFor="sortDirection">
          Order
          <select
              id="sortDirection"
              value={sortDirection}
              name="sortDirection"
              onChange={(e) => onSortDirectionChange(e.target.value)}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
          </select>
        </label>
    </>
  );
}

export default SortBy;