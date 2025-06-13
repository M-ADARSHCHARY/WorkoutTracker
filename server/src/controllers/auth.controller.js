import connection from "../DB/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config(); // Load environment variables

// signUp
export const signUp = async (req, res) => {
  let { username, email, password } = req.body;

  if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Invalid data..",
        });
  }
  try {
    const userId = uuidv4(); // generate userId unique and random

    const salt = await bcrypt.genSalt(10);

    // Hash password by adding salt
    const hashedPassword = await bcrypt.hash(password, salt);
    let insertQuery =
      "INSERT INTO users(_id,username,email,password) VALUES(?,?,?,?)";
    let arr = [userId, username, email, hashedPassword];

        await connection.execute(insertQuery, arr);
        // generate token
        const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET, {expiresIn: "1h",});

        return res.status(201)
                .cookie("token", token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "Strict",
                })
                .json({
                    success: true,
                    userProfile: {
                    _id: userId,
                    username,
                    email,
                    },
                    message: "Account created successfully..!",
                });

  } catch (error) {
    console.log("error in auth.controller- signUp: ", error);

   if (error.code === "ER_DUP_ENTRY") 
   {
          return res
            .status(400)
            .json({
              success: false,
              message: "email or username already exists..!",
            });
   }
    return res.status(500).json({
       success: false, 
       message: "Internal Server Error"
       });
  }
};

// logIn
export const logIn = async (req, res) => {
  const { username, password } = req.body;
  
  try{
            if(!username || !password){
                return res.status(400).json({message:"All fields are required.!",success:false});
            }

            const checkQuery = "SELECT * FROM users WHERE username = ?";
            let [result] = await connection.execute(checkQuery, [username]);


            if (result.length == 0) {
                return res.status(400)
                    .json({
                        success:false,
                        message:"Username does not exists.!"
                    });
            }
            else{
                        const userProfile = result[0];

                        const checkPassword = await bcrypt.compare(password, userProfile.password); // returns boolean if password matches

                        if (!checkPassword) {
                            return res.status(400)
                                    .json({
                                        success:false,
                                        message:"Invalid Credentials.!"
                                    });
                        }else
                        {
                        
                            const token = jwt.sign({ _id: userProfile._id }, process.env.JWT_SECRET, {expiresIn: "1h",});
                            return res.status(200)
                                    .cookie("token", token, {
                                    httpOnly: true,
                                    secure: false,
                                    sameSite: "Strict",
                                    })
                                    .json({
                                        success:true,
                                        userProfile,
                                        message:"Logged in successfully",
                                    })
                        }
                }
        }catch (error) {
            console.log("error in auth.controller-logIn: ", error);
            res.status(500).json({
                message:"Internal Server Error",
                success:false,
            })
        }
};

//logOut
export const logOut = (req, res) => {
 
    res.status(200).clearCookie("token", { httpOnly: true, secure: false})
    .json({
        success:true,
        message:"Logged Out successfully.!",
    });
};



export const checkAuth = async (req,res) => {
    const {_id:userId} = req.user; 
    
    try{
        let q = 'SELECT * FROM users WHERE _id = (?)'

        let [result] =  await connection.execute(q,[userId])
        const userProfile = result[0];
        return res.status(200)
               .json({
                 userProfile,
                 success:true,
                 message:"checkAuth Done..!",
               });

    }catch(error){
        console.log("Error in checkAuth :",error);
        res.status(400)
           .json({
            message:"session Expired.!",
            success:false,
           });
    }  
}