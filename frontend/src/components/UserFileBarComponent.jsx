import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import GetAppIcon from "@mui/icons-material/GetApp";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import { toast } from "react-toastify";
import {
  useDeleteFileMutation,
  useLazyUserGetFilesQuery,
  useLazyUserGetSharedQuery,
  useLazyUserViewFileQuery,
  useShareFileMutation,
} from "../slices/userApiSlice";
import { useDispatch } from "react-redux";
import { setFiles, setSharedFiles } from "../slices/userSlice";
import {
  resetPublicState,
  setLocalFilePath,
  setOldFileName,
  setSelectedPages,
  setUploadedFileData,
  setUploadedFileName,
} from "../slices/publicSlice";
import { useNavigate } from "react-router-dom";

const UserFileBarComponent = ({ fileData, isShared }) => {
  const dispatch = useDispatch();
  const [getShared, getSharedReq] = useLazyUserGetSharedQuery();
  const [share, shareFileReq] = useShareFileMutation();
  const [fileDeleteCall, deleteReq] = useDeleteFileMutation();
  const [getFiles, getFileReq] = useLazyUserGetFilesQuery();
  const [view] = useLazyUserViewFileQuery();
  const navigate=useNavigate()
  const deleteFile = async () => {
    try {
      const res = await fileDeleteCall({ fileId: fileData._id }).unwrap();
      const res1 = await getFiles().unwrap();
      dispatch(setFiles(res1));
      toast("File deleted");
    } catch (err) {
      if (err.status >= 500) toast.error("Server Error");
      else {
        if (err.status === 401) toast.error("Unauthorised. Login in first.");
        else
          toast.error(err?.data?.message || err.error || `${err.status} Error`);
      }
    }
  };
  const editFile = async () => {
    try {
      dispatch(resetPublicState());
      const res = await view({ fileName: fileData.originalFileName }).unwrap();
      const resBlob = new Blob([res]);
      const pdfURI = URL.createObjectURL(resBlob);
      dispatch(setUploadedFileData(pdfURI));
      dispatch(setSelectedPages(fileData.pages));
      dispatch(setUploadedFileName(fileData.fileName));
      dispatch(setLocalFilePath(fileData._id));
      dispatch(setOldFileName(fileData.fileName.split('.')[0]))
      navigate('/edit')
    } catch (err) {
      if (err.status >= 500) toast.error("Server Error");
      else {
        if (err.status === 401) toast.error("Unauthorised. Login in first.");
        else
          toast.error(err?.data?.message || err.error || `${err.status} Error`);
      }
    }
  };
  const downloadFile = () => {
    const params = new URLSearchParams({ fileId: fileData._id });
    const uri = "/api/user/download?" + params.toString();
    window.open(uri, "_blank");
  };
  const shareFile = async () => {
    if (isShared) {
      toast.info("File is already shared.Check Shared Files tab");
    } else {
      try {
        const res = await share({ fileId: fileData._id }).unwrap();
        const res1 = await getShared().unwrap();
        dispatch(setSharedFiles(res1));
        toast.success("File set to sharable");
      } catch (err) {
        if (err.status >= 500) toast.error("Server Error");
        else {
          if (err.status === 401) toast.error("Unauthorised. Login in first.");
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
        borderBottom: "1px solid",
        borderColor: "white",
        width: "100%",
        height: "30px",
        display: "flex",
        alignItems: "center",
        paddingLeft: "5px",
        justifyContent: "space-between",
      }}
    >
      <div id="div-fName">{fileData.fileName}</div>
      <div style={{ display: "flex" }}>
        <IconButton color="inherit" size="small" onClick={() => downloadFile()}>
          <GetAppIcon />
        </IconButton>
        <IconButton color="inherit" size="small" onClick={() => editFile()}>
          <EditIcon />
        </IconButton>
        <IconButton color="inherit" size="small" onClick={() => deleteFile()}>
          <DeleteIcon />
        </IconButton>
        <IconButton color="inherit" size="small" onClick={() => shareFile()}>
          <ShareIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default UserFileBarComponent;
