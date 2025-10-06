import express from "express";
import creditLeave from "../controllers/credits.js";
import authEmployee from "../middleware/auth.js";

const router = express.Router();

router.post("/credits/yearly", creditLeave.runYearlyCreditInsertion);
router.get("/credits", authEmployee.requireLogin, creditLeave.getAllEmployeeCredits);

export default router;
