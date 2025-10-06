    import express from 'express';
    import attendance from '../controllers/attendances.js';
    import AuthEmployee from '../middleware/auth.js';


    const router = express.Router();

    router.post("/timein", AuthEmployee.requireLogin, attendance.employeetimeIn);
    router.post('/timeout', AuthEmployee.requireLogin, attendance.updateEmployeeTimeOut);
    router.post('/record', AuthEmployee.requireLogin, attendance.employeeRecord);
    router.post('/records', AuthEmployee.requireLogin, attendance.allEmployeesAttendanceRecord);


    export default router;
