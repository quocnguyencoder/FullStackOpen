import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import { useRef } from "react";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [sortedBlogs, setSortedBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    setSortedBlogs(blogs.sort((a, b) => b.likes - a.likes));
  }, [blogs]);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      setUser(user);
      setUsername("");
      setPassword("");
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      blogService.setToken(user.token);
    } catch (exception) {
      setErrorMessage("Wrong username or password");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const createBlog = async (newBlog) => {
    try {
      blogFormRef.current.toggleVisibility();
      const response = await blogService.create(newBlog);

      setSuccessMessage(
        `a new blog ${response.title} by ${response.author} added`,
      );
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);

      setBlogs(blogs.concat(response));
    } catch {
      setErrorMessage("Something went wrong");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const updateBlog = async (blog) => {
    try {
      const response = await blogService.update(blog);
      setBlogs(blogs.map((b) => (b.id === blog.id ? response : b)));
    } catch {
      setErrorMessage("Something went wrong");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem("loggedBlogAppUser");
  };

  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id);
      setBlogs(blogs.filter((blog) => blog.id !== id));
    } catch {
      setErrorMessage("Something went wrong");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  if (!user) {
    return (
      <div>
        <h2>login</h2>
        <p data-testid="login-form-error-message" style={{ color: "red" }}>
          {errorMessage}
        </p>
        <form onSubmit={handleLogin} data-testid="login-form">
          <div>
            username
            <input
              data-testid="username-input"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              data-testid="password-input"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button data-testid="login-button" type="submit">
            login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <p data-testid="blog-form-success-message" style={{ color: "green" }}>
        {successMessage}
      </p>
      <p data-testid="blog-form-error-message" style={{ color: "red" }}>
        {errorMessage}
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
      >
        <p data-testid="logged-in-user-info">{user.name} logged in</p>
        <button data-testid="logout-button" onClick={handleLogout}>
          logout
        </button>
      </div>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>

      {sortedBlogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          deleteBlog={deleteBlog}
        />
      ))}
    </div>
  );
};

export default App;
