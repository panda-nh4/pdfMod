import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const dest = path.join(__dirname, "..", "temp");
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const uploadMiddleware = (req, res, next) => {
  upload.array("files")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    const files = req.files;
    const errors = [];
    if (files == undefined) res.status(400).json("No files");
    else {
      if (files.length > 1) {
        errors.push("Too many files.");
      }
      files.forEach((file) => {
        const allowedTypes = ["application/pdf"];
        const maxSize = 10 * 1024 * 1024 * 1024;

        if (!allowedTypes.includes(file.mimetype)) {
          errors.push(`Invalid file type: ${file.originalname}`);
        }

        if (file.size > maxSize) {
          errors.push(`File too large: ${file.originalname}`);
        }
      });

      // Handle validation errors
      if (errors.length > 0) {
        // Remove uploaded files
        files.forEach((file) => {
          fs.unlinkSync(file.path);
        });

        return res.status(400).json({ message:errors[0] });
      }

      // Attach files to the request object
      req.files = files;

      // Proceed to the next middleware or route handler
      next();
    }
  });
};

export { uploadMiddleware };
