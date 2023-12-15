import React from "react";
import { Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUploadMutation } from "../slices/publicApiSlice";
import {
  resetPublicState,
  setLocalFilePath,
  setUploaded,
} from "../slices/publicSlice";
import { toast } from "react-toastify";
import { useUserUploadMutation } from "../slices/userApiSlice";
const UploadComponent = () => {
  const [fileName, setFileName] = useState([]);
  const name = useSelector((state) => state.user.name);
  const [upload, { isLoading }] = name
    ? useUserUploadMutation()
    : useUploadMutation();
  const dispatch = useDispatch();
  const localFilePath = useSelector((state) => state.public.localFilePath);
  const uploadFiles = async () => {
    if (fileName.length === 0) {
      toast.error("Select a file first.");
    } else if (fileName[0].name.length>3 && fileName[0].name.slice(-3)!=="pdf") {
      toast.error("Invalid file");
    } else if (localFilePath === fileName[0].name) {
      toast.error("File already uploaded.");
    } else {
      var formData = new FormData();

      formData.append("files", fileName[0]);
      try {
        const res = await upload(formData).unwrap();
        dispatch(resetPublicState());
        toast.success("File uploaded");
        dispatch(setUploaded(res.new_name));
        dispatch(setLocalFilePath(fileName[0].name));
      } catch (err) {
        if (err.status >= 500) toast.error("Server Error");
        else {
          if (err.status === 401) toast.error("Unauthorised. Login in first.");
          else if (err.status === 413) toast.error("File too large");
          else
            toast.error(
              err?.data?.message || err.error || `${err.status} Error`
            );
        }
      }
    }
  };
  return (
    <div
      style={{
        width: "100%",
        borderRadius: "25px",
        backgroundColor: "#d90940",
        color: "white",
        fontFamily: "Roboto",
      }}
    >
      <div
        style={{
          justifyContent: "center",
          display: "flex",
        }}
      >
        {isLoading ? (
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <CircularProgress style={{ color: "white" }} />
            <span>
              <h4>Uploading</h4>
            </span>
          </div>
        ) : (
          <h2>Upload PDF</h2>
        )}
      </div>
      <div
        style={{
          width: "90%",
          padding: "2%",
          display: "flex",
        }}
      >
        {localFilePath ? `Current uploaded file is ${localFilePath}` : ""}
      </div>
      <div
        style={{
          width: "90%",
          padding: "2%",
          display: "flex",
        }}
      >
        <input
          style={{
            margin: "5px",
            width: "100%",
            padding: "5px",
          }}
          onChange={(e) => setFileName(e.target.files)}
          type="file"
          accept="application/pdf"
        />
        <Button
          style={{ backgroundColor: "white" }}
          onClick={() => uploadFiles()}
        >
          Upload
        </Button>
      </div>
    </div>
  );
};

export default UploadComponent;
