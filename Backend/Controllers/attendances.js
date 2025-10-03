import AttendanceModel from "../Models/attendance.js";
import TimeValidationHelper from "../Helpers/time_validation_helper.js";
import LeaveCreditModel from "../Models/leave_credit.js";   
import WorkTimeValidationHelper from "../Helpers/work_time_validation_helper.js";
import database from "../Configs/database.js";
import { ATTENDANCE_TYPE_ID, NUMBER } from "../Constant/constants.js";

class AttendanceControllers{

    /**
     * Handles the employee time-in process.
     *
     * This controller records the start of an employee’s workday.
     * It ensures that the employee has not already timed-in for the day,
     * then inserts a new attendance record with the time-in value.
     * @param {Object} req - Express request object containing session data.
     * @param {Object} res - Express response object used to send JSON.
     * @returns {Object} JSON response:
     *  - { success: true, message: string } on success.
     *  - { success: false, message: string } on failure.
     *
     * created by: Rogendher Keith Lachica
     * updated at: September 24, 2025 10:45 PM
     */
    static async employeetimeIn(req, res){
        const user = req.session.user;

        if(!user){
            throw new Error("No User Found");
        }

        try{
            const employee_id = user.employee_id;
            const latest_timein_record = await AttendanceModel.checkEmployeeLatestTimeIn(employee_id);

            if(!latest_timein_record.status || latest_timein_record.error){
                throw new Error(latest_timein_record.error);
            }

            const insert_employee_attendance_record = await AttendanceModel.insertEmployeeTimeInAttendance({ employee_id});

            if(!insert_employee_attendance_record.status || insert_employee_attendance_record.error){
                throw new Error(insert_employee_attendance_record.error);
            }

            await connection.commit();
            return res.json( { success: true, message: "Time IN recorded successfully" });
        } 
        catch(error){
            return res.json({ success: false, message: error.message || "Server error attendance in controller" });
        }
        finally{
            connection.release();
        }
    }

    /**
     * Handles the employee time-out process.
     *
     * This controller finalizes an employee's daily attendance by recording their time-out, 
     * computing total work hours, and updating leave credits accordingly.
     *
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response:
     *  - { success: true, message: string, time_out, work_hour, earned_credit, deducted_credit, latest_credit }
     *  - { success: false, message: string } on failure.
     *
     * created by: Rogendher Keith Lachica
     * updated at: September 24, 2025 11:30 PM
     */
    static async updateEmployeeTimeOut(req, res){
        const user = req.session.user;
    
        if(!user){
            return res.json({ success: false, message: "User session not found." });
        }
    
        const connection = await database.getConnection();
    
        try{
            await connection.beginTransaction();
    
            const employee_id = user.employee_id;
            const attendance_type_id = ATTENDANCE_TYPE_ID.time_out;
    
            // Get the latest Time In record for the employee
            const latest_time_record = await AttendanceModel.checkEmployeeLatestTimeIn(employee_id);
            const active_record_time_in = latest_time_record.result;
    
            // Validate if a Time In record exists
            if(!latest_time_record.status || !active_record_time_in || latest_time_record.error){
                throw new Error(latest_time_record.error);
            }
    
            // Check if employee already timed out today
            const latest_timeout_record = await AttendanceModel.checkLatestEmployeeTimeOut(employee_id);

            if(!latest_timeout_record.status || latest_timeout_record.error){
                throw new Error(latest_timeout_record.error);
            }
    
            const id = active_record_time_in.id;
            const time_in = active_record_time_in.time_in;
    
            // Validate essential Time In data
            if(!id || !time_in){
                throw new Error("No Time In Found");
            }
    
            // Get current time for Time Out
            const time_out = TimeValidationHelper.checkEmployeeCurrentTime();
    
            // Calculate work hours between Time In and Time Out
            const work_hour = TimeValidationHelper.calculateEmployeeWorkHour(time_in, time_out);
    
            // Validate Time Out based on business rules
            const validation_check_time = WorkTimeValidationHelper.validateEmployeeTimeOut({ id, time_out, work_hour });

            if(!validation_check_time.is_valid){
                throw new Error("Failed to Time Out in controller");
            }
    
            // Update attendance record with Time Out and work hours
            const update_attendance_record = await AttendanceModel.updateEmployeeTimeOutAttendance({ id, time_out, work_hour, attendance_type_id, connection});

            if(!update_attendance_record.status || update_attendance_record.error){
                throw new Error(update_attendance_record.error);
            }
    
            // Fetch latest leave credit for employee
            const latest_credit_record = await LeaveCreditModel.getLatestEmployeeLeaveCredit(employee_id);
            const current_credit = latest_credit_record.latest_credit || NUMBER.zero;
    
            // Compute earned or deducted leave credits based on work hours
            const { earned_credit, deducted_credit, latest_credit } = TimeValidationHelper.computeLeaveCreditFromWorkHour(work_hour, current_credit);
            const update_latest_credit_record = await LeaveCreditModel.insertEmployeeLeaveCreditFromWorkHour({ employee_id, attendance_id: id, earned_credit, deducted_credit, current_credit, latest_credit, connection});
            
            if(!update_latest_credit_record.status || update_latest_credit_record.error){
                throw new Error(update_latest_credit_record.error);
            }
    
            await connection.commit();
            return res.json({ success: true, message: "Time out successfully", time_out, work_hour, earned_credit, deducted_credit, latest_credit});
        } 
        catch(error){
            await connection.rollback(); 
            return res.json({ success: false, message: error.message || "Server error admin in controller" });
        } 
        finally{
            connection.release();
        }
    }
    
    
    

    /**
     * Retrieves the logged-in employee's attendance records.
     * @param {Object} req - Express request object with session info.
     * @param {Object} res - Express response object used to send JSON.
     * @returns {Object} JSON response with either records or error message.
     *
     * created by: Rogendher Keith Lachica
     * updated at: September 26, 2025 11:45 AM
     */
    static async employeeRecord(req, res){
        const user = req.session.user;

        if(!user){
            throw new Error("No User Found");
        }

        try{
            const employee_id = user.employee_id;
            const employee_record = await AttendanceModel.getAllTimeInAndTimeOutByEmployeeId(employee_id);

            if(!employee_record.status || employee_record.error){
                throw new Error(employee_record.error);
            }

            return res.json({ success: true, records: employee_record.result });
        } 
        catch(error){
            return res.json({ success: false, message: error.message || "Server error admin in controller" });
        }
    }

    /**
     * Retrieves attendance records for all employees.
     * @param {Object} req - Express request object with session info.
     * @param {Object} res - Express response object for sending JSON.
     * @returns {Object} JSON response with employee attendance records or error.
     *
     * created by: Rogendher Keith Lachica
     * updated at: September 26, 2025 11:55 AM
     */
    static async allEmployeesAttendanceRecord(req, res){
        const user = req.session.user;

        if(!user){
           throw new Error("User Not Found");
        }

        try{
            const attendance_record = await AttendanceModel.getAllEmployeeTimeInAndTimeOut();

            if(!attendance_record.status || attendance_record.error){
                throw new Error(attendance_record.error);
            }

            return res.json({ success: true, result: attendance_record.result });
        } 
        catch(error){
            return res.json({ success: false, message: error.message || "Server error admin in controller" });
        }
    }
}

export default AttendanceControllers;
