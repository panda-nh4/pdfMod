import expressAsyncHandler from "express-async-handler";
import generateToken from "../utils/genToken.js";
import User from "../models/userModel.js";
import File from "../models/fileModel.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import { mkdir } from "node:fs/promises";
import { PDFDocument } from "pdf-lib";
import mv from "mv";
import fs from "fs";
import mongoose from "mongoose";
import _ from "underscore";

// Functions for /api/user/ endpoints

// Function for user login
// Public route : /api/user/login
// Accepts form data with field: email and password
// Returns email and name on successful login, also attaches http-only cookie with jwt to response
const userLogin = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const checkExists = await User.findOne({ email }); // Check if user exists
  if (checkExists && (await checkExists.matchPassword(password))) {
    // user exists and passwords match
    generateToken(res, checkExists._id); // set http-only cookie
    res.status(201).json({
      name: checkExists.name,
      email: checkExists.email,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// Function for registering new user
// Public route : /api/user/register
// Accepts form data with field: name,email,password
// Returns email and name on successful registration, also attaches http-only cookie with jwt to response
const registerUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const checkExists = await User.findOne({ email }); // Check if user with given email already exists
  if (checkExists) {
    res.status(400);
    throw new Error("User exists");
  }
  const userCreated = await User.create({
    // Create new user
    name,
    email,
    password,
  });
  if (userCreated) {
    // If saving to Db successful generate token and attach cookie
    generateToken(res, userCreated._id);
    try {
      // Create private user folders as : ../private/{userid}/originals/ and ../private/{userid}/modified
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      const originalsFolder = path.join(
        __dirname,
        "..",
        "private",
        userCreated._id.toString(),
        "originals"
      );
      const modifiedFolder = path.join(
        __dirname,
        "..",
        "private",
        userCreated._id.toString(),
        "modified"
      );
      await mkdir(originalsFolder, { recursive: true });
      await mkdir(modifiedFolder, { recursive: true });
    } catch (err) {
      console.log(err);
      throw new Error("Could not make dirs");
    }
    res.status(201).json({
      name: userCreated.name,
      email: userCreated.email,
    });
  } else {
    res.status(400);
    throw new Error("Bad data. Unable to create");
  }
});

// Function for user logout
// Public route : /api/user/logout
// Deletes http-only cookie
// Returns json :{status:"logged out"} on success
const userLogout = expressAsyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    // set jwt to "" and expire cookie
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json("logged out");
});

// Function for user file upload
// Protected route : /api/user/upload
// Accepts form data with field: files
// Returns uploaded file name after saving to disk
const userUpload = expressAsyncHandler(async (req, res) => {
  let resp = {};
  const move_file = (srcPath, destPath) => {
    // move file from multer temp storage location to user folder
    return new Promise((resolve, reject) => {
      mv(srcPath, destPath, (err) => {
        if (err) {
          console.log(err);
          reject();
        } else {
          resolve();
        }
      });
    });
  };
  const save_file = async (f) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const new_name = crypto.randomUUID() + ".pdf"; // generate unique name for file
    const dest = path.join(
      __dirname,
      "..",
      "private",
      req.user._id.toString(),
      "originals",
      new_name
    );
    await move_file(f.path, dest).then(
      () => {
        resp = {
          new_name,
        };
      },
      (err) => {
        throw new Error("Upload failed");
      }
    );
  };
  await Promise.all(req.files.map(save_file)).then(() => {
    res.status(200).json(resp);
  });
});

// Function to view uploaded file
// Protected route : /api/user/view
// Accepts query params: fileId
// Returns original file saved on server
const userView = expressAsyncHandler(async (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const file = path.join(
    __dirname,
    "..",
    "private",
    req.user._id.toString(),
    "originals",
    req.query.fileName
  );
  try {
    var data = await fs.promises.readFile(file); // check if file exists
    res.contentType("application/pdf");
    res.send(data); // send file
  } catch (error) {
    throw new Error("Unable to read file.");
  }
});

// Function to extract and reorder pages and save as new file
// Protected route : /api/user/extract
// Accepts json with fields: fileName, pageArray
// Returns download link to new file after saving to disk
const userExtract = expressAsyncHandler(async (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const fileName = req.body.fileName;
  const newName = crypto.randomUUID(); // make unique name for file
  const pagesAndOrder = req.body.pageArray;
  const file = path.join(
    __dirname,
    "..",
    "private",
    req.user._id.toString(),
    "originals",
    fileName
  );
  const destFile = path.join(
    __dirname,
    "..",
    "private",
    req.user._id.toString(),
    "modified",
    newName + ".pdf"
  );
  let fileBytes;
  try {
    fileBytes = await fs.promises.readFile(file); // read original file
  } catch (err) {
    throw new Error("File not found.");
  }
  let pdfDoc;
  try {
    pdfDoc = await PDFDocument.load(fileBytes); // load original file
  } catch {
    throw new Error("Unable to read file");
  }
  const newPdfDoc = await PDFDocument.create(); // make new file object
  try {
    for (let i = 0; i < pagesAndOrder.length; i++) {
      // add pages from original file to new file
      const [selectedPage] = await newPdfDoc.copyPages(pdfDoc, [
        pagesAndOrder[i],
      ]);
      newPdfDoc.addPage(selectedPage);
    }
  } catch (err) {
    throw new Error("Bad indices");
  }

  try {
    const pdfBytes = await newPdfDoc.save(); // save new file
    fs.writeFileSync(destFile, pdfBytes);
  } catch (err) {
    throw new Error("Unable to save file");
  }
  var fileId;
  try {
    const newFile = await File.create({
      // create new file entry in DB
      fileName: req.body.newName + ".pdf",
      filePath: destFile,
      originalFileName: fileName,
      originalFilePath: file,
      pages: pagesAndOrder,
    });
    if (newFile) {
      // if new file entered in DB add fileId to user entry in DB
      fileId = newFile._id.toString();
      req.user.files = [...req.user.files, newFile._id];
      try {
        await req.user.save();
      } catch (err) {
        throw new Error(err);
      }
    }
  } catch (err) {
    throw new Error("DB error");
  }

  const protocol = process.env.DEV === "true" ? "http://" : "https://";
  res.status(200).json({
    downloadLink:
      protocol +
      req.get("host") +
      "/api/user/download?fileId=" +
      encodeURIComponent(fileId),
  });
});

// Function to edit a modified file
// Protected route : /api/user/updateFile
// Accepts json with fields: fileId, newName, pageArray
// Returns download link to file
const userUpdateFile = expressAsyncHandler(async (req, res) => {
  const fileId = req.body.fileId;
  const newName = req.body.newName;
  const pagesAndOrder = req.body.pagesAndOrder;
  const protocol = process.env.DEV === "true" ? "http://" : "https://";
  if (!fileId || !newName || !pagesAndOrder) {
    // if any params are not given throw error
    res.status(400);
    throw new Error("One or more fields missing");
  }

  if (!req.user.files.includes(new mongoose.Types.ObjectId(fileId))) {
    // check if fileId is in user files list
    throw new Error("File does not exist for user.");
  }
  const file = await File.findById(fileId);

  if (file) {
    // check if file with fileId exists in DB
    const destFile = file.filePath;
    console.log(_.isEqual(file.pages, pagesAndOrder));
    if (_.isEqual(file.pages, pagesAndOrder)) {
      // check if any changes are to be done
      const fileWithoutExt = file.fileName.substring(
        0,
        file.fileName.length - 4
      );
      if (newName === fileWithoutExt) {
        res.status(400);
        throw new Error("No change to file");
      }
      file.fileName = newName + ".pdf"; // set new file name
      try {
        await file.save();
        res.status(200).json({
          downloadLink:
            protocol +
            req.get("host") +
            "/api/user/download?fileId=" +
            encodeURIComponent(fileId),
        });
      } catch {
        throw new Error("Unable to update");
      }
    } else {
      // pages and page order are to be modified
      let fileBytes;
      try {
        fileBytes = await fs.promises.readFile(file.originalFilePath);
      } catch (err) {
        throw new Error("File not found.");
      }
      try {
        const pdfDoc = await PDFDocument.load(fileBytes);
        const newPdfDoc = await PDFDocument.create();
        try {
          for (let i = 0; i < pagesAndOrder.length; i++) {
            const [selectedPage] = await newPdfDoc.copyPages(pdfDoc, [
              pagesAndOrder[i],
            ]);
            newPdfDoc.addPage(selectedPage);
          }
        } catch (err) {
          throw new Error("Bad indices");
        }
        const pdfBytes = await newPdfDoc.save();
        try {
          await fs.promises.writeFile(destFile, pdfBytes); // overwrite existing file
        } catch (err) {
          throw new Error("Unable to save file");
        }
        file.pages = pagesAndOrder;
        file.fileName = newName + ".pdf";
      } catch {
        throw new Error("Bad file");
      }

      try {
        await file.save(); // update file datails in DB
      } catch (err) {
        throw new Error("Unable to update");
      }

      res.status(200).json({
        downloadLink:
          protocol +
          req.get("host") +
          "/api/user/download?fileId=" +
          encodeURIComponent(fileId),
      });
    }
  } else {
    throw new Error("Invalid File ID.");
  }
});

// Function to download modified file
// Protected route : /api/user/download
// Accepts query params: fileId
// Returns modified file
const userDownload = expressAsyncHandler(async (req, res) => {
  const fileId = req.query.fileId;
  if (!req.user.files.includes(new mongoose.Types.ObjectId(fileId))) {
    throw new Error("File does not exist for user.");
  }
  const file = await File.findById(fileId); // check if file exists in DB
  if (file) {
    try {
      await fs.promises.access(file.filePath); // check if file exists on disk
      res.download(file.filePath, file.fileName);
    } catch (error) {
      res.status(404);
      throw new Error("File does not exist.");
    }
  } else {
    throw new Error("Invalid file ID.");
  }
});

// Function to get user files
// Protected route : /api/user/files
// Returns file info array
const getUserFiles = expressAsyncHandler(async (req, res) => {
  const fileIds = req.user.files;
  if (fileIds.length === 0)
    res
      .status(200)
      .json({ files: [] }); // if user file list is empty return empty array
  else {
    const fileDetails = await File.find({ _id: { $in: fileIds } }).select(
      //for all files in user file list, get file details from DB
      "_id fileName originalFileName pages"
    );
    if (fileDetails) {
      res.status(200).json({ files: fileDetails });
    } else {
      throw new Error("DB error");
    }
  }
});

// Function to get user shared files
// Protected route : /api/user/shared
// Returns shared file info array
const getSharedFiles = expressAsyncHandler(async (req, res) => {
  const fileIds = req.user.shared;
  if (fileIds.length === 0)
    res
      .status(200)
      .json({
        files: [],
      }); // if user shared file list is empty return empty array
  else {
    const fileDetails = await File.find({ _id: { $in: fileIds } }).select(
      //for all files in user shared file list, get file details from DB
      "_id fileName originalFileName pages"
    );
    if (fileDetails) {
      res.status(200).json({ files: fileDetails });
    } else {
      throw new Error("DB error");
    }
  }
});

// Function to set a file as shared
// Protected route : /api/user/share
// Accepts json : fileId
// Returns json:{shared: fileid}
const shareFile = expressAsyncHandler(async (req, res) => {
  const fileId = req.body.fileId;
  if (!req.user.files.includes(new mongoose.Types.ObjectId(fileId))) {
    // check if file is in user files list
    throw new Error("File does not exist for user.");
  }
  if (req.user.shared.includes(new mongoose.Types.ObjectId(fileId))) {
    // check if file is already shared
    res.status(400);
    throw new Error("File is already shared");
  }
  req.user.shared = [...req.user.shared, new mongoose.Types.ObjectId(fileId)]; // add fileId to user shared list
  try {
    await req.user.save(); // update user shared list
    res.status(200).send({ shared: fileId });
  } catch (e) {
    res.status(404);
    throw new Error("Unable to share file");
  }
});

