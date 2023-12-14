import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  localFilePath: "",
  uploadedFileName: null,
  uploadedFileData: null,
  oldFileName: "",
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
    setOldFileName: (state, action) => {
      state.oldFileName = action.payload;
    },
    setDownloadLink: (state, action) => {
      state.downloadLink = action.payload;
    },
    setSelectedPages: (state, action) => {
      state.selectedPages = action.payload;
    },
    resetDownloadLink: (state, action) => {
      state.downloadLink = null;
    },
    setUploadedFileName: (state, action) => {
      state.uploadedFileName = action.payload;
    },
    resetPublicState: (state) => {
      state.localFilePath = "";
      state.uploadedFileName = null;
      if (state.uploadedFileData) URL.revokeObjectURL(state.uploadedFileData);
      state.uploadedFileData = null;
      state.oldFileName = "";
      state.selectedPages = [];
      state.downloadLink = null;
    },
  },
});

export const {
  setLocalFilePath,
  setUploaded,
  setOldFileName,
  setDownloadLink,
  setUploadedFileData,
  setSelectedPages,
  resetPublicState,
  resetDownloadLink,
  setUploadedFileName,
} = publicSlice.actions;

export default publicSlice.reducer;
