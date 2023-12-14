import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Stack from "@mui/material/Stack";
import UserShareBarComponent from "./UserShareBarComponent";

const UserShared = () => {
  const files = useSelector((state) => state.user.shared);
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
          style={{ display: "flex", alignItems: "center", paddingLeft: "5px",height:"30px" }}
        >
          {files
            ? files.length === 0
              ? "No files shared"
              : files.length === 1
              ? "You are sharing 1 file"
              : `You are sharing ${files.length} files`
            : "Loading"}
        </div>
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
            <UserShareBarComponent fileData={_} index={idx} key={idx} />
          ))
        ) : (
          <></>
        )}
      </Stack>
    </div>
  );
};

export default UserShared;
