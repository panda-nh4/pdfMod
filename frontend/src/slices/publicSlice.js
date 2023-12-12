import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  localFilePath: null,
  uploadedFileName: null,
  uploadedFileData: null,
  pagesArray: [],
  selectedPages: [],
  downloadLink: null,
};

const publicSlice = createSlice({
  name: "public",
  initialState,
  reducers: {
    setLocalFilePath: (state, action) => {
      state.localFilePath = action.payload;
    },
    setUploaded: (state, action) => {
      state.uploadedFileName = action.payload;
    },
    setUploadedFileData: (state, action) => {
      state.uploadedFileData = action.payload;
    },
    setPageArray: (state, action) => {
      state.pagesArray = action.payload;
    },
    setDownloadLink: (state, action) => {
      state.downloadLink = action.payload;
    },
    setSelectedPages: (state, action) => {
      state.selectedPages = action.payload;
    },
    resetPublicState: (state) => {
      state.localFilePath = null;
      state.uploadedFileName = null;
      state.uploadedFileData = null;
      state.pagesArray = [];
      state.selectedPages = [];
      state.downloadLink = null;
    },
  },
});

export const {
  setLocalFilePath,
  setUploaded,
  setPageArray,
  setDownloadLink,
  setUploadedFileData,
  setSelectedPages,
  resetPublicState,
} = publicSlice.actions;

export default publicSlice.reducer;
