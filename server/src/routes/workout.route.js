import express from 'express'
import {
    getData,
    insertData,
    editData,
    deleteSingleRow,
    deleteAll,
    getDataForChart,
    getHistory
    } from "../controllers/workout.controller.js";

import authenticateUser from "../middlewares/auth.middleware.js";
const router = express.Router({mergeParams:true});

// GET DATA 
router.get("/", authenticateUser,getData);
// SHOW DATA
router.get("/history",authenticateUser,getHistory);
// SEND DATA (SAVE DATA)
router.post("/insert",authenticateUser,insertData);
// PATCH (This req implemented with fetch)
router.patch("/edit",authenticateUser,editData);
// DELETE
router.delete("/delete/:_id",authenticateUser,deleteSingleRow)

//DELETEALL
router.delete("/deleteAll",authenticateUser,deleteAll)

//getDataForChat
router.get("/getData/:Exercise", authenticateUser,getDataForChart)

export default router;