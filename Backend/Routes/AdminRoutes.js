import express from "express";
import LeaveController from "../Controllers/admin_leaves.js";
import AuthMiddleware from "../Middleware/authMiddleware.js";

const router = express.Router();


router.get("/leave_transactions", AuthMiddleware.requireLogin, LeaveController.getAllEmployeeLeaveTransaction);
router.post("/update_leave_status", AuthMiddleware.requireLogin, LeaveController.updateLeaveStatus);
router.get("/leave_transaction", AuthMiddleware.requireLogin, LeaveController.getAllLeaveTransactionByEmployee);

export default router;
