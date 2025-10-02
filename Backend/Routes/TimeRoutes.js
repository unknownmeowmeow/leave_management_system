import express from 'express';
import AttendanceControllers from '../Controllers/attendances.js';
import AuthMiddleware from '../Middleware/authMiddleware.js';


const router = express.Router();

router.post('/timein', AuthMiddleware.requireLogin, AttendanceControllers.employeetimeIn);
router.post('/timeout', AuthMiddleware.requireLogin, AttendanceControllers.updateEmployeeTimeOut);
router.post('/record', AuthMiddleware.requireLogin, AttendanceControllers.employeeRecord);
router.post('/records', AuthMiddleware.requireLogin, AttendanceControllers.allEmployeesAttendanceRecord);


export default router;
