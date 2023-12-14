import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Stack from "@mui/material/Stack";
import UserFileBarComponent from "./UserFileBarComponent";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { resetPublicState } from "../slices/publicSlice";
const UserFIles = () => {
  const files = useSelector((state) => state.user.files);
  const shared = useSelector((state) => state.user.shared);
  const sharedFileIds = shared ? shared.map((obj) => obj._id) : [];
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            paddingLeft: "5px",
            height: "30px",
          }}
        >
          {files
            ? files.length === 0
              ? "No files to show"
              : files.length === 1
              ? "You have 1 file"
              : `You have ${files.length} files`
            : "Loading"}
        </div>
        <Button
          size="small"
          style={{ backgroundColor: "white" }}
          onClick={() => {
            dispatch(resetPublicState());
            navigate("/create");
          }}
        >
          Create
        </Button>
      </div>
      <hr
        style={{
          height: "2px",
          width: "100%",
          backgroundColor: "white",
          color: "white",
          borderRadius: "5px",
        }}
      />
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="stretch"
        spacing={2}
      >
        {files ? (
          files.map((_, idx) => (
            <UserFileBarComponent
              fileData={_}
              isShared={sharedFileIds.includes(_._id)}
              key={idx}
            />
          ))
        ) : (
          <></>
        )}
      </Stack>
    </div>
  );
};

export default UserFIles;
