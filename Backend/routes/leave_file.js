import express from "express";
import leaveType from "../controllers/leave_types.js";
import leaveFile from "../controllers/leave_files.js";
import authEmployee from "../middleware/auth.js";

const router = express.Router();

router.get("/api/leave_types", authEmployee.requireLogin, leaveType.getAllDefaultLeaveType);
router.get("/api/leave_types_admin", authEmployee.requireLogin, leaveType.getAllRewardedAndSpecialLeave);
router.post("/api/leave/apply", authEmployee.requireLogin, leaveFile.applyEmployeeLeave);
router.get("/latest_credit", authEmployee.requireLogin, leaveFile.getLatestCredit);
router.post("/apply", authEmployee.requireLogin, leaveFile.applyLeave);
router.get("/employeesbyrole", leaveFile.getAllEmployeeAndIntern);
router.get("/api/leave/latest_credit", authEmployee.requireLogin, leaveFile.getLatestCredit);

export default router;
