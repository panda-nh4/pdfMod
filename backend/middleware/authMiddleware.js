import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import AsyncHandler from "express-async-handler";

const protectRoute = AsyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;
  if (token) {
    try {
      const decodeedToken = jwt.verify(token, process.env.SECRET);
      req.user = await User.findById(decodeedToken.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Bad token");
    }
  } else {
    res.status(401);
    throw new Error("No token");
  }
});

export {protectRoute}