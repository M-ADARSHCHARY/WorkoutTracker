import express from "express";
import workoutRoutes from "./routes/workout.route.js";
import authRoutes from "./routes/auth.route.js";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const PORT = 8080;
dotenv.config(); //loads the variables from .env file into process.env


app.use(express.urlencoded({ extended: true })); // For data parse (x-www-form-urlencoded)
app.use(express.json()); // For JSON data
app.use(cookieParser()); // Enables cookie handling

app.use(
  cors({
    origin: "http://localhost:5173", // Front-End react URL
    credentials: true, // sending cookies
  })
);



app.use("/wt",workoutRoutes);
app.use("/wt/auth",authRoutes);  


app.listen(PORT,()=>{
    console.log("Server Listening at port:",PORT);
});