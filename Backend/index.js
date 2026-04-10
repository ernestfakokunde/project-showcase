import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoute.js";
import { connectDB } from "./config/db.js";


//load my env vars
dotenv.config()
connectDB()

const app = express()
app.use(cors({
  origin: "http://localhost:5173", // Adjust this to your frontend URL
  withCredentials: true, // Allow cookies to be sent
}))

app.use(express.json())


//setup Routes
app.use("/api/users", userRoutes)

//Health check 
app.get("/", (req, res) => {
  res.send(" Stacklab API is running")
  console.log("Health check endpoint hit. StackLab Api is running")
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))