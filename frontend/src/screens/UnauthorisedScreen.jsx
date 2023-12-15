import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const UnauthorisedScreen = () => {
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
          paddingTop: "20px",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <h2>You are not supposed to be here.</h2>
      </div>
      <div
        style={{
          justifyContent: "center",
          display: "flex",
        }}
      >
        <h4>Login first.</h4>
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
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
      </div>
    </div>
  );
};

export default UnauthorisedScreen;
