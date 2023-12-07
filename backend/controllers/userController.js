import expressAsyncHandler from "express-async-handler";

const userLogin = expressAsyncHandler(async (req, res) => {
  res.status(200).json("Auth endpoint");
});

const registerUser = expressAsyncHandler(async (req, res) => {
  res.status(200).json("Register endpoint");
});

const userLogout = expressAsyncHandler(async (req, res) => {
  res.status(200).json("Logout endpoint");
});

const getUser = expressAsyncHandler(async (req, res) => {
  res.status(200).json("Profile details endpoint");
});

const updateUser = expressAsyncHandler(async (req, res) => {
  res.status(200).json("Update profile endpoint");
});

export { userLogin, userLogout, registerUser, getUser, updateUser };
