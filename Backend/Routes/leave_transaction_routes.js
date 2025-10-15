import express from "express";
import leaveFile from "../Controllers/leave_files.js";
import authSession from "../Middleware/authMiddleware.js";
import leaveTransaction from "../Controllers/transactions.js"; 

const router = express.Router();

router.get("/history", authSession.requireLogin, (req, res) => leaveFile.employeeLeaveCreditHistory(req, res));
router.get("/all/history", authSession.requireLogin, (req, res) => leaveFile.employeeCreditLeave(req, res));
router.get("/leave_transaction", authSession.requireLogin, (req, res) => leaveTransaction.employeeLeaveTransaction(req, res));
router.get("/leave_transactions", authSession.requireLogin, (req, res) => leaveTransaction.allDefaultEmployeeTransaction(req, res));
router.post("/update_leave_status", authSession.requireLogin, (req, res) => leaveTransaction.updateLeaveTransaction(req, res));
router.get("/rewarded_transactions", authSession.requireLogin, (req, res) => leaveTransaction.allEmployeeRewardedLeaveTransaction(req, res));
export default router;
    