import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import IosShareIcon from "@mui/icons-material/IosShare";
import { useDispatch } from "react-redux";
import {
  useLazyGetFileShareLinkQuery,
  useLazyUserGetSharedQuery,
  useStopFileShareMutation,
} from "../slices/userApiSlice";
import copy from "copy-to-clipboard";
import { toast } from "react-toastify";
import { setSharedFiles } from "../slices/userSlice";
const UserShareBarComponent = ({ fileData, index }) => {
  const dispatch = useDispatch();
  const [getFileLink, getLinkres] = useLazyGetFileShareLinkQuery();
  const [stopFileShare, getStopShareReq] = useStopFileShareMutation();
  const [getShared, getSharedReq] = useLazyUserGetSharedQuery();
  const getShareLink = async () => {
    try {
      const body = { fileId: fileData._id };
      const resLink = await getFileLink(body).unwrap();
      if (copy(resLink.link)) toast.success("Link copied!");
    } catch (err) {
      if (err.status >= 500) toast.error("Server Error");
      else {
        if (err.status === 401) toast.error("Unauthorised. Login in first.");
        else
          toast.error(err?.data?.message || err.error || `${err.status} Error`);
      }
    }
  };
  const stopShare = async () => {
    try {
      const res = await stopFileShare({ fileId: fileData._id }).unwrap();
      const res1 = await getShared().unwrap();
      dispatch(setSharedFiles(res1));
      toast.success("Stopped sharing file");
    } catch (err) {
      if (err.status >= 500) toast.error("Server Error");
      else {
        if (err.status === 401) toast.error("Unauthorised. Login in first.");
        else
          toast.error(err?.data?.message || err.error || `${err.status} Error`);
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
        <IconButton color="inherit" size="small" onClick={() => getShareLink()}>
          <IosShareIcon />
        </IconButton>
        <IconButton color="inherit" size="small" onClick={() => stopShare()}>
          <ClearIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default UserShareBarComponent;
