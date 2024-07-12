const Total = ({ parts }) => {
  const total = parts.reduce((sum, cur) => {
    return sum + cur.exercises;
  }, 0);
  return <p>Number of exercises {total}</p>;
};

export default Total;
