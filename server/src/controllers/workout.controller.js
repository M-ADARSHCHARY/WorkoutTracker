import {
  toPascalCase,
  editDate,
} from "./utils/extraFunctions.util.js";
import connection from "../DB/db.js";
import { v4 as uuidv4 } from "uuid";

export const getData = async (req, res) => {
  const numOfs = "SELECT COUNT(DISTINCT workout_date) AS total_sessions FROM workoutData WHERE user_id = ?";
  const recent_workouts = "SELECT * FROM workoutData WHERE user_id = ? ORDER BY workout_date DESC, Workoutname DESC LIMIT 3";
  const exQuery = "SELECT DISTINCT Exercise_name FROM workoutData WHERE user_id = ?";

  try {
    const { _id: userId } = req.user;

    // Each execute returns [rows, fields]
    const [totalSessionsResult] = await connection.execute(numOfs, [userId]);
    const t_sessions = totalSessionsResult[0]?.total_sessions || 0;
    //console.log("t_sessions: ", t_sessions);

    const [recentWorkouts] = await connection.execute(recent_workouts, [userId]);
    //console.log("recentWorkouts: ", recentWorkouts);
    const [exercisesDid] = await connection.execute(exQuery, [userId]);
    //console.log("exercisesDid: ", exercisesDid);

    return res.status(200).json({
      success: true,
      homePageData:{
        t_sessions,
        recentWorkouts,
        exercisesDid,
      }
    });
  } catch (err) {
    console.error("Error in workout.controller - getData:", err);
    res.status(500)
    .json({
        message: "Internal Server Error.!",
        success: false,
    });
  }
};

export const getHistory = async (req, res) => {
  const { _id: userId } = req.user;
  let allData = "SELECT * FROM workoutData WHERE user_id = ? ORDER BY workout_date DESC";
  try {
    let [rows] = await connection.execute(allData, [userId]);

    if (rows.length == 0) {
      return res.status(200).json({
        success: true,
        message: "No workout History.!",
        data: [],
      });
    } else {
      return res.status(200).json({
        success: true,
        workoutHistory: rows,
      });
    }
  } catch (error) {
    console.log("Error in workout.controller - getHistory: ", error);
    res.status(500).json({
      success: false,
      message: "Internal server Error",
    });
  }
};

export const insertData = async (req, res) => {
  let { workoutname, date, exercisename, reps, sets, max_weight } = req.body;
  const { _id: userId } = req.user;
//   console.log(userId);
  let q =
    "INSERT INTO workoutData(_id,Workoutname,workout_date,Exercise_name,t_sets,reps,weight,user_id) VALUES (?,?,?,?,?,?,?,?)";
  try {
            if (
            !workoutname ||
            !date ||
            !exercisename ||
            !reps ||
            !sets ||
            !max_weight
            ) {
            return res.status(400).json({
                message: "please provide all fields..!",
                success: false,
            });
            }

            const rowId = uuidv4();

            exercisename = toPascalCase(exercisename);
            let data = [
              rowId,
              workoutname,
              date,
              exercisename,
              sets,
              reps,
              max_weight,
              userId,
            ];
            //console.log("Data received:", data)
           
            let result = await connection.execute(q, data);
    
            return res.status(201).json({
                message: "successfully exercise added..!",
                success: true,
            });
  } catch (error) {
    console.log("Error in workout.controller - insertData: ", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const editData = async (req, res) => {
  let { Workoutname, Exercise_name, t_sets, reps, _id, weight } = req.body;
  let updateQuery = `UPDATE workoutData SET Workoutname = ?,Exercise_name = ?,t_sets = ?,reps = ?,weight = ? WHERE _id = ?`;

  try {
    if (
      !Workoutname ||
      !Exercise_name ||
      !reps ||
      !t_sets ||
      !weight
    ) {
      return res.status(400).json({
        message: "please provide all fields..!",
        success: false,
      });
    }

    Exercise_name = toPascalCase(Exercise_name);
    let updatedData = [
      Workoutname,
      Exercise_name,
      t_sets,
      reps,
      weight,
      _id,
    ];
    await connection.execute(updateQuery, updatedData);

     return res.status(201)
               .json({
                     success: true,
                    message: "SuccessFully Edited.!",
                });
  } catch (error) {
    console.log("Error in workout.controller => editData", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const deleteSingleRow = async (req, res) => {
  let { _id } = req.params;
  let delQuery = "DELETE FROM workoutData WHERE _id = ?";

  try {
        await connection.execute(delQuery, [_id]);
        res.status(200)
           .json({
               success:true,
               message: "successfully Deleted..!",
            });
  } catch (error) {
    res.status(500).json({
      message: "Internal server Error",
      success: false,
    });
  }
};

export const deleteAll = async (req, res) => {
  let q = "DELETE FROM workoutData WHERE user_id = ?";
  try{
      const { _id: userId } = req.user;

      await connection.execute(q, [userId]);

        return res.status(200)
            .json({
                message: "SuccessFully All data deleted..!",
                success: true,
            });
  }catch(error){ 
     
    
    console.log("Error in workout.controller - deleteAll",error);
    return res.status(500).json({
          message: "Internal server error",
          success: false,
        });
    }
};

export const getDataForChart = async (req, res) => {
  let q =
    "SELECT workout_date,weight,reps FROM workoutData WHERE user_id = ? and Exercise_name = ? ORDER BY workout_date DESC LIMIT 10";
  const { _id: userId } = req.user;
  const { Exercise } = req.params;
  if (!Exercise) {
    res.status(400).json({
      message: "No exercise selected.!",
      success: false,
    });
  }
  try{
       const [result] = await connection.execute(q, [userId, Exercise]);
        if(result){
            //console.log("result: ",result)
            let chartData = editDate(result);
            res.status(200).json({
              chartData:result,
              message: "SuccessFully fetched",
              success: true,
            });
        }
  }catch(error){
      res.status(500).json({message:"Internal Server Error..!",success:false})
  }
};
