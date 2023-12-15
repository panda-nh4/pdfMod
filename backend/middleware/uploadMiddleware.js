import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
// Upload middleware using multer

// set up temporary upload location
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

//set up multer
const upload = multer({ storage: storage });

//function to handle uploads
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
        const allowedTypes = ["application/pdf"]; // Set allowed file types
        const maxSize = 200 * 1024 * 1024;  // Set max file size to 200MB

        if (!allowedTypes.includes(file.mimetype)) { //Check if file is in allowed types
          errors.push(`Invalid file type: ${file.originalname}`);
        }

        if (file.size > maxSize) {  // Check file size 
          errors.push(`File too large: ${file.originalname}`);
        }
      });

      // Handle validation errors
      if (errors.length > 0) {
        // Remove uploaded files
        files.forEach((file) => {
          fs.unlinkSync(file.path);
        });

        return res.status(400).json({ message: errors[0] });
      }

      // Attach files to the request object
      req.files = files;

      // Proceed to the next middleware or route handler
      next();
    }
  });
};

export { uploadMiddleware };
