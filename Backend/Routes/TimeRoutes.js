import express from 'express';
import AttendanceControllers from '../Controllers/Attendance.js';
import AuthMiddleware from '../Middleware/authMiddleware.js';


const router = express.Router();

router.post('/timein', AuthMiddleware.requireLogin, AttendanceControllers.EmployeetimeIn);
router.post('/timeout', AuthMiddleware.requireLogin, AttendanceControllers.EmployeetimeOut);
router.post('/record', AuthMiddleware.requireLogin, AttendanceControllers.EmployeeRecord);
router.post('/records', AuthMiddleware.requireLogin, AttendanceControllers.AllEmployeesAttendanceRecord);


export default router;
