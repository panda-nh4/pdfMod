import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  email: "",
  files: null,
  shared: null,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoginValues: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
    setLogoutValues: (state, action) => {
      state.name = "";
      state.email = "";
      state.files = null;
      state.shared = null;
    },
    setSharedFiles: (state, action) => {
      state.shared = action.payload.files;
    },
    setFiles: (state, action) => {
      state.files = action.payload.files;
    },
  },
});

export const { setLoginValues, setLogoutValues, setFiles, setSharedFiles } =
  userSlice.actions;

export default userSlice.reducer;