// Function to set a file as not shared
// Protected route : /api/user/stopShare
// Accepts json : fileId
// Returns json:{shareStopped: fileid}
const stopShare = expressAsyncHandler(async (req, res) => {
  const fileId = req.body.fileId;
  const fileobj = new mongoose.Types.ObjectId(fileId);
  if (req.user.shared.includes(fileobj)) {
    // check if file id in user shared file list
    req.user.shared = req.user.shared.filter((id) => !id.equals(fileobj)); // remove file id from user shared list
    try {
      await req.user.save(); // update user shared file list
      res.status(200).send({ shareStopped: fileId });
    } catch (e) {
      throw new Error("Unable to stop sharing file");
    }
  } else {
    res.status(400);
    throw new Error("File is not being shared.");
  }
});

// Function to delete a file
// Protected route : /api/user/delete
// Accepts json : fileId
// Returns json:{deletedFile: fileid}
const deleteFile = expressAsyncHandler(async (req, res) => {
  const fileId = req.body.fileId;
  if (!fileId) {
    // check for fileId
    res.status(400);
    throw new Error("Bad File Id");
  }
  const fileobj = new mongoose.Types.ObjectId(fileId);
  if (req.user.shared.includes(fileobj)) {
    // Check if fileId is in user shared file list
    res.status(400);
    throw new Error("File is being shared. Stop sharing to delete.");
  }
  if (req.user.files.includes(fileobj)) {
    // check if fileid is in user file list
    const file = await File.findById(fileId);
    try {
      await fs.promises.access(file.filePath); // check if file exists on disk
      try {
        await fs.promises.unlink(file.filePath); // delete file
        req.user.files = req.user.files.filter((id) => !id.equals(fileobj)); // update user file list
        await req.user.save(); // update user file list
        const deletedFile = await File.findByIdAndDelete(fileId);
        const sameOriginalFile = await File.findOne({
          // check if any other file has the same original file
          originalFilePath: deletedFile.originalFilePath,
        });
        if (!sameOriginalFile) {
          try {
            await fs.promises.unlink(deletedFile.originalFilePath); // delete original file
          } catch (err) {
            console.log(err);
          }
        }
        res.status(200).json({ deletedFile: fileId });
      } catch (err) {
        throw new Error("Unable to delete file");
      }
    } catch (error) {
      res.status(404);
      throw new Error("File does not exist");
    }
  } else {
    res.status(404);
    throw new Error("File does not exist for user.");
  }
});

// Function to get shared file link
// Protected route : /api/user/getShareLink
// Accepts query params : fileId
// Returns json:{link:sharedLink}
const getShareLink = expressAsyncHandler(async (req, res) => {
  const fileId = req.query.fileId;
  const fileobj = new mongoose.Types.ObjectId(fileId);
  if (req.user.shared.includes(fileobj)) {
    // check if fileId in user shared file list
    const protocol = process.env.DEV === "true" ? "http://" : "https://";
    const shareLink =
      protocol +
      req.get("host") +
      "/share/" +
      encodeURIComponent(req.user._id) +
      "/" +
      encodeURIComponent(fileId);
    res.status(200).json({ link: shareLink });
  } else {
    res.status(400);
    throw new Error("File is not being shared.");
  }
});

export {
  userLogin,
  userLogout,
  registerUser,
  userUpload,
  userView,
  userExtract,
  userDownload,
  getUserFiles,
  getSharedFiles,
  shareFile,
  stopShare,
  deleteFile,
  getShareLink,
  userUpdateFile,
};
