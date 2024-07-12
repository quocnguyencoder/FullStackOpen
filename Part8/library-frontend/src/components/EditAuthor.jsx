import { useMutation } from "@apollo/client";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";
const EditAuthor = ({ authors }) => {
  const [updateAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  const handleUpdate = (event) => {
    event.preventDefault();

    const name = event.target.name.value;
    const birthyear = event.target.birthyear.value;
    updateAuthor({ variables: { name, born: Number(birthyear) } });
  };
  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={handleUpdate}>
        <div>
          name
          <select name="name">
            {authors.map((a) => (
              <option key={a.name} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          born
          <input name="birthyear" type="number" />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};
export default EditAuthor;
