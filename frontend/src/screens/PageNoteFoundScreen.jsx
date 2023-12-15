import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const PageNoteFoundScreen = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        margin: "1%",
        borderRadius: "10px",
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
        <h2>Page does not exist</h2>
      </div>
      <div
        style={{
          padding: "20px",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <Button
          style={{ backgroundColor: "white" }}
          onClick={()=>{navigate("/")}}
        >
          Back to home.
        </Button>
      </div>
    </div>
  );
};

export default PageNoteFoundScreen;
