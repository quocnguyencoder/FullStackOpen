import { useEffect, useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { useMutation, useApolloClient, useSubscription } from "@apollo/client";
import { LOGIN } from "./queries";
import Login from "./components/Login";
import Recommendations from "./components/Recommendations";
import { BOOK_ADDED, ALL_BOOKS } from "./queries";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const client = useApolloClient();

  const [login, result] = useMutation(LOGIN, {
    onCompleted: () => {
      setPage("authors");
    },
    onError: (error) => {
      setToken(null);
      alert(error.graphQLErrors[0].message);
    },
  });

  useEffect(() => {
    if (result.data) {
      const user = result.data.login;
      setToken(user.token);
      localStorage.setItem("library-user", JSON.stringify(user));
    }
  }, [result.data]);

  const handleLogin = async (event) => {
    event.preventDefault();
    login({
      variables: {
        username: event.target.username.value,
        password: event.target.password.value,
      },
    });
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    if (page === "add") {
      setPage("authors");
    }
  };

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded;
      alert(`added a new book: ${addedBook.title}`);

      client.cache.updateQuery({ query: ALL_BOOKS }, (result) => {
        const allBooks = result?.allBooks || [];
        const allGenres = result?.allGenres || [];
        console.log(
          "🚀 ~ client.cache.updateQuery ~ allBooks:",
          allBooks,
          allGenres
        );
        return {
          allBooks: allBooks.concat(addedBook),
          allGenres: [...new Set(allBooks.flatMap((b) => b.genres))],
        };
      });
    },
  });

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommend")}>recommend</button>
            <button onClick={handleLogout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
      </div>

      <Authors show={page === "authors"} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />

      <Recommendations show={page === "recommend"} />

      <Login show={page === "login"} handleLogin={handleLogin} />
    </div>
  );
};

export default App;
