import mongoose, { mongo } from "mongoose";

// Define file schema for DB
const fileSchema = mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
    unique: true,
  },
  originalFileName: {
    type: String,
    required: true,
  },
  originalFilePath: {
    type: String,
    required: true,
  },
  pages: {
    type: [Number],
    required: true,
  },
});

const File = mongoose.model("File", fileSchema);

export default File;
