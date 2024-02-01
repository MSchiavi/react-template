import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface IThemeState {
    backgroundColor: string;
}

const initialState = {
    backgroundColor: "white",
} as IThemeState;

export const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        setBackgroundColor: (state: IThemeState, action: PayloadAction<string>) => {
            state.backgroundColor = action.payload;
        },
    },
});

export const getBackgroundColor = (state: RootState) => state.theme.backgroundColor;

export const { setBackgroundColor } = themeSlice.actions;

export default themeSlice.reducer;
