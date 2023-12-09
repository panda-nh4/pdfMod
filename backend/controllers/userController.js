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
const userLogin = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const checkExists = await User.findOne({ email });
  if (checkExists && (await checkExists.matchPassword(password))) {
    generateToken(res, checkExists._id);
    res.status(201).json({
      name: checkExists.name,
      email: checkExists.email,
      address: checkExists.address,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const registerUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const checkExists = await User.findOne({ email });
  if (checkExists) {
    res.status(400);
    throw new Error("User exists");
  }
  const userCreated = await User.create({
    name,
    email,
    password,
  });
  if (userCreated) {
    generateToken(res, userCreated._id);
    try {
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

const userLogout = expressAsyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json("logged out");
});

const getUser = expressAsyncHandler(async (req, res) => {
  res.status(200).json({
    name: req.user.name,
    email: req.user.email,
  });
});

const updateUser = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.status(200).json({
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const userUpload = expressAsyncHandler(async (req, res) => {
  let resp = {};
  const move_file = (srcPath, destPath) => {
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
    const new_name = crypto.randomUUID() + ".pdf";
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
    var data = fs.readFileSync(file);
    res.contentType("application/pdf");
    res.send(data);
  } catch (error) {
    throw new Error("Unable to read file.");
  }
});

const userExtract = expressAsyncHandler(async (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const fileName = req.body.fileName;
  const newName = req.body.newName || crypto.randomUUID();
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
    fileBytes = fs.readFileSync(file);
  } catch (err) {
    throw new Error("File not found.");
  }
  const pdfDoc = await PDFDocument.load(fileBytes);
  //   const pages = pdfDoc.getPages()
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
  fs.writeFileSync(destFile, pdfBytes);
  var fileId
  try {
    const newFile = await File.create({
      fileName: newName + ".pdf",
      filePath: destFile,
      originalFilePath: file,
      pages: pagesAndOrder,
    });
    if (newFile) {
      fileId=newFile._id.toString()
      req.user.files = [...req.user.files, newFile._id];
      try {
        await req.user.save();
      } catch (err) {
        throw new Error(err);
      }
    }
  } catch (err) {
    if (err.code === 11000) {
      const getFile = await File.findOneAndUpdate(
        { filePath: destFile },
        {
          fileName: newName + ".pdf",
          originalFilePath: file,
          pages: pagesAndOrder,
        }
      );
      fileId=getFile._id.toString()
    } else {
      throw new Error("DB error");
    }
  }

  const protocol = process.env.DEV === "true" ? "http://" : "https://";
  res
    .status(200)
    .json(
      protocol +
        req.get("host") +
        "/api/user/download?fileId=" +
        encodeURIComponent(fileId)
    );
});

const userDownload = expressAsyncHandler(async (req, res) => {
  const fileId = req.query.fileId;
  if (!req.user.files.includes(new mongoose.Types.ObjectId(fileId))) {
    throw new Error("File does not exist for user.");
  }
  const file = await File.findById(fileId);
  if (file) {
    try {
      await fs.promises.access(file.filePath);
      res.download(file.filePath, file.fileName);
    } catch (error) {
      res.status(404);
      throw new Error("File does not exist.");
    }
  } else {
    throw new Error("Invalid file ID.");
  }
});

const getUserFiles = expressAsyncHandler(async (req, res) => {
  res.status(200).json({ files: req.user.files });
});

const getSharedFiles = expressAsyncHandler(async (req, res) => {
  res.status(200).json({ files: req.user.shared });
});

const getFileName = expressAsyncHandler(async (req, res) => {
  const fileId = req.query.fileId;
  if (!req.user.files.includes(new mongoose.Types.ObjectId(fileId))) {
    throw new Error("File does not exist for user.");
  }
  const file = await File.findById(fileId);
  if (file) {
    res.status(200).json({ fileName: file.fileName });
  } else {
    throw new Error("Invalid File ID.");
  }
});

const shareFile = expressAsyncHandler(async (req, res) => {
  const fileId = req.body.fileId;
  if (!req.user.files.includes(new mongoose.Types.ObjectId(fileId))) {
    throw new Error("File does not exist for user.");
  }
  if (req.user.shared.includes(new mongoose.Types.ObjectId(fileId))) {
    throw new Error("Already shared");
  }
  req.user.shared = [...req.user.shared, new mongoose.Types.ObjectId(fileId)];
  try {
    await req.user.save();
    res.status(200).send({ shared: fileId });
  } catch (e) {
    throw new Error("Unable to share file");
  }
});

const stopShare = expressAsyncHandler(async (req, res) => {
  const fileId = req.body.fileId;
  const fileobj = new mongoose.Types.ObjectId(fileId);
  if (req.user.shared.includes(fileobj)) {
    req.user.shared = req.user.shared.filter((id) => !id.equals(fileobj));
    try {
      await req.user.save();
      res.status(200).send({ shareStopped: fileId });
    } catch (e) {
      throw new Error("Unable to stop sharing file");
    }
  } else {
    throw new Error("File is not being shared.");
  }
});

const deleteFile = expressAsyncHandler(async (req, res) => {
  const fileId = req.body.fileId;
  const fileobj = new mongoose.Types.ObjectId(fileId);
  if (req.user.shared.includes(fileobj)) {
    throw new Error("File is being shared.");
  }
  if (req.user.files.includes(fileobj)) {
    const file = await File.findById(fileId);
    try {
      await fs.promises.access(file.filePath);
      try {
        await fs.promises.unlink(file.filePath);
        req.user.files = req.user.files.filter((id) => !id.equals(fileobj));
        await req.user.save();
        const deletedFile = await File.findByIdAndDelete(fileId);
        const sameOriginalFile = await File.findOne({
          originalFilePath: deletedFile.originalFilePath,
        });
        if (!sameOriginalFile) {
          try {
            await fs.promises.unlink(deletedFile.originalFilePath);
          } catch (err) {
            console.log(err);
          }
        }
        res.status(200).json({ deletedFile: fileId });
      } catch (err) {
        throw new Error("Unable to delete file");
      }
    } catch (error) {
      throw new Error("File does not exist");
    }
  } else {
    throw new Error("File does not exist for user.");
  }
});

const getShareLink = expressAsyncHandler(async (req, res) => {
  const fileId = req.query.fileId;
  const fileobj = new mongoose.Types.ObjectId(fileId);
  if (req.user.shared.includes(fileobj)) {
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
    throw new Error("File is not being shared.");
  }
});

export {
  userLogin,
  userLogout,
  registerUser,
  getUser,
  updateUser,
  userUpload,
  userView,
  userExtract,
  userDownload,
  getUserFiles,
  getSharedFiles,
  getFileName,
  shareFile,
  stopShare,
  deleteFile,
  getShareLink,
};
