import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

const initialState = [];

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: initialState,
  reducers: {
    addAnecdote: (state, action) => {
      state.push(action.payload);
    },
    vote: (state, action) => {
      const updatedAnecdote = action.payload;
      const anecdoteIndex = state.findIndex((a) => a.id === updatedAnecdote.id);
      state[anecdoteIndex] = updatedAnecdote;
      return state;
    },

    setAnecdotes: (_state, action) => {
      return action.payload;
    },
  },
});

export const { addAnecdote, vote, setAnecdotes } = anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content);
    dispatch(addAnecdote(newAnecdote));
  };
};

export const handleVote = (selectedAnecdote) => {
  return async (dispatch) => {
    const updatedAnecdote = await anecdoteService.update({
      ...selectedAnecdote,
      votes: selectedAnecdote.votes + 1,
    });
    dispatch(vote(updatedAnecdote));
  };
};

export default anecdoteSlice.reducer;
