import express from "express";
import leaveType from "../controllers/leave_types.js";
import leaveFile from "../controllers/leave_files.js";
import AuthEmployee from "../middleware/auth.js";

const router = express.Router();


router.get("/api/leave_types", AuthEmployee.requireLogin, leaveType.getAllDefaultLeaveType);
router.get("/api/leave_types_admin", AuthEmployee.requireLogin, leaveType.getAllRewardedAndSpecialLeave);

router.post("/api/leave/apply", AuthEmployee.requireLogin, leaveFile.applyLeave);


router.get("/api/leave/latest_credit", AuthEmployee.requireLogin, leaveFile.getLatestCredit);

router.get("/api/leave/employeesbyrole", AuthEmployee.requireLogin, leaveFile.getAllEmployeeAndIntern);

export default router;
