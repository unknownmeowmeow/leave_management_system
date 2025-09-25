import express from "express";
import LeaveTypeController from "../Controllers/LeaveTypeControllers.js";

const router = express.Router();

router.get("/api/leave_types", LeaveTypeController.getAllDefaultLeaveType);

router.get("/api/leave_types_admin", LeaveTypeController.getAllRewardedAndSpecialLeave);

export default router;
