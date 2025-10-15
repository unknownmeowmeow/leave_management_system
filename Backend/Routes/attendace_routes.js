import express from 'express';
import attendance from '../Controllers/attendances.js'; 
import authSession from '../Middleware/authMiddleware.js';

const router = express.Router();


router.post('/timein', authSession.requireLogin, (req, res) => attendance.employeeTimeIn(req, res));
router.post('/timeout', authSession.requireLogin, (req, res) => attendance.employeeTimeOut(req, res));
router.post('/record', authSession.requireLogin, (req, res) => attendance.employeeAttendance(req, res));
router.post('/records', authSession.requireLogin, (req, res) => attendance.allEmployeeAttendance(req, res));

export default router;
