import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";

const Recommendations = (props) => {
  const currentUser = JSON.parse(localStorage.getItem("library-user"));

  const result = useQuery(ALL_BOOKS, {
    variables: {
      genre: currentUser?.user.favoriteGenre || null,
    },
  });

  const books = result.data?.allBooks || [];

  if (!props.show || !currentUser?.user) {
    return null;
  }

  return (
    <div>
      <h2>books</h2>
      <p>
        in your favorite genre{" "}
        <strong>{currentUser?.user.favoriteGenre}</strong>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommendations;
