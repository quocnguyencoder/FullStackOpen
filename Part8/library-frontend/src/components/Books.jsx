import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";
import { useState, useEffect } from "react";

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState(null);

  const result = useQuery(ALL_BOOKS, {
    variables: {
      genre: selectedGenre,
    },
  });

  const books = result.data?.allBooks || [];

  useEffect(() => {
    result.refetch({ genre: selectedGenre });
  }, [selectedGenre, result]);

  const genres = result.data?.allGenres || [];

  if (!props.show) {
    return null;
  }

  return (
    <div>
      <h2>books</h2>
      {selectedGenre && (
        <p>
          in genre <strong>{selectedGenre}</strong>
        </p>
      )}
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

      <div>
        <button
          style={{ color: selectedGenre === null ? "blue" : "black" }}
          onClick={() => setSelectedGenre(null)}
        >
          all genres
        </button>
        {genres.map((genre) => (
          <button
            style={{ color: selectedGenre === genre ? "blue" : "black" }}
            key={genre}
            onClick={() => setSelectedGenre(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Books;
