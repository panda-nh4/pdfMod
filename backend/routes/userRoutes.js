import express from "express";
import {
  deleteFile,
  getFileName,
  getShareLink,
  getSharedFiles,
  getUser,
  getUserFiles,
  registerUser,
  shareFile,
  stopShare,
  updateUser,
  userDownload,
  userExtract,
  userLogin,
  userLogout,
  userUpload,
  userView,
} from "../controllers/userController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import { uploadMiddleware } from "../middleware/uploadMiddleware.js";
const router = express.Router();

router.post("/login", userLogin);
router.post("/logout", userLogout);
router.post("/register", registerUser);
router.get("/profile", protectRoute, getUser);
router.put("/update", protectRoute, updateUser);
router.post("/upload", protectRoute, uploadMiddleware, userUpload);
router.get("/view", protectRoute, userView);
router.post("/extract", protectRoute, userExtract);
router.get("/download", protectRoute, userDownload);
router.get("/files", protectRoute, getUserFiles);
router.post("/share", protectRoute, shareFile);
router.post("/stopShare", protectRoute, stopShare);
router.get("/shared", protectRoute, getSharedFiles);
router.get("/getFileName", protectRoute, getFileName);
router.get("/getShareLink", protectRoute, getShareLink);
router.post("/delete", protectRoute, deleteFile);

export default router;
