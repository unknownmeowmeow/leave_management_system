import AttendanceModel from "../Models/AttendanceModel.js";
import TimeValidationHelper from "../Helpers/TimeValidationHelper.js";
import { ALREADY_TIME_IN, SUCCESS_TIME_IN, ERROR_IN_TIME_OUT_ID, 
    ERROR_IN_TIME_OUT, SESSION_USER_NOT_FOUND
} from "../constant.js"

class AttendanceControllers{

    static async timeIn(req, res){
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
                return res.json({ success: false, message: result.error});
            }
            return res.json(SUCCESS_TIME_IN);
        }
        catch(error){
            return res.json({ success: false, message: error.message});
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
    * @param {Object} req - The Express request object, expected to include the session user.
    * @param {Object} res - The Express response object used to return the result.
    *
    * @returns {Object} JSON response indicating success or failure, and additional data if successful.
    */
    static async timeOut(req, res){
        const user = req.session.user;

        if(!user){
            return res.json(SESSION_USER_NOT_FOUND);
        }

        try{
            const employee_id = user.employee_id;
            const attendance_type_id = 1;
            const record = await AttendanceModel.checkEmployeeLatestTimeIn(employee_id);
            const active_record_time_in = record.result;

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
                attendance_type_id
            });

            if(!update_attendance.status){
                return res.json({ success: false, message: update_attendance.error });
            }

            return res.json({
                success: true,
                message: `Time out Successfully`,
                time_out,
                work_hour
            });

        }
        catch(error){
            return res.json({ success: false, message: error.message });
        }
    }

}

export default AttendanceControllers;
