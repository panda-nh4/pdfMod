import React, { useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useState } from "react";
import {
  useLazyUserGetFilesQuery,
  useLazyUserGetSharedQuery,
  useLoginMutation,
} from "../slices/userApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setFiles, setLoginValues, setSharedFiles } from "../slices/userSlice";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailErrorText, setEmailErrorText] = React.useState("");
  const [passwordErrorText, setPasswordErrorText] = React.useState("");
  const [login, { isLoading }] = useLoginMutation();
  const isLoggedIn = useSelector((state) => state.user.name);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [getFiles, vals] = useLazyUserGetFilesQuery();
  const [getShared, vals1] = useLazyUserGetSharedQuery();
  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
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

    const body = {
      email,
      password,
    };
    if (email && email.match(isValidEmail) && password)
      try {
        const res = await login(body).unwrap();
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
          Sign in
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            type="email"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoFocus
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
            error={!!passwordErrorText}
            helperText={passwordErrorText}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading || vals.isLoading || vals1.isLoading}
          >
            {isLoading || vals.isLoading || vals1.isLoading
              ? "Signing in"
              : "Sign In"}
          </Button>
          <Grid container>
            <Grid item>
              <NavLink to={"/register"} variant="body2">
                {"Don't have an account? Sign Up"}
              </NavLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default UserLogin;
