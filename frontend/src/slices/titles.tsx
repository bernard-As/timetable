import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TitlesInt {
    id: any;
    name: string;
    shortname: string;
}

const initialState: TitlesInt[] = [
   
];
  

export const titlesSlice = createSlice({
    name: 'titles',
    initialState,
    reducers: {
      setTitles: (state, action: PayloadAction<TitlesInt[]>) => {
        state.push (...action.payload);
      },
    },
});