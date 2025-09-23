import express from 'express';
import AttendanceControllers from '../Controllers/AttendanceControllers.js';
import AuthMiddleware from '../Middleware/authMiddleware.js';


const router = express.Router();

router.post('/timein', AuthMiddleware.requireLogin, AttendanceControllers.timeIn);
router.post('/timeout', AuthMiddleware.requireLogin, AttendanceControllers.timeOut);

export default router;
