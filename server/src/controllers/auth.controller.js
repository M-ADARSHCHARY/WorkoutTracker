import pool from "../DB/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import asyncHandler from "../middlewares/asyncHandler.js";
import AppError from "../utils/AppError.js";

dotenv.config(); // Load environment variables

export const signUp = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;
 
  if (!userName || !email || !password) {
    throw new AppError("Invalid data", 400);
  }

  const userId = uuidv4();

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const insertQuery =
    "INSERT INTO users(id, username, email, password_hash) VALUES (?, ?, ?, ?)";

  try {
    await pool.execute(insertQuery, [userId, userName, email, hashedPassword]);
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      throw new AppError("Email or username already exists", 409);
    }
    throw err; // unknown DB error → global handler
  }

  const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res
    .status(201)
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? "None" : "Lax",
    })
    .json({
      success: true,
      userProfile: { _id: userId, userName, email },
      message: "Account created successfully",
    });
});

// logIn
export const logIn = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    throw new AppError("All fields are required", 400);
  }

  const checkQuery = "SELECT * FROM users WHERE username = ?";
  let [result] = await pool.execute(checkQuery, [userName]);

  if (result.length == 0) {
    throw new AppError("Username does not exist", 404);
  } else {
    const userProfile = result[0];

    const checkPassword = await bcrypt.compare(password, userProfile.password_hash); // returns boolean if password matches

    if (!checkPassword) {
      throw new AppError("Invalid credentials", 401);
    } else {
      const token = jwt.sign({ _id: userProfile.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res
        .status(200)
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? "None" : "Lax",
        })
        .json({
          success: true,
          userProfile:{password_hash:undefined,...userProfile},
          message: "Logged in successfully",
        });
    }
  }
});

//logOut
export const logOut = (req, res) => {
  res.status(200).clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? "None" : "Lax" }).json({
    success: true,
    message: "Logged Out successfully.!",
  });
};

export const checkAuth = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;

  const query = "SELECT * FROM users WHERE id = ?";
  const [result] = await pool.execute(query, [userId]);

  if (result.length === 0) {
    throw new AppError("User not found", 404);
  }

  const userProfile = result[0];

  res.status(200).json({
    success: true,
    userProfile,
    message: "checkAuth done",
  });
});
