import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import AsyncHandler from "express-async-handler";

//Authentication middleware

const protectRoute = AsyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;  //Check for token in cookie
  if (token) {
    try {
      const decodeedToken = jwt.verify(token, process.env.SECRET);  //if token exists decode it
      req.user = await User.findById(decodeedToken.userId).select("-password"); // get user details from DB
      next();
    } catch (error) { //throw error if unable to decode token
      res.status(401);
      throw new Error("Bad token");
    }
  } else {  //if no token found throw error
    res.status(401);
    throw new Error("No token");
  }
});

export {protectRoute}