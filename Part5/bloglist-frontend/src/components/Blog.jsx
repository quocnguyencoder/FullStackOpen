import { useState } from "react";

const Blog = ({ blog, updateBlog, deleteBlog }) => {
  const [toggleDetails, setToggleDetails] = useState(false);
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };
  const currentUser = JSON.parse(localStorage.getItem("loggedBlogAppUser"));

  const checkIfUserIsOwner = (blogUser) => {
    if (currentUser) {
      return currentUser.username === blogUser.username;
    }
    return false;
  };

  const handleLike = async () => {
    const newBlog = {
      ...blog,
      user: blog.user._id,
      likes: blog.likes + 1,
    };
    await updateBlog(newBlog);
  };

  const handleDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await deleteBlog(blog.id);
    }
  };

  return (
    <div className="blog-item" style={blogStyle}>
      <div>
        <span>{blog.title}</span> - <span>{blog.author}</span>
        <button
          data-testid="view-button"
          onClick={() => setToggleDetails(!toggleDetails)}
        >
          {toggleDetails ? "hide" : "view"}
        </button>
      </div>
      {toggleDetails && (
        <div>
          <p data-testid="url">{blog.url}</p>
          <p data-testid="likes">
            likes {blog.likes}
            <button data-testid="like-button" onClick={handleLike}>
              like
            </button>
          </p>
          <p>{blog.user.name}</p>
          {checkIfUserIsOwner(blog.user) && (
            <button
              data-testid="delete-button"
              onClick={() => handleDelete(blog.id)}
            >
              delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
