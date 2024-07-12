import { Stack } from "@mui/material";
import Blog from "./Blog";
const BlogList = ({ blogs }) => {
  if (!blogs) return null;

  return (
    <Stack spacing={2}>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </Stack>
  );
};
export default BlogList;
