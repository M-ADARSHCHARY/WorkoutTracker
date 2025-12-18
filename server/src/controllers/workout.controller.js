import { toPascalCase, editDate } from "./utils/extraFunctions.util.js";
import pool from "../DB/db.js";
import { v4 as uuidv4 } from "uuid";
import asyncHandler from "../middlewares/asyncHandler.js";
import AppError from "../utils/AppError.js";

/* ====================== DASHBOARD DATA ====================== */
export const getData = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;

  const numOfs = `
    SELECT COUNT(DISTINCT workout_date) AS total_sessions
    FROM workouts
    WHERE user_id = ?
  `;

  const recentWorkoutsQuery = `
    SELECT *
    FROM workouts
    WHERE user_id = ?
    ORDER BY workout_date DESC, workout_name DESC
    LIMIT 3
  `;

  const exercisesQuery = `
    SELECT DISTINCT exercise_name
    FROM workouts
    WHERE user_id = ?
  `;

  const [totalSessionsResult] = await pool.execute(numOfs, [userId]);
  const [recentWorkouts] = await pool.execute(recentWorkoutsQuery, [userId]);
  const [exercisesDid] = await pool.execute(exercisesQuery, [userId]);

  res.status(200).json({
    success: true,
    homePageData: {
      t_sessions: totalSessionsResult[0]?.total_sessions || 0,
      recentWorkouts,
      exercisesDid,
    },
  });
});

/* ====================== WORKOUT HISTORY ====================== */
export const getHistory = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  
  const limit = 10;
  const page = Number(req.query.page) || 1;
  const offset = (page - 1) * limit;

  const historyQuery = `
  SELECT *
  FROM workouts
  WHERE user_id = ?
  ORDER BY workout_date DESC
  LIMIT ${limit} OFFSET ${offset}
`;

  const countQuery = `
    SELECT COUNT(*) AS total
    FROM workouts
    WHERE user_id = ?
  `;

  const [rows] = await pool.execute(historyQuery, [userId]);
  const [countResult] = await pool.execute(countQuery, [userId]);

  const totalPages = Math.ceil((countResult[0]?.total || 0) / limit);

  res.status(200).json({
    success: true,
    currentPage: page,
    totalPages,
    workoutHistory: rows,
  });
});

/* ====================== INSERT WORKOUT ====================== */
export const insertData = asyncHandler(async (req, res) => {
  const { workoutName, workoutDate, exerciseName, reps, sets, maxWeight } =
    req.body;
  const { _id: userId } = req.user;

  if (
    !workoutName ||
    !workoutDate ||
    !exerciseName ||
    reps == null ||
    sets == null ||
    maxWeight == null
  ) {
    throw new AppError("All fields are required", 400);
  }

  const query = `
    INSERT INTO workouts
    (id, user_id, workout_name, exercise_name, workout_date, sets, reps, weight)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  await pool.execute(query, [
    uuidv4(),
    userId,
    workoutName,
    toPascalCase(exerciseName),
    workoutDate,
    sets,
    reps,
    maxWeight,
  ]);

  res.status(201).json({
    success: true,
    message: "Workout added successfully",
  });
});

/* ====================== EDIT WORKOUT ====================== */
export const editData = asyncHandler(async (req, res) => {
  const { workoutName, exerciseName, sets, reps, workoutId, maxWeight } =
    req.body;
  const { _id: userId } = req.user;

  console.log("Received edit data:", req.body);
  
  if (
    !workoutName ||
    !exerciseName ||
    reps == null ||
    sets == null ||
    maxWeight == null ||
    !workoutId
  ) {
    throw new AppError("All fields are required", 400);
  }

  const updateQuery = `
    UPDATE workouts
    SET workout_name = ?, exercise_name = ?, sets = ?, reps = ?, weight = ?
    WHERE id = ? AND user_id = ?
  `;

  await pool.execute(updateQuery, [
    workoutName,
    toPascalCase(exerciseName),
    sets,
    reps,
    maxWeight,
    workoutId,
    userId,
  ]);

  res.status(200).json({
    success: true,
    message: "Workout updated successfully",
  });
});

/* ====================== DELETE SINGLE ====================== */
export const deleteSingleRow = asyncHandler(async (req, res) => {
  const { workoutId } = req.params;

  await pool.execute("DELETE FROM workouts WHERE id = ?", [workoutId]);

  res.status(200).json({
    success: true,
    message: "Workout deleted successfully",
  });
});

/* ====================== DELETE ALL ====================== */
export const deleteAll = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;

  await pool.execute("DELETE FROM workouts WHERE user_id = ?", [userId]);

  res.status(200).json({
    success: true,
    message: "All workouts deleted successfully",
  });
});

/* ====================== CHART DATA ====================== */
export const getDataForChart = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  const { exerciseName } = req.params;

  if (!exerciseName) {
    throw new AppError("Exercise name is required", 400);
  }

  const query = `
    SELECT workout_date, weight, reps
    FROM workouts
    WHERE user_id = ? AND exercise_name = ?
    ORDER BY workout_date DESC
    LIMIT 10
  `;

  const [result] = await pool.execute(query, [
    userId,
    toPascalCase(exerciseName),
  ]);

  res.status(200).json({
    success: true,
    chartData: editDate(result),
  });
});
