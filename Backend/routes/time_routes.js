import express from 'express';
import attendance from '../controllers/attendances.js';
import authEmployee from '../middleware/auth.js';


const router = express.Router();

router.post('/timein', authEmployee.requireLogin, attendance.employeetimeIn);
router.post('/timeout', authEmployee.requireLogin, attendance.updateEmployeeTimeOut);
router.post('/record', authEmployee.requireLogin, attendance.employeeRecord);
router.post('/records', authEmployee.requireLogin, attendance.allEmployeesAttendanceRecord);


export default router;
