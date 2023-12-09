import mongoose, { mongo } from "mongoose";

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
