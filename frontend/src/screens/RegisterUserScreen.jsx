import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useLazyUserGetFilesQuery,
  useLazyUserGetSharedQuery,
  useRegisterMutation,
} from "../slices/userApiSlice";
import { useDispatch } from "react-redux";
import { setFiles, setLoginValues, setSharedFiles } from "../slices/userSlice";

const RegisterUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [nameErrorText, setNameErrorText] = React.useState("");
  const [emailErrorText, setEmailErrorText] = React.useState("");
  const [passwordErrorText, setPasswordErrorText] = React.useState("");
  const [rePasswordErrorText, setRePasswordErrorText] = React.useState("");
  const [register, { isLoading }] = useRegisterMutation();
  const [getFiles, vals] = useLazyUserGetFilesQuery();
  const [getShared, vals1] = useLazyUserGetSharedQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (!name) {
      setNameErrorText("Please enter your name");
    } else {
      setNameErrorText("");
    }
    if (!email || !email.match(isValidEmail)) {
      setEmailErrorText("Please enter valid email");
    } else {
      setEmailErrorText("");
    }
    if (!password) {
      setPasswordErrorText("Please enter password");
    } else {
      setPasswordErrorText("");
    }
    if (rePassword !== password || !rePassword) {
      setRePasswordErrorText("Passwords do not match");
    } else {
      setRePasswordErrorText("");
    }
    const sendReq =
      name && email && password && !(rePassword !== password || !rePassword);
    if (sendReq) {
      const body = {
        name,
        email,
        password,
      };
      try {
        const res = await register(body).unwrap();
        dispatch(setLoginValues(res));
        const res1 = await getFiles().unwrap();
        dispatch(setFiles(res1));
        const res2 = await getShared().unwrap();
        dispatch(setSharedFiles(res2));
        navigate("/");
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
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            autoComplete="given-name"
            name="name"
            required
            fullWidth
            id="name"
            label="Name"
            autoFocus
            value={name}
            error={!!nameErrorText}
            helperText={nameErrorText}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            type="email"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            value={email}
            error={!!emailErrorText}
            helperText={emailErrorText}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            error={!!passwordErrorText}
            helperText={passwordErrorText}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Re-enter Password"
            type="password"
            id="password-1"
            autoComplete="current-password"
            value={rePassword}
            error={!!rePasswordErrorText}
            helperText={rePasswordErrorText}
            onChange={(e) => setRePassword(e.target.value)}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading || vals.isLoading || vals1.isLoading}
          >
            {isLoading || vals.isLoading || vals1.isLoading
              ? "Signing up"
              : "Sign Up"}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <NavLink to={"/login"} variant="body2">
                Already have an account? Sign in
              </NavLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterUser;
