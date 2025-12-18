import express from 'express';
import {signUp,logIn,logOut , checkAuth} from '../controllers/auth.controller.js'
import authenticateUser from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/sign-up",signUp);

router.post("/log-in",logIn);

router.post("/log-out", authenticateUser,logOut);

router.get("/check-auth",authenticateUser,checkAuth);

export default router;