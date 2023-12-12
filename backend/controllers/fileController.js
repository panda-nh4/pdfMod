import expressAsyncHandler from "express-async-handler";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import mv from "mv";
import fs from "fs";
import { PDFDocument } from "pdf-lib";
const uploadFile = expressAsyncHandler(async (req, res) => {
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
    var data = fs.readFileSync(file);
    res.contentType("application/pdf");
    res.send(data);
  } catch (error) {
    throw new Error("Unable to read file.");
  }
});

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
  const protocol = process.env.DEV === "true" ? "http://" : "https://";
  res
    .status(200)
    .json({downloadLink:
      protocol +
        req.get("host") +
        "/api/file/download?fileName=" +
        encodeURIComponent(req.body.fileName.slice(0, -4) + " - Modified.pdf")}
    );
});

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
    await fs.promises.access(file);
    res.download(file, "Modified File.pdf");
  } catch (error) {
    res.status(404);
    throw new Error("File dows not exist.");
  }
});

export { uploadFile, viewFile, extractPages, downloadFile };
