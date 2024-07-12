import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./reducers/notificationReducer";
import blogReducer from "./reducers/blogsReducer";
import currentUserReducer from "./reducers/currentUserReducer";
import usersReducer from "./reducers/usersReducer";

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer,
    currentUser: currentUserReducer,
    users: usersReducer,
  },
});

export default store;
