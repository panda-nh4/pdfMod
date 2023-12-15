import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useLogoutMutation } from "../slices/userApiSlice";
import { setLogoutValues } from "../slices/userSlice";
import { toast } from "react-toastify";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useState } from "react";
import { resetPublicState } from "../slices/publicSlice";
const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const email = useSelector((state) => state.user.email);
  const name = useSelector((state) => state.user.name);
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const handleMenu = (event) => {
    //open dropdown menu
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    //close drop down menu
    setAnchorEl(null);
  };
  const logOut = async () => {
    // Call logout api
    try {
      const res = await logout().unwrap();
      dispatch(setLogoutValues());
      navigate("/");
    } catch (err) {
      if (err.status >= 500) toast.error("Server Error");
      else {
        if (err.status === 401) toast.error("Unauthorised. Login in first.");
        else
          toast.error(err?.data?.message || err.error || `${err.status} Error`);
      }
    }
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar>
        <Toolbar>
          <Typography
            variant="h6"
            onClick={() => {
              dispatch(resetPublicState());
              navigate("/");
            }}
            component="div"
            style={{ cursor: "pointer" }}
            sx={{ flexGrow: 1 }}
          >
            PDFMod
          </Typography>
          {email === "" ? (
            <Button
              color="inherit"
              onClick={() => {
                handleClose();
                navigate("/login");
              }}
            >
              Login
            </Button>
          ) : (
            <div
              style={{
                userSelect: "none",
                cursor: "pointer",
                fontFamily: "Roboto",
              }}
            >
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={(e) => handleMenu(e)}
              >
                <div
                  style={{
                    display: "flex",
                    maxHeight: "40px",
                    paddingRight: "5px",
                  }}
                >
                  <h6
                    style={{ margin: "0px", fontWeight: "normal" }}
                  >{`Hey ${name}`}</h6>
                </div>
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={() => handleClose()}
              >
                <MenuItem
                  onClick={() => {
                    handleClose();
                    dispatch(resetPublicState());
                    navigate("/");
                  }}
                >
                  My Files
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    dispatch(resetPublicState());
                    logOut();
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
