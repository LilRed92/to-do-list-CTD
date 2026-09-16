import InputField from "./InputField.jsx";

function FilterInput({ filterTerm, onFilterChange }) {
  return (
    <InputField
      elementId="filterInput"
      labelText="Search"
      value={filterTerm}
      onChange={(e) => onFilterChange(e.target.value)}
      placeholder="Search by title..."
      maxLength={100}
    />
  );
}

export default FilterInput;
