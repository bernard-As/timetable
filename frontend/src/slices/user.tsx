import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// Define the user state type
interface UserState {
    isLoggedIn: boolean;
    userData: any; // Replace 'any' with the actual type of user data
    group: any; // Replace 'any' with the actual type of group
  }
  
  // Define the initial state
  const initialState: UserState = {
    isLoggedIn: false,
    userData: null,
    group: null,
  };
  
  // Create the user slice
  export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
      loginSuccess: (state, action: PayloadAction<any>) => {
        state.isLoggedIn = true;
        state.userData = action.payload;
      },
      logoutSuccess: (state) => {
        state.isLoggedIn = false;
        state.userData = null;
      },
      setGroup: (state, action: PayloadAction<any>) => {
        state.group = action.payload;
      },
    },
  });