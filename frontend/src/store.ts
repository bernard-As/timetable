// Import necessary modules
import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from './slices/user';
import {titlesSlice} from './slices/titles';

// Export the actions
export const { loginSuccess, logoutSuccess, setGroup } = userSlice.actions;
export const {setTitles} = titlesSlice.actions
// Create the store
export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    titles: titlesSlice.reducer,
  },
});
