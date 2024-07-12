import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../reducers/notificationReducer";

const initialBlogs = [];

const blogSlice = createSlice({
  name: "blogs",
  initialState: initialBlogs,
  reducers: {
    setBlogs(_state, action) {
      return action.payload;
    },
    addBlog(state, action) {
      state.push(action.payload);
    },

    deleteBlogAction(state, action) {
      const id = action.payload;
      return state.filter((blog) => blog.id !== id);
    },

    updateBlogAction(state, action) {
      const updatedBlog = action.payload;
      const index = state.findIndex((blog) => blog.id === updatedBlog.id);
      if (index !== -1) {
        state[index] = updatedBlog;
      }
    },
  },
});

export const { setBlogs, addBlog, deleteBlogAction, updateBlogAction } =
  blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (blog) => {
  return async (dispatch) => {
    try {
      const newBlog = await blogService.create(blog);
      dispatch(addBlog(newBlog));
      dispatch(showSuccessNotification("Blog created successfully"));
    } catch (error) {
      dispatch(
        showErrorNotification(`Failed to create blog - ${error.message}`),
      );
    }
  };
};

export const deleteBlog = (id) => {
  return async (dispatch) => {
    try {
      await blogService.remove(id);
      dispatch(deleteBlogAction(id));
    } catch (error) {
      dispatch(
        showErrorNotification(`Failed to delete blog - ${error.message}`),
      );
    }
  };
};

export const updateBlog = (blog) => {
  return async (dispatch) => {
    try {
      const updatedBlog = await blogService.update(blog);
      dispatch(updateBlogAction(updatedBlog));
    } catch (error) {
      dispatch(
        showErrorNotification(`Failed to update blog - ${error.message}`),
      );
    }
  };
};

export const addComment = (id, comment) => {
  return async (dispatch) => {
    try {
      const updatedBlog = await blogService.comment(id, comment);
      dispatch(updateBlogAction(updatedBlog));
    } catch (error) {
      dispatch(
        showErrorNotification(`Failed to add comment - ${error.message}`),
      );
    }
  };
};

export default blogSlice.reducer;
