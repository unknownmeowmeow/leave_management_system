import express from "express";
import LeaveController from "../Controllers/AdminLeaveControllers.js";
import AuthMiddleware from "../Middleware/authMiddleware.js";

const router = express.Router();


router.get("/leave_transactions", AuthMiddleware.requireLogin, LeaveController.getAllLeaveTransactions);

router.post("/update_leave_status", AuthMiddleware.requireLogin, LeaveController.updateLeaveStatus);

export default router;
