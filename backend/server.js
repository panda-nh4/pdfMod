import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import shareRoute from "./routes/shareRoute.js"
import { noEndpoint, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
dotenv.config();
connectDB();
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/user", userRoutes);
app.use("/api/file", fileRoutes);
app.use("/share", shareRoute);
if (process.env.DEV === "true") {
  app.get("/", (req, res) => res.send("Api home"));
} else {
  app.get("/", (req, res) => res.status(401).send("Unauthorized"));
}
app.use(noEndpoint);
app.use(errorHandler);
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
