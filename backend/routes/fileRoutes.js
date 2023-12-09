import express from "express";
import {
  downloadFile,
  extractPages,
  uploadFile,
  viewFile,
} from "../controllers/fileController.js";
import { uploadMiddleware } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/upload", uploadMiddleware, uploadFile);
router.get("/view", viewFile);
router.post("/extract", extractPages);
router.get("/download", downloadFile);

export default router;
