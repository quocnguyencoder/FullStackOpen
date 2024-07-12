const Filter = ({ value, onFilterChange }) => {
  return (
    <div>
      filter shown with <input value={value} onChange={onFilterChange} />
    </div>
  );
};
export default Filter;
