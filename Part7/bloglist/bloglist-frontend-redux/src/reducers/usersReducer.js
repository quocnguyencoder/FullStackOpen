import { createSlice } from "@reduxjs/toolkit";
import usersService from "../services/users";
import { showErrorNotification } from "./notificationReducer";

const initialUsers = [];

const userSlice = createSlice({
  name: "users",
  initialState: initialUsers,
  reducers: {
    setUsers(_state, action) {
      return action.payload;
    },
  },
});

export const { setUsers } = userSlice.actions;

export const initializeUsers = () => {
  return async (dispatch) => {
    try {
      const users = await usersService.getAll();
      dispatch(setUsers(users));
    } catch (error) {
      dispatch(showErrorNotification(error.message));
    }
  };
};

export default userSlice.reducer;
