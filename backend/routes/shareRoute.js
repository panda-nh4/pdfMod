import express from "express";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import User from "../models/userModel.js";
import File from "../models/fileModel.js";

const router = express.Router();


router.get(
  "/:id/:fid",
  expressAsyncHandler(async (req, res) => {
    if (
      mongoose.isValidObjectId(req.params.id) &&
      mongoose.isValidObjectId(req.params.fid)
    ) {
      const userId =new mongoose.Types.ObjectId(req.params.id);
      const fileId =new mongoose.Types.ObjectId(req.params.fid);
      const user= await User.findById(userId)
      if(user){
        if (user.shared.includes(fileId)){
            const file=await File.findById(fileId)
            if (file){
                res.download(file.filePath,file.fileName)
            }
            else{
                res.status(404)
                throw new Error("File not found")
            }
        }else{
            res.status(401)
            throw new Error("Unauthorised.")
        }
      }else{
        res.status(400)
        throw new Error("Bad link")
      }
    }
  })
);

export default router;
