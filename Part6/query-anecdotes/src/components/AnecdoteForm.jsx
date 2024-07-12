import {
  showNotification,
  useNotificationDispatch,
} from "../contexts/NotificationContext";
import { createAnecdote } from "../requests";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AnecdoteForm = () => {
  const queryClient = useQueryClient();
  const newAnecdoteMutation = useMutation({ mutationFn: createAnecdote });
  const notiDispatch = useNotificationDispatch();

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    if (content.length < 5) {
      notiDispatch(
        showNotification("anecdote must be at least 5 characters long")
      );
      return;
    }

    event.target.anecdote.value = "";

    newAnecdoteMutation.mutate(
      { content, votes: 0 },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
          notiDispatch(showNotification(`you created '${content}'`));
        },
      }
    );
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
