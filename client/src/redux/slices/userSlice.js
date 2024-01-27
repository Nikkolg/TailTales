import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: 'null',
    allUsers: [],
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setAllUsers: (state, action) => {
      state.allUsers = action.payload;
    },
  },
});

export const { setCurrentUser, setAllUsers } = userSlice.actions;

export default userSlice.reducer;