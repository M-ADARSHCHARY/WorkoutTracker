import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authenticateUser = (req, res, next) => {
    // console.log(req.cookies)
    const token = req.cookies.token;

    if (!token) return res.redirect("/wt/auth/login");

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("verified",verified); user_id (pay-load)
        req.user = verified; // Attach user data to request
        // console.log(req.user);
        next();
    } catch (error) {
        res.status(403).json({ error: "Invalid token" });
    }
};

export default authenticateUser;
