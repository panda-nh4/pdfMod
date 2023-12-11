import React from "react";
import Header from "./components/Header";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LandingScreen from "./screens/LandingScreen";
import { Outlet } from "react-router-dom";
import "@fontsource/roboto";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ProcessScreen from "./screens/ProcessScreen";
let theme = createTheme({
  palette: {
    primary: {
      main: "#d90940",
    },
    secondary: {
      main: "#f7285f",
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <ToastContainer />
      <div
        style={{
          marginTop: "70px",
          width: "100%",
          alignContent: "center",
          display: "flex",
        }}
      >
        <Outlet />
      </div>
    </ThemeProvider>
  );
};

export default App;
