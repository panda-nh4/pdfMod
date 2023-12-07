import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js"
dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();


app.use("/api/user", userRoutes);
if (process.env.DEV === "true") {
  app.get("/", (req, res) => res.send("Api home"));
} else {
    app.get("/",(req,res)=>res.status(401).send("Unauthorized"))
}

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
