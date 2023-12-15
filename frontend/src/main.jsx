import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import store from "./store.js";
import { Provider } from "react-redux";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import LandingScreen from "./screens/LandingScreen.jsx";
import ProcessScreen from "./screens/ProcessScreen.jsx";
import UserLogin from "./screens/UserLoginScreen.jsx";
import RegisterUser from "./screens/RegisterUserScreen.jsx";
import UserCreateFile from "./screens/UserCreateFileScreen.jsx";
import EditScreen from "./screens/UserEditFileScreen.jsx";
import PageNoteFoundScreen from "./screens/PageNoteFoundScreen.jsx";

// Create routes for react-router-dom
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" index="true" element={<LandingScreen />} />
      <Route path="/start" element={<ProcessScreen />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/register" element={<RegisterUser />} />
      <Route path="/create" element={<UserCreateFile />} />
      <Route path="/edit" element={<EditScreen />} />
      <Route path="*" element={<PageNoteFoundScreen/>} />
    </Route>
  )
);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
