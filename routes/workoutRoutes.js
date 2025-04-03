import express from "express";
import connection from "../db.js";
import authenticateUser from "../middlewares/authMiddleware.js";
const router = express.Router({mergeParams:true});

// GET DATA 
router.get("/", authenticateUser,async (req, res) => {
    let numOfs = "SELECT COUNT(*) AS total_sessions FROM workoutData WHERE user_id = ?";
    let recent_workouts = "SELECT * FROM workoutData WHERE user_id = ? ORDER BY workout_date DESC, Workoutname DESC LIMIT 3";
    let exQuery = "SELECT DISTINCT Exercise_name FROM workoutData WHERE user_id = ?"
    try {
        const id = req.user.id;
        let totalSessionsResult = await runQuery(numOfs,id); // resolve(result) =>returns array
        let t_sessions = totalSessionsResult[0].total_sessions;

        let recentWorkouts = await runQuery(recent_workouts,id); // resolve(result) => returns array of object's (3) 
        //console.log(recentWorkouts)
        let exercisesDid = await runQuery(exQuery,id);
        // console.log(exercisesDid); 
        res.render("Home.ejs", { t_sessions, recentWorkouts , exercisesDid });
    } catch (err){
        console.error(err);
        res.render("Home.ejs", { t_sessions: 0, recentWorkouts: [],exercisesDid:[] });
    }
});
function runQuery(sql,id) {
    return new Promise((resolve,reject)=>{
       connection.query(sql,[id],(err,res)=>{
           if(err){
             reject(err);
         }else{
             resolve(res)
         }
       });
    })
}



// SHOW DATA
router.get("/history",authenticateUser,(req,res)=>{ 
    try{
        let allData = "SELECT * FROM workoutData WHERE user_id = ? ORDER BY workout_date DESC";
        connection.query(allData,[req.user.id],(error,result)=>{
            if(error) throw error;
            if(result.length == 0){
               res.redirect("/wt"); 
            }else{
                //console.log(result);
                res.render("History.ejs",{result}); 
            }
        });
    }catch(error){
        res.send("Data not fetched")
    }
});



function toPascalCase(str) {
    return str
        .toLowerCase()
        .split(/[^a-zA-Z0-9]+/) // Split by spaces, underscores, etc.
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '); // Join with spaces
}

// SEND DATA (SAVE DATA)
router.post("/insert",authenticateUser,(req,res)=>{
    let {workoutname, date,exercisename,reps,sets,max_weight} = req.body;
    let q = "INSERT INTO workoutData(Workoutname,workout_date,Exercise_name,t_sets,reps,weight,user_id) VALUES (?)";
    exercisename = toPascalCase(exercisename);
    let data = [workoutname,date,exercisename,sets,reps,max_weight,req.user.id]
    connection.query(q,[data],(err,result)=>{
       try{
          if(err) throw err
          res.redirect("/wt");
    }catch(err){
        console.log(err)
          res.send("Error data not saved");
       }
    });
});


// PATCH (This req implemented with fetch)
router.patch("/edit",authenticateUser,(req,res)=>{
    let {workoutname,workoutdate,exercisename,sets,reps,id,maxweight}= req.body;
    let updateQuery = `UPDATE workoutData SET Workoutname = ?,workout_date = ?,Exercise_name = ?,t_sets = ?,reps = ?,weight = ? WHERE id = ?`;
    exercisename = toPascalCase(exercisename);
    let updatedData = [workoutname,workoutdate,exercisename,sets,reps,maxweight,id];
    connection.query(updateQuery,updatedData,(err,result)=>{
        if(err){
            res.send("Fill all fields");
        }else{
            res.send("Success");
        }
    })
});


// DELETE
router.delete("/delete/:Id",authenticateUser,(req,res)=>{
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
router.delete("/deleteAll",authenticateUser,(req,res)=>{
    let q = "DELETE FROM workoutData WHERE user_id = ?"
    connection.query(q,[req.user.id],(err,result)=>{
        if(err){
            res.send("Can't delete")
        }
        else{
            res.send("Deleted");
        }
    });
})




router.get("/getData/:Exercise", authenticateUser, (req,res)=>{
    let q = "SELECT workout_date,weight,reps FROM workoutData WHERE user_id = ? and Exercise_name = ? ORDER BY workout_date DESC LIMIT 10"
    const id = req.user.id;
    const {Exercise} = req.params;
    connection.query(q, [id,Exercise],(err,result)=>{
        if(err){
            res.send([]);
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

export default router;