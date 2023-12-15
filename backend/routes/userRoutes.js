import express from "express";
import {
  deleteFile,
  getShareLink,
  getSharedFiles,
  getUserFiles,
  registerUser,
  shareFile,
  stopShare,
  userDownload,
  userExtract,
  userLogin,
  userLogout,
  userUpdateFile,
  userUpload,
  userView,
} from "../controllers/userController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import { uploadMiddleware } from "../middleware/uploadMiddleware.js";

//  Set routes for /api/user endpoint
const router = express.Router();

router.post("/login", userLogin);
router.post("/logout", userLogout);
router.post("/register", registerUser);
router.post("/upload", protectRoute, uploadMiddleware, userUpload);
router.get("/view", protectRoute, userView);
router.post("/extract", protectRoute, userExtract);
router.get("/download", protectRoute, userDownload);
router.get("/files", protectRoute, getUserFiles);
router.post("/share", protectRoute, shareFile);
router.post("/stopShare", protectRoute, stopShare);
router.get("/shared", protectRoute, getSharedFiles);
router.get("/getShareLink", protectRoute, getShareLink);
router.post("/delete", protectRoute, deleteFile);
router.post("/updateFile",protectRoute,userUpdateFile)

export default router;
