import AttendanceModel from "../Models/AttendanceModel.js";
import TimeValidationHelper from "../Helpers/TimeValidationHelper.js";
import {
    ALREADY_TIME_IN,
    SUCCESS_TIME_IN,
    ERROR_IN_TIME_OUT_ID,
    ERROR_IN_TIME_OUT,
    SESSION_USER_NOT_FOUND,
    ALREADY_TIME_OUT,
    ERROR_IN_CATCH_GET_ALL_RECORD,
} from "../Constant/Constants.js";

class AttendanceControllers{
    /**
     * Handles employee time-in process.
     * - Checks for active session user.
     * - Validates if the employee already timed in.
     * - Inserts a new time-in record.
     *
     * @param {Object} req Express request object.
     * @param {Object} res Express response object.
     * @returns {Object} JSON response indicating success or failure.
     * created by: Rogendher Keith Lachica
     * updated at: September 24 2025 9:00 am
     */
    static async EmployeetimeIn(req, res){
        const user = req.session.user;

        if(!user){
            return res.json(SESSION_USER_NOT_FOUND);
        }

        try{
            const employee_id = user.employee_id;
            const check_time_in = await AttendanceModel.checkEmployeeLatestTimeIn(employee_id);

            if(check_time_in.status && check_time_in.result){
                return res.json(ALREADY_TIME_IN);
            }
            const result = await AttendanceModel.insertEmployeeTimeInAttendance({ employee_id });

            if(!result.status){
                return res.json({ success: false, message: result.error });
            }
            return res.json(SUCCESS_TIME_IN);
        } 
        catch(error){
            return res.json({ success: false, message: error.message });
        }
    }

    /**
     * Handles the employee time-out process.
     *
     * - Verifies that a user session exists.
     * - Retrieves the latest active time-in record for the employee.
     * - Validates presence of necessary time-in data.
     * - Generates the current time as the time-out.
     * - Calculates total work hours between time-in and time-out.
     * - Validates the time-out data.
     * - Updates the attendance record in the database with time-out and work hours.
     *
     * @param {Object} req Express request object.
     * @param {Object} res Express response object.
     * @returns {Object} JSON response indicating success or failure.
     * created by: Rogendher Keith Lachica
     * updated at: September 23 2025 10:34 am
     */
    static async EmployeetimeOut(req, res){
        const user = req.session.user;

        if(!user){
            return res.json(SESSION_USER_NOT_FOUND);
        }

        try{
            const employee_id = user.employee_id;
            const attendance_type_id = 2;
            const record = await AttendanceModel.checkEmployeeLatestTimeIn(employee_id);
            const active_record_time_in = record.result;
            const check_time_out = await AttendanceModel.checkLatestEmployeeTimeOut(employee_id);

            if(check_time_out.status && check_time_out.result){
                return res.json(ALREADY_TIME_OUT);
            }

            if(!record.status || !active_record_time_in){
                return res.json(ERROR_IN_TIME_OUT);
            }
            const id = active_record_time_in.id;
            const time_in = active_record_time_in.time_in;

            if(!id || !time_in){
                return res.json(ERROR_IN_TIME_OUT_ID);
            }
            const time_out = TimeValidationHelper.checkEmployeeCurrentTime();
            const work_hour = TimeValidationHelper.calculateEmployeeWorkHour(time_in, time_out);
            const validation_check_time = TimeValidationHelper.validateEmployeeTimeOut({ id, time_out, work_hour });

            if(!validation_check_time.is_valid){
                return res.json({ success: false, message: validation_check_time.error });
            }

            const update_attendance = await AttendanceModel.updateEmployeeTimeOutAttendance({
                id,
                time_out,
                work_hour,
                attendance_type_id,
            });

            if(!update_attendance.status){
                return res.json({ success: false, message: update_attendance.error });
            }

            return res.json({
                success: true,
                message: `Time out Successfully`,
                time_out,
                work_hour,
            });
        } 
        catch(error){
            return res.json({ success: false, message: error.message });
        }
    }

    /**
     * Retrieves all attendance records for the logged-in employee.
     *
     * @param {Object} req Express request object.
     * @param {Object} res Express response object.
     * @returns {Object} JSON response with employee records or error.
     * created by: Rogendher Keith Lachica
     * updated at: September 24 2025 9:00 am
     */
    static async EmployeeRecord(req, res){
        const user = req.session.user;

        if(!user || !user.employee_id){
            return res.json(SESSION_USER_NOT_FOUND);
        }
        const employee_id = user.employee_id;

        try{
            const response_data = await AttendanceModel.getAllEmployeeRecord(employee_id);

            if(response_data.error){
                return res.json({ success: false, message: response_data.error });
            }

            return res.json({ success: true, records: response_data.result });
        } 
        catch(error){
            return res.json(ERROR_IN_CATCH_GET_ALL_RECORD);
        }
    }

    /**
     * Retrieves attendance records of all employees.
     *
     * @param {Object} req Express request object.
     * @param {Object} res Express response object.
     * @returns {Object} JSON response with all employees records or error.
     * created by: Rogendher Keith Lachica
     * updated at: September 24 2025 9:00 am
     */
    static async AllEmployeesAttendanceRecord(req, res){
        const user = req.session.user;

        if(!user || !user.employee_id){
            return res.json(SESSION_USER_NOT_FOUND);
        }

        try{
            const response_data = await AttendanceModel.getAllEmployeesRecords();

            if(response_data.error){
                return res.json({ success: false, message: response_data.error });
            }

            return res.json({ success: true, records: response_data.result });
        } 
        catch(error){
            return res.json(ERROR_IN_CATCH_GET_ALL_RECORD);
        }
    }
}

export default AttendanceControllers;
