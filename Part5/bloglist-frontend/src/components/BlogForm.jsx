import { useState } from "react";

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = async (event) => {
    event.preventDefault();
    await createBlog({ title, author, url });
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <form onSubmit={addBlog}>
      <div>
        title
        <input
          data-testid="blog-title-input"
          type="text"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author
        <input
          data-testid="blog-author-input"
          type="text"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url
        <input
          data-testid="blog-url-input"
          type="text"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>

      <button data-testid="create-blog-button" type="submit">
        create
      </button>
    </form>
  );
};
export default BlogForm;
