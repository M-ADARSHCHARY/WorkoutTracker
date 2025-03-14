import path from "path";
import express from "express";
import mysql from "mysql2";
import methodOverride from "method-override";
import { fileURLToPath } from "url";
import dotenv from 'dotenv';
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

// Connection between backend and sql database
var connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER, // mySql Username
    password : process.env.DB_PASSWORD, // mysql password
    database : process.env.DB_NAME, //  name of the database using
  });

// GET DATA 
function runQuery(sql) {
    return new Promise((resolve,reject)=>{
       connection.query(sql,(err,res)=>{
           if(err){
             reject(err);
         }else{
             resolve(res)
         }
       });
    })
}
// USING ASYNC AWAIT
app.get("/", async (req, res) => {
    let numOfs = "SELECT COUNT(*) AS total_sessions FROM workoutData";
    let recent_workouts = "SELECT * FROM workoutData ORDER BY workout_date DESC, Workoutname DESC LIMIT 3";

    try {
        let totalSessionsResult = await runQuery(numOfs); // resolve(result) =>returns array
        let t_sessions = totalSessionsResult[0].total_sessions;

        let recentWorkouts = await runQuery(recent_workouts); // resolve(result) => returns array of object's (3) 
        //console.log(recentWorkouts)
        res.render("Home.ejs", { t_sessions, recentWorkouts });
    } catch (err){
        console.error(err);
        res.render("Home.ejs", { t_sessions: 0, recentWorkouts: [] });
    }
});

// SHOW DATA
app.get("/history",(req,res)=>{ 
    try{
        let allData = "SELECT * FROM workoutData ORDER BY workout_date DESC";
        connection.query(allData,(error,result)=>{
            if(error) throw error;
            if(result.length == 0){
               res.send("No data Exists..!"); 
            }else{
                //console.log(result);
                res.render("History.ejs",{result});
            }
        });
    }catch(error){
        res.send("Data not fetched")
    }
})
// SEND DATA (SAVE DATA)
app.post("/insert",(req,res)=>{
    let {workoutname, date,exercisename,reps,sets,max_weight} = req.body;
    let q = "INSERT INTO workoutData(Workoutname,workout_date,Exercise_name,t_sets,reps,weight) VALUES (?)";
    let data = [workoutname,date,exercisename,sets,reps,max_weight]
    connection.query(q,[data],(err,result)=>{
       try{
          if(err) throw err
          res.redirect("/");
    }catch(err){
        console.log(err)
          res.send("Error data not saved");
       }
    });
});

// PATCH (This req implemented with fetch)
app.patch("/edit",(req,res)=>{
    let {workoutname,workoutdate,exercisename,sets,reps,id,maxweight}= req.body;
    let updateQuery = `UPDATE workoutData SET Workoutname = ?,workout_date = ?,Exercise_name = ?,t_sets = ?,reps = ?,weight = ? WHERE id = ?`;
    let updatedData = [workoutname,workoutdate,exercisename,sets,reps,maxweight,id];
    connection.query(updateQuery,updatedData,(err,result)=>{
        if(err){
           console.log(err)
            res.send("Data Not Inserted");
        }else{
            res.send("Status:200 Success");
        }
    })
});
// DELETE
app.delete("/delete/:Id",(req,res)=>{
    let {Id} = req.params;
    let delQuery = "DELETE FROM workoutData WHERE id = ?";

    connection.query(delQuery,[Id],(err,result)=>{
        if(err){
            console.log("deleted")
            res.send("Failed To delete")
        }else{
            res.send("SuccessFully Deleted")
        }
    })
})

//DELETEALL
app.delete("/deleteAll",(req,res)=>{
    let q = "TRUNCATE TABLE workoutData"
    connection.query(q,(err,result)=>{
        if(err){
            res.send("Can't delete")
        }
        else{
            res.send("Deleted");
        }
    });
})

app.get("/getData",  (req,res)=>{
    let q = "SELECT workout_date,weight,reps FROM workoutData ORDER BY workout_date DESC LIMIT 5"
    connection.query(q, (err,result)=>{
        if(err){
            res.status(500).send("Error");
        }else{
            let Result = editDate(result);
            res.send(Result);
        }
    })
})
function editDate(result){
    for(let i = 0;i < result.length;i++){
        result[i].workout_date = result[i].workout_date.toLocaleDateString('en-CA').slice(0,10);
    }
    return result.reverse()
}
 
app.listen(port,()=>{
    console.log("Server Listening at port:",port);
});