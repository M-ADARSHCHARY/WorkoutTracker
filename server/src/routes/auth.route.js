import express from 'express';
import {signUp,logIn,logOut , checkAuth} from '../controllers/auth.controller.js'
import authenticateUser from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/signup",signUp);

router.post("/login",logIn);

router.post("/logout", authenticateUser,logOut);

router.get("/check-auth",authenticateUser,checkAuth);

export default router;