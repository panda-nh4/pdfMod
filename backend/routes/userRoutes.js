import express from "express";
import {
  getUser,
  registerUser,
  updateUser,
  userLogin,
  userLogout,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/login", userLogin);
router.post("/logout", userLogout);
router.post("/register", registerUser);
router.get("/profile", getUser);
router.put("/update", updateUser);

export default router;
