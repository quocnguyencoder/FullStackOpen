import { useSelector, useDispatch } from "react-redux";
import { handleVote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const AnecdoteList = () => {
  const anecdotes = useSelector((state) => {
    const filter = state.filter;
    let displayedAnecdotes = [...state.anecdotes];

    if (filter !== "") {
      displayedAnecdotes = state.anecdotes.filter((anecdote) =>
        anecdote.content.includes(filter)
      );
    } else {
      displayedAnecdotes = [...state.anecdotes];
    }

    displayedAnecdotes.sort((a, b) => b.votes - a.votes);
    return displayedAnecdotes;
  });
  const dispatch = useDispatch();

  const handleClick = (anecdote) => {
    dispatch(handleVote(anecdote));
    dispatch(setNotification(`you voted for '${anecdote.content}'`, 5000));
  };

  return (
    <>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleClick(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </>
  );
};
export default AnecdoteList;
