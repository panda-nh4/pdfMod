import { Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
const LandingScreen = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        margin: "1%",
        borderRadius: "25px",
        backgroundColor: "#d90940",
        color:"white",
        fontFamily:"Roboto"
      }}
    >
      <div
        style={{
          padding: "20px",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <h2>Re-order and select pages from PDF's in 4 steps!</h2>
      </div>
      <div
        style={{
          padding: "20px",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <Button style={{ backgroundColor: "white" }} component={Link} to="/start">Start now</Button>
      </div>
      <div
        style={{
          padding: "20px",
          justifyContent: "center",
          display: "flex",
          marginTop:"10px"
        }}
      >
        <h2 >Login to share created PDF's and access them from anywhere.</h2>
      </div>
    </div>
  );
};

export default LandingScreen;
