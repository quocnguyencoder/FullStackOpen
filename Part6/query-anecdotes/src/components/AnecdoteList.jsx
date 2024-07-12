import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getAll, updateAnecdote } from "../requests";
import {
  showNotification,
  useNotificationDispatch,
} from "../contexts/NotificationContext";

const AnecdoteList = () => {
  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAll,
  });
  const queryClient = useQueryClient();
  const voteMutation = useMutation({ mutationFn: updateAnecdote });
  const notiDispatch = useNotificationDispatch();

  const handleVote = (anecdote) => {
    const newAnecdote = { ...anecdote, votes: anecdote.votes + 1 };

    voteMutation.mutate(newAnecdote, {
      onSuccess: () => {
        const previousAnecdotes = queryClient.getQueryData(["anecdotes"]);
        queryClient.setQueryData(
          ["anecdotes"],
          previousAnecdotes.map((a) =>
            a.id === newAnecdote.id ? newAnecdote : a
          )
        );

        notiDispatch(showNotification(`you voted '${anecdote.content}'`));
      },
    });
  };

  if (result.isLoading) {
    return <p>Loading...</p>;
  }

  if (result.isError) {
    return <p>Error: {result.error.message}</p>;
  }

  return (
    <div>
      {result.data.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};
export default AnecdoteList;
