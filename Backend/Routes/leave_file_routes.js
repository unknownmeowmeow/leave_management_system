import express from "express";
import leaveType from "../Controllers/leave_types.js"; 
import leave from "../Controllers/leave_files.js"; 
import authSession from "../Middleware/authMiddleware.js";
import leaveCredit from "../Controllers/credits.js"; 
const router = express.Router();

router.get("/", authSession.requireLogin, (req, res) => leaveType.allDefaultLeaveType(req, res));
router.get("/leave_type_rewarded", authSession.requireLogin, (req, res) => leaveType.allRewardedLeave(req, res));
router.post("/leave/apply", authSession.requireLogin, (req, res) => leave.applyEmployeeLeave(req, res));
router.get("/latest_credit", authSession.requireLogin, (req, res) => leaveCredit.allLatestCredit(req, res));
router.get("/api/leave/latest_credit", authSession.requireLogin, (req, res) => leaveCredit.allLatestCredit(req, res));

export default router;
