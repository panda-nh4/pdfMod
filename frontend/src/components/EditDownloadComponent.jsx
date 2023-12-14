import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setDownloadLink } from "../slices/publicSlice";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {
  useLazyUserGetFilesQuery,
  useLazyUserGetSharedQuery,
  useShareFileMutation,
  useUpdateFileMutation,
  useUserExtractMutation,
} from "../slices/userApiSlice";
import { setFiles, setSharedFiles } from "../slices/userSlice";
const EditDownloadComponent = () => {
  const oldName = useSelector((state) => state.public.oldFileName);
  const [name, setName] = useState(oldName);
  const downloadLink = useSelector((state) => state.public.downloadLink);
  const selectedPages = useSelector((state) => state.public.selectedPages);
  const localFilePath=useSelector(state=>state.public.localFilePath)
  const [nameErrorText, setNameErrorText] = React.useState("");
  const dispatch = useDispatch();
  const [getShared, getSharedReq] = useLazyUserGetSharedQuery();
  const [share, shareFileReq] = useShareFileMutation();
  const uploadedFileName = useSelector(
    (state) => state.public.uploadedFileName
  );
  const shareFile = async () => {
    try {
      const url = new URL(downloadLink);
      const fileId = url.searchParams.get("fileId");
      const res = await share({ fileId }).unwrap();
      const res1 = await getShared().unwrap();
      dispatch(setSharedFiles(res1));
      toast.success("File set to sharable");
    } catch (err) {
      if (err.status >= 500) toast.error("Server Error");
      else {
        if (err.status === 401) toast.error("Unauthorised. Login in first.");
        else
          toast.error(err?.data?.message || err.error || `${err.status} Error`);
      }
    }
  };
  const gotLink = downloadLink ? true : false;
  const [extract, { isLoading }] = useUpdateFileMutation();
  const [getFiles] = useLazyUserGetFilesQuery();
  const generateLink = async (e) => {
    e.preventDefault();

    if (!name) {
      setNameErrorText("Please enter file name");
    }
    if (name) {
      const body = {
        fileId: localFilePath,
        pagesAndOrder: selectedPages,
        newName: name,
      };
      console.log(body)
      try {
        const res = await extract(body).unwrap();
        dispatch(setDownloadLink(res.downloadLink));
        const res1 = await getFiles().unwrap();
        dispatch(setFiles(res1));
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
        ) : !gotLink ? (
          <h2>Your PDF is ready to be edited!</h2>
        ) : (
          <h2>Your PDF has been edited!</h2>
        )}
      </div>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {gotLink ? (
          <Box paddingLeft="20px" paddingRight="20px">
            <h2>Download or share the generated PDF.</h2>
          </Box>
        ) : (
          <Box
            component="form"
            noValidate
            onSubmit={generateLink}
            padding="20px"
          >
            <TextField
              autoComplete="given-name"
              name="name"
              required
              fullWidth
              id="name"
              label="File name"
              inputProps={{
                sx: {
                  color: "black",
                  backgroundColor: "white",
                  borderRadius: "5px",
                },
              }}
              InputLabelProps={{
                sx: {
                  color: "#8fb5ac",
                },
              }}
              sx={{ backgroundColor: "#d90940" }}
              value={name}
              error={!!nameErrorText}
              helperText={nameErrorText}
              FormHelperTextProps={{
                sx: {
                  "&.MuiFormHelperText-root.Mui-error": {
                    color: "white",
                  },
                },
              }}
              onChange={(e) => setName(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              style={{ backgroundColor: "white", marginTop: "10px" }}
            >
              Generate PDF!
            </Button>
          </Box>
        )}
      </Box>
      <div
        style={{
          padding: "20px",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <Button
          style={{
            backgroundColor: "white",
            margin: "10px",
            visibility: gotLink ? "visible" : "hidden",
          }}
          onClick={() => window.open(downloadLink, "_blank")}
        >
          Download
        </Button>
        <Button
          style={{
            backgroundColor: "white",
            margin: "10px",
            visibility: gotLink ? "visible" : "hidden",
          }}
          onClick={() => {
            shareFile();
          }}
        >
          Share
        </Button>
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

export default EditDownloadComponent;
