const AnecdoteInfo = ({ text, votes }) => {
  return (
    <>
      <p>{text}</p>
      <p>has {votes} votes</p>
    </>
  );
};
export default AnecdoteInfo;
