import express from "express";
import adminLeave from "../controllers/admin_leaves.js";
import autEmployee from "../middleware/auth.js";

const router = express.Router();


router.get("/leave_transactions", autEmployee.requireLogin, adminLeave.getAllEmployeeLeaveTransaction);
router.post("/update_leave_status", autEmployee.requireLogin, adminLeave.updateLeaveStatus);
router.get("/leave_transaction", autEmployee.requireLogin, adminLeave.getAllLeaveTransactionByEmployee);

export default router;
