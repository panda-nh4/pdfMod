import React from "react";
import { Button, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useExtractMutation } from "../slices/publicApiSlice";
import { setDownloadLink } from "../slices/publicSlice";
import { toast } from "react-toastify";
const DownloadComponent = () => {
  const downloadLink = useSelector((state) => state.public.downloadLink);
  const selectedPages = useSelector((state) => state.public.selectedPages);
  const dispatch = useDispatch();
  const uploadedFileName = useSelector(
    (state) => state.public.uploadedFileName
  );
  const gotLink = downloadLink ? true : false;
  const [extract, { isLoading }] = useExtractMutation();

  const generateLink = async () => {
    const body = {
      fileName: uploadedFileName,
      pageArray: selectedPages,
    };
    try {
      const res = await extract(body).unwrap();
      dispatch(setDownloadLink(res.downloadLink));
    } catch (err) {
      if (err.status === 500) toast.error("Server Error");
      else toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",

        borderRadius: "25px",
        backgroundColor: "#d90940",
        color: "white",
        fontFamily: "Roboto",
      }}
    >
      <div
        style={{
          padding: "20px",
          justifyContent: "center",
          display: "flex",
        }}
      >
        {isLoading ? (
          <CircularProgress style={{ color: "white" }} />
        ) : (
          <h2>Your PDF is ready to be generated!</h2>
        )}
      </div>
      <div
        style={{
          padding: "20px",
          justifyContent: "center",
          display: "flex",
        }}
      >
        {gotLink ? (
          <h2>Click download to download generated PDF.</h2>
        ) : (
          <Button onClick={()=>generateLink()} style={{ backgroundColor: "white" }}>Generate PDF!</Button>
        )}
      </div>
      <div
        style={{
          padding: "20px",
          justifyContent: "center",
          display: "flex",
          marginTop: "10px",
        }}
      ></div>
    </div>
  );
};

export default DownloadComponent;
