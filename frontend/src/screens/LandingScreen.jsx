import { Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import UserFiles from "../components/UserFiles";
import UserShared from "../components/UserShared";
function CustomTabPanel(props) {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
const LandingScreen = () => {
  const email = useSelector((state) => state.user.email);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  if (email !== "")
    return (
      <Box
        sx={{
          width: "100%",
          bgcolor: "primary.main",
          color: "white",
          borderRadius: "10px",
          fontFamily:"Roboto",
          margin: "1%",
        }}
      >
        <Tabs value={value} onChange={handleChange} centered>
          <Tab
            style={{ color: "white", opacity: value === 0 ? "100%" : "50%" }}
            label="My Files"
          />
          <Tab
            style={{ color: "white", opacity: value === 1 ? "100%" : "50%" }}
            label="Shared Files"
          />
        </Tabs>
        <Box>
          <CustomTabPanel value={value} index={0}>
            <UserFiles/>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <UserShared/>
          </CustomTabPanel>
        </Box>
      </Box>
    );
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
        <h2>Re-order and select pages from PDF's in 4 steps!</h2>
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
          component={Link}
          to="/start"
        >
          Start here
        </Button>
      </div>
      <div
        style={{
          padding: "20px",
          justifyContent: "center",
          display: "flex",
          marginTop: "10px",
        }}
      >
        <h2>Login to share and manage created PDF's</h2>
      </div>
    </div>
  );
};

export default LandingScreen;
