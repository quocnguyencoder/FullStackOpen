import { createSlice } from "@reduxjs/toolkit";

const initialNotification = {
  message: null,
  type: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState: initialNotification,
  reducers: {
    setNotification(_state, action) {
      return action.payload;
    },
    clearNotification() {
      return initialNotification;
    },
  },
});

export const { setNotification, clearNotification } = notificationSlice.actions;

export const showSuccessNotification = (message) => {
  return (dispatch) => {
    dispatch(setNotification({ message, type: "success" }));
    setTimeout(() => {
      dispatch(clearNotification());
    }, 5000);
  };
};

export const showErrorNotification = (message) => {
  return (dispatch) => {
    dispatch(setNotification({ message, type: "error" }));
    setTimeout(() => {
      dispatch(clearNotification());
    }, 5000);
  };
};

export default notificationSlice.reducer;
