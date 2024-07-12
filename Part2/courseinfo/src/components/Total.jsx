const Total = ({ parts }) => {
  const total = parts.reduce((sum, cur) => {
    return sum + cur.exercises;
  }, 0);
  return <p style={{ fontWeight: "bold" }}>total of {total} exercises </p>;
};

export default Total;
