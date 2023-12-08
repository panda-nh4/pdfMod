import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    files: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "File",
      },
    ],
    shared: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "File",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (givenPass) {
  return await bcrypt.compare(givenPass, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
