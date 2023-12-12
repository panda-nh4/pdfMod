import React from "react";
import Header from "./components/Header";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LandingScreen from "./screens/LandingScreen";
import { Outlet } from "react-router-dom";
import "@fontsource/roboto";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProcessScreen from "./screens/ProcessScreen";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { usePreview } from "react-dnd-preview";
const MyPreview = () => {
  const preview = usePreview();
  if (!preview.display) {
    return null;
  }
  const { itemType, item, style } = preview;
  return (
    <div className="item-list__item" style={style}>
      {itemType}
    </div>
  );
};

let theme = createTheme({
  palette: {
    primary: {
      main: "#d90940",
    },
    secondary: {
      main: "#fff",
    },
  },
});

const App = () => {
  const backend = window.matchMedia("(pointer: coarse)").matches
    ? TouchBackend
    : HTML5Backend;
  const options = {
    scrollAngleRanges: [
      { start: 30, end: 150 },
      { start: 210, end: 330 },
    ],
  };
  return (
    <DndProvider backend={backend} options={options}>
      <MyPreview />
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
    </DndProvider>
  );
};

export default App;
