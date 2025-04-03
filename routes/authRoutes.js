import express from "express";
import connection from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const router = express.Router();


router.get("/signup",(req,res)=>{
    res.render("signUp.ejs");
})

router.post("/signup",async (req,res)=>{
    let {username,email,password}  = req.body;

    // Hash password by adding salt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    
    
    let insertQuery = "INSERT INTO users(username,email,password) VALUES(?,?,?)";
    let arr = [username,email,hashedPassword];
    connection.query(insertQuery,arr,(err,result)=>{
       if(err){
         res.send("Some error Occured");
       }else{
        // generate token
        const token = jwt.sign({id:result.insertId},process.env.JWT_SECRET,{expiresIn:"1h"});
        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "Strict" }).redirect("/wt");
       }
    })
});

router.get("/login",(req,res)=>{
    res.render("login.ejs");
})

router.post("/login",(req,res)=>{
    const {username,password} = req.body;

    const checkQuery = "SELECT * FROM users WHERE username = ?";
    connection.query(checkQuery,[username],async (err,result)=>{
        // console.log(result);
        if(result.length == 0){
            res.send("user does not exists");
        }else{
           const user = result[0];
           
           const checkPassword = await bcrypt.compare(password,user.password) // returns boolean if password matches
           
           if(!checkPassword){
               res.send("Wrong password");
           }else{
            const token = jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:"1h"});
            res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "Strict" }).redirect("/wt");
           }
        }


    })
})
router.post("/logout",(req,res)=>{
   res.clearCookie("token",{httpOnly:true,secure:false}); // clear cookie in browser
   res.redirect("/wt/auth/login")
})




export default router;