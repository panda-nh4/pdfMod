import express from "express";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import User from "../models/userModel.js";
import File from "../models/fileModel.js";

const router = express.Router();

// Set route for /share endpoint

router.get(
  "/:id/:fid",
  expressAsyncHandler(async (req, res) => {
    if (
      // Check if user id and file id are valid mongoDB object id
      mongoose.isValidObjectId(req.params.id) &&
      mongoose.isValidObjectId(req.params.fid)
    ) {
      const userId = new mongoose.Types.ObjectId(req.params.id);
      const fileId = new mongoose.Types.ObjectId(req.params.fid);
      const user = await User.findById(userId).select("shared"); // Get user shared files
      if (user) {
        // Check if user exists
        if (user.shared.includes(fileId)) {
          // Check if user is charing fid
          const file = await File.findById(fileId).select("filePath fileName"); //Get file info
          if (file) {
            //Check if file found
            res.download(file.filePath, file.fileName);
          } else {
            // If file not found
            res.status(404).send("File not found.");
          }
        } else {
          // User has not shared the file
          res.status(401).send("You cant view this file.");
        }
      } else {
        // User does not exist
        res.status(400).send("Bad link.");
      }
    } else {
      // fid or id are not valid object ids
      res.status(400).send("Bad link.");
    }
  })
);
router.get(
  "/*",
  expressAsyncHandler(async (req, res) => {
    res.status(400).send("Bad link");
  })
);

export default router;
