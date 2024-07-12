import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";
import loginService from "../services/login";
import { showErrorNotification } from "./notificationReducer";

const currentUserSlice = createSlice({
  name: "currentUser",
  initialState: null,
  reducers: {
    setUser(_state, action) {
      return action.payload;
    },
  },
});

export const { setUser } = currentUserSlice.actions;

export const initializeCurrentUser = () => {
  return async (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      blogService.setToken(user.token);
      dispatch(setUser(user));
    }
  };
};

export const login = (username, password) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      blogService.setToken(user.token);
      dispatch(setUser(user));
    } catch (error) {
      dispatch(showErrorNotification("Wrong username or password"));
    }
  };
};

export const logout = () => {
  return async (dispatch) => {
    window.localStorage.removeItem("loggedBlogAppUser");
    dispatch(setUser(null));
  };
};

export default currentUserSlice.reducer;
