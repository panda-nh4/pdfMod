import expressAsyncHandler from "express-async-handler";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import mv from "mv";
import fs from "fs";
import { PDFDocument } from "pdf-lib";

// Functions for /api/file/ routes

// Function to upload a file
// Public route : /api/file/upload
// Accepts form data with field: files and file to be uploaded as data
// Returns new file name after saving on server
const uploadFile = expressAsyncHandler(async (req, res) => {
  let resp = {};
  const move_file = (srcPath, destPath) => {
    //move file from multer storage to public/originals directory
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
    //save file with a unique name
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const new_name = crypto.randomUUID() + ".pdf";
    const dest = path.join(__dirname, "..", "public", "originals", new_name);
    await move_file(f.path, dest).then(
      () => {
        resp = {
          new_name,
        };
      },
      () => {
        throw new Error("Upload failed");
      }
    );
  };
  await Promise.all(req.files.map(save_file)).then(() => {
    res.status(200).json(resp);
  });
});

// Function to view uploaded file
// Public route : /api/file/view
// Accepts query params: fileId
// Returns original file saved on server
const viewFile = expressAsyncHandler(async (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const file = path.join(
    __dirname,
    "..",
    "public",
    "originals",
    req.query.fileName
  );
  try {
    var data = await fs.promises.readFile(file); // Try to read file from path
    res.contentType("application/pdf");
    res.send(data);
  } catch (error) {
    throw new Error("Unable to read file.");
  }
});

// Function to extract and reorder pages and save as new file
// Public route : /api/file/extract
// Accepts json with fields: fileName, pageArray
// Returns download link to new file after saving to disk
const extractPages = expressAsyncHandler(async (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const fileName = req.body.fileName;
  const pagesAndOrder = req.body.pageArray;
  const file = path.join(__dirname, "..", "public", "originals", fileName);
  const destFile = path.join(
    __dirname,
    "..",
    "public",
    "modified",
    req.body.fileName.slice(0, -4) + " - Modified.pdf"
  );
  let fileBytes;
  try {
    fileBytes = await fs.promises.readFile(file); // Read original PDF
  } catch (err) {
    throw new Error("File not found.");
  }
  let pdfDoc;
  try {
    pdfDoc = await PDFDocument.load(fileBytes); //Load original PDF as PDFDocument object
  } catch {
    throw new Error("Unable to load file");
  }
  const newPdfDoc = await PDFDocument.create(); // Make new PDFDocument object
  try {
    for (let i = 0; i < pagesAndOrder.length; i++) {
      // Copy pages from original PDF according to order in pageArray
      const [selectedPage] = await newPdfDoc.copyPages(pdfDoc, [
        pagesAndOrder[i],
      ]);
      newPdfDoc.addPage(selectedPage);
    }
  } catch (err) {
    // PageArray has page numbers that are invalid
    throw new Error("Bad indices");
  }

  try {
    const pdfBytes = await newPdfDoc.save(); // Save the modified PDF to disk
    fs.writeFileSync(destFile, pdfBytes);
  } catch (err) {
    throw new Error("Unable to write to file.");
  }
  const protocol = process.env.DEV === "true" ? "http://" : "https://";
  res.status(200).json({
    downloadLink:
      protocol +
      req.get("host") +
      "/api/file/download?fileName=" +
      encodeURIComponent(req.body.fileName.slice(0, -4) + " - Modified.pdf"),
  });
});

// Function to download modified file
// Public route : /api/file/download
// Accepts query params: fileName
// Returns modified file
const downloadFile = expressAsyncHandler(async (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const file = path.join(
    __dirname,
    "..",
    "public",
    "modified",
    req.query.fileName
  );
  try {
    await fs.promises.access(file); //Check if file exists
    res.download(file, "Modified File.pdf");
  } catch (error) {
    res.status(404);
    throw new Error("File does not exist.");
  }
});

export { uploadFile, viewFile, extractPages, downloadFile };
