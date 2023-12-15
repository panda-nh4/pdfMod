import jwt from "jsonwebtoken";

// Generates and attaches a http-only cookie containing jwt to response

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.SECRET, {
    expiresIn: "1d",
  });
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.DEV === "true" ? false : true,
    sameSite: "Strict",
    maxAge: 3600 * 24 * 30,
  });
};

export default generateToken;
