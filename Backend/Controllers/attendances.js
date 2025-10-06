import timeValidation from "../helpers/time_validation_helper.js";
import leaveCredit from "../models/leave_credit.js";   
import workValidation from "../helpers/work_time_validation_helper.js";
import database from "../config/database.js";
import { ATTENDANCE_TYPE_ID, NUMBER } from "../constant/constants.js";
import AttendanceModel from "../models/attendance.js";

class Attendance{

    /**
     * Handles the employee time-in process.
     * @param {Object} req - Express request object containing session data.
     * @param {Object} res - Express response object used to send JSON.
     * @returns {Object} JSON response:
     * created by: Rogendher Keith Lachica
     * updated at: September 24, 2025 10:45 PM
     */
    static async employeetimeIn(req, res) {
        try {    
            const employee_id = req.session.user;
            const latest_timein_record = await AttendanceModel.checkEmployeeLatestTimeIn(employee_id);
            
            if (latest_timein_record.status) {
                throw new Error("Already timed in today");
            }
    
            // Insert new time in record
            const insert_employee_attendance_record = await AttendanceModel.insertEmployeeTimeInAttendance(employee_id);
    
            if(!insert_employee_attendance_record.status || insert_employee_attendance_record.error){
                throw new Error(insert_employee_attendance_record.error || "Failed to insert time in");
            }
    
            return res.json({ success: true, message: "Time IN recorded successfully" });
        } 
        catch(error){
            return res.json({ success: false, message: error.message || "Server error attendance in controller" });
        }
    }
    

    /**
     * Handles the employee time-out process.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response:
     * created by: Rogendher Keith Lachica
     * updated at: September 24, 2025 11:30 PM
     */
    static async updateEmployeeTimeOut(req, res){
        const connection = await database.getConnection();
    
        try{
            await connection.beginTransaction();
    
            const employee_id = req.session.user.employee_id;
            const attendance_type_id = ATTENDANCE_TYPE_ID.time_out;
    
            // Get the latest Time In record for the employee
            const latest_time_record = await AttendanceModel.checkEmployeeLatestTimeIn(employee_id);
            const active_record_time_in = latest_time_record.result;
    
            // Validate if a Time In record exists
            if(!latest_time_record.status){
                throw new Error("No Time In found for today");
            }
    
            // Check if employee already timed out today
            const latest_timeout_record = await AttendanceModel.checkLatestEmployeeTimeOut(employee_id);

            if(latest_timeout_record.status){
                throw new Error("Already time Out today");
            }
    
            const id = active_record_time_in.id;
            const time_in = active_record_time_in.time_in;
    
            // Validate essential Time In data
            if(!id || !time_in){
                throw new Error("No Time In Found");
            }
    
            // Get current time for Time Out
            const time_out = timeValidation.checkEmployeeCurrentTime();
    
            // Calculate work hours between Time In and Time Out
            const work_hour = timeValidation.calculateEmployeeWorkHour(time_in, time_out);
    
            // Validate Time Out based on business rules
            const validation_check_time = workValidation.validateEmployeeTimeOut({ id, time_out, work_hour });
            console.log("id:", id, "time_in:", time_in, "time_out:", time_out, "work_hour:", work_hour);
            console.log("Validation result:", validation_check_time);
            
            if(!validation_check_time.is_valid){
                throw new Error("Failed to Time Out in controller");
            }
    
            // Update attendance record with Time Out and work hours
            const update_attendance_record = await AttendanceModel.updateEmployeeTimeOutAttendance({ id, time_out, work_hour, attendance_type_id, connection});

            if(!update_attendance_record.status || update_attendance_record.error){
                throw new Error(update_attendance_record.error);
            }
    
            // Fetch latest leave credit for employee
            const latest_credit_record = await leaveCredit.getLatestEmployeeLeaveCredit(employee_id);
            const current_credit = latest_credit_record.latest_credit || NUMBER.zero;
    
            // Compute earned or deducted leave credits based on work hours
            const { earned_credit, deducted_credit, latest_credit } = timeValidation.computeLeaveCreditFromWorkHour(work_hour, current_credit);
            const update_latest_credit_record = await leaveCredit.insertEmployeeLeaveCreditFromWorkHour({ employee_id, attendance_id: id, earned_credit, deducted_credit, current_credit, latest_credit, connection});
            
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
     * created by: Rogendher Keith Lachica
     * updated at: September 26, 2025 11:45 AM
     */
    static async employeeRecord(req, res){
        const employee_id = req.session.user.employee_id;
        const employee_record = await AttendanceModel.getAllTimeInAndTimeOutByEmployeeId(employee_id);
        return res.json({ success: true, records: employee_record.result });
    }

    /**
     * Retrieves attendance records for all employees.
     * @param {Object} req - Express request object with session info.
     * @param {Object} res - Express response object for sending JSON.
     * @returns {Object} JSON response with employee attendance records or error.
     * created by: Rogendher Keith Lachica
     * updated at: September 26, 2025 11:55 AM
     */
    static async allEmployeesAttendanceRecord(req, res){
        const attendance_record = await AttendanceModel.getAllEmployeeTimeInAndTimeOut();
        return res.json({ success: true, result: attendance_record.result });
    }
}

export default Attendance;
