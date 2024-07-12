import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  addComment,
  initializeBlogs,
  updateBlog,
} from "../reducers/blogsReducer";
import { Link } from "react-router-dom";

const BlogDetailPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const blogs = useSelector((state) => state.blogs);
  const blog = blogs.find((blog) => blog.id === id);

  useEffect(() => {
    if (blogs.length === 0) {
      dispatch(initializeBlogs());
    }
  });

  const handleLike = () => {
    const newBlog = {
      ...blog,
      user: blog.user._id,
      likes: blog.likes + 1,
    };
    dispatch(updateBlog(newBlog));
  };

  const handleComment = (event) => {
    event.preventDefault();
    dispatch(addComment(blog.id, event.target.comment.value));
    event.target.comment.value = "";
  };

  if (!blog) {
    return <div>Blog not found</div>;
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <a href={blog.url}>{blog.url}</a>
      <p>
        {blog.likes} likes
        <button onClick={handleLike}>like</button>
      </p>
      <p>
        added by <Link to={`/users/${blog.user.id}`}>{blog.user.name}</Link>
      </p>
      <h2>Comments</h2>
      <ul>
        {blog.comments.map((comment) => (
          <li key={comment}>{comment}</li>
        ))}
      </ul>
      <h2>Add comment</h2>
      <form onSubmit={handleComment}>
        <div>
          <input name="comment" />
          <button>add comment</button>
        </div>
      </form>
    </div>
  );
};
export default BlogDetailPage;
