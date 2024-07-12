/* eslint-disable react/prop-types */
const AnecdoteDetail = ({ anecdote }) => {
  if (!anecdote) return null;
  return (
    <div>
      <h2>{`${anecdote.content} by ${anecdote.author}`}</h2>
      <div>has: {anecdote.votes} votes</div>
      <div>
        for more info see: <a href={anecdote.info}>{anecdote.info}</a>
      </div>
    </div>
  );
};

export default AnecdoteDetail;
