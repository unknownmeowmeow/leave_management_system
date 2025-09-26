import express from "express";
import LeaveTypeController from "../Controllers/LeaveTypeControllers.js";
import LeaveController from "../Controllers/LeaveFileControllers.js";
import AuthMiddleware from "../Middleware/authMiddleware.js";

const router = express.Router();

router.get("/api/leave_types", AuthMiddleware.requireLogin, LeaveTypeController.getAllDefaultLeaveType);
router.get("/api/leave_types_admin", AuthMiddleware.requireLogin, LeaveTypeController.getAllRewardedAndSpecialLeave);
router.post("/api/leave/apply", AuthMiddleware.requireLogin, LeaveController.applyLeave);
router.get("/latest_credit", AuthMiddleware.requireLogin, LeaveController.getLatestCredit);
router.post("/apply", AuthMiddleware.requireLogin, LeaveController.applyLeave);
router.get("/employeesbyrole", LeaveController.getEmployeesByRole);
router.get("/api/leave/latest_credit", AuthMiddleware.requireLogin, LeaveController.getLatestCredit);

export default router;
