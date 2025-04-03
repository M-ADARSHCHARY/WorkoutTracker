import path from "path";
import express from "express";
import methodOverride from "method-override";
import { fileURLToPath } from "url";
import workoutRoutes from "./routes/workoutRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";

dotenv.config(); //loads the variables from .env file into process.env
const app = express();
const port = 8080;
// manually extract dir path and create __dirname variable (Becoz=> ES module's not have __dirname)
let __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);
app.use(methodOverride("_method")); // for parsing request
app.use(express.static('public'));
app.set("viewengine","ejs"); // set view engine ejs
app.set("views",path.join(__dirname,"views")); //give path to ejs
app.use(express.urlencoded({ extended: true })); // For data parse (x-www-form-urlencoded)
app.use(express.json()); // For JSON data
app.use(cookieParser()); // Enables cookie handling


app.use("/wt",workoutRoutes);
app.use("/wt/auth",authRoutes);  


app.listen(port,()=>{
    console.log("Server Listening at port:",port);
});