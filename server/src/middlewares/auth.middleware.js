import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authenticateUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(400).json({message:"session expired.!"});

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if(verified){
            // console.log("verified: ",verified)
            req.user = {_id:verified._id}; // Attach user Id to request
            // console.log("req.user =>",req.user)
            next();
        }
    } catch (error) {
        res.status(403).json({ error: "Invalid token" });
    }
};

export default authenticateUser;
