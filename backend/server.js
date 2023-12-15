import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import shareRoute from "./routes/shareRoute.js";
import { noEndpoint, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import path from "path";

//Setting up .env file
dotenv.config(); 

//connecting to the DB
connectDB(); 

//Configuring port number and parsers 
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Setting routes
app.use("/api/user", userRoutes);
app.use("/api/file", fileRoutes);
app.use("/api/*", noEndpoint);
app.use("/share", shareRoute);
if (process.env.DEV === "true") {
  app.get("/", (req, res) => res.send("Api home"));
} else {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "frontend", "dist")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
  );
}
//Error Middleware
app.use(errorHandler);
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
