import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: 'null',
    allUsers: [],
    validationError: '',
    addAndRemoveFriend: {
      addFriendId: '',
      removeFriendId: '',
    },
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
    logoutUser: (state) => {
      state.currentUser = 'null';
      state.allUsers = []
    },
    setValidationError: (state, action) => {
      state.validationError = action.payload;
    },
    setAddFriendId: (state, action) => {
      state.addAndRemoveFriend.addFriendId = action.payload;
    },
    setRemoveFriendId: (state, action) => {
      state.addAndRemoveFriend.removeFriendId = action.payload;
    },
  },
});

export const {setCurrentUser, setAllUsers, logoutUser, setValidationError, setAddFriendId, setRemoveFriendId} = userSlice.actions;

export default userSlice.reducer;