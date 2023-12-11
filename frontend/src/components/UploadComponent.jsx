import React from "react";
import { Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUploadMutation } from "../slices/publicApiSlice";
import { setLocalFilePath, setUploaded } from "../slices/publicSlice";
import { toast } from "react-toastify";
const UploadComponent = () => {
  const [fileName, setFileName] = useState("");
  const [upload, { isLoading }] = useUploadMutation();
  const dispatch = useDispatch();
  const localFilePath = useSelector((state) => state.public.localFilePath);
  if (localFilePath && localFilePath !== fileName) setFileName(localFilePath);
  const uploadFiles = async () => {
    if (fileName === "") {
      toast.error("Select a file first.");
    } else {
      var formData = new FormData();

      formData.append("files", fileName[0]);
      try {
        const res = await upload(formData).unwrap();
        toast.success("File uploaded");
        dispatch(setUploaded(res.new_name));
        dispatch(setLocalFilePath(fileName[0].name));
      } catch (err) {
        if (err.status === 500) toast.error("Network Error");
        else toast.error(err?.data?.message || err.error);
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
        {localFilePath?`Current uploaded file is ${fileName}`:""} 
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
