import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  // const storedTheme = "dark";
  // return storedTheme === "dark" ? "dark" : "light";
  return "dark";
};

const initialState = {
  theme: getInitialTheme(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
