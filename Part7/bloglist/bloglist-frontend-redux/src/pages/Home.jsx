import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import BlogForm from "../components/BlogForm";
import Togglable from "../components/Togglable";
import BlogList from "../components/BlogList";
import CreateIcon from "@mui/icons-material/Create";

import { initializeBlogs, createBlog } from "../reducers/blogsReducer";
import { Stack, Typography } from "@mui/material";

const Home = () => {
  const blogFormRef = useRef();
  const dispatch = useDispatch();
  const blogs = useSelector((state) =>
    [...state.blogs].sort((a, b) => b.likes - a.likes),
  );

  useEffect(() => {
    dispatch(initializeBlogs());
  }, []);

  const handleCreateBlog = (newBlog) => {
    blogFormRef.current.toggleVisibility();
    dispatch(createBlog(newBlog));
  };

  return (
    <>
      <Stack
        alignItems={"center"}
        justifyContent={"center"}
        paddingTop={"24px"}
        minHeight={"5vh"}
      >
        <Togglable
          buttonLabel="Create new blog"
          icon={<CreateIcon />}
          ref={blogFormRef}
        >
          <BlogForm createBlog={handleCreateBlog} />
        </Togglable>
      </Stack>
      <Typography variant="h5" paddingBottom={"12px"} color={"primary"}>
        Blogs
      </Typography>
      <BlogList blogs={blogs} />
    </>
  );
};
export default Home;
