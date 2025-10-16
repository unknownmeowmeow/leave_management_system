import AttendanceModel from "../Models/attendance.js";
import TimeValidationHelper from "../Helpers/time_validation_helper.js";
import LeaveCreditModel from "../Models/leave_credit.js";   
import WorkTimeValidationHelper from "../Helpers/work_validation_helper.js";
import database from "../Configs/database.js";
import { ATTENDANCE_TYPE_ID, NUMBER } from "../Constant/constants.js";
import { getUserFromSession } from "../Helpers/validation_session.js";

class AttendanceControllers{
    constructor() {
        this.attendanceModel = AttendanceModel;
        this.leaveCreditModel = LeaveCreditModel;
        this.timeHelper = TimeValidationHelper;
        this.workTimeHelper = WorkTimeValidationHelper;
        this.db = database;
    }

    /**
     * Records employee Time IN for the current day.
     * Validates that the employee has not already timed in today.
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with success/failure message
     * Last Updated At: October 14, 2025
     * @author Keith
     */
    async employeeTimeIn(req, res){

        try{
            const user = getUserFromSession(req);
            const employee_id = user.employee_id;    
            const latest_timein_record = await this.attendanceModel.checkLatestTimeIn(user.employee_id);

            if(latest_timein_record.status){
                throw new Error("Already time in this day");
            }
            
            const update_time_in = { 
                employee_id, 
                attendance_type_id: ATTENDANCE_TYPE_ID.time_in,
                time_in: new Date()
            }; 

            const insert_employee_attendance_record = await this.attendanceModel.insertEmployeeTimeIn(update_time_in);

            if(!insert_employee_attendance_record.status){
                throw new Error(insert_employee_attendance_record.error);
            }

            return res.json({ status: true, result: insert_employee_attendance_record.result});
        } 
        catch(error){
            return res.json({ status: false, error: error.message});
        }
    }

    /**
     * Records employee Time OUT for the current day.
     * Validates the employee has a Time IN record and has not already timed out.
     * Calculates total work hours and updates the employee's Time OUT record.
     * Computes and updates leave credits based on work hours.
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with success/failure message and leave credit info
     * Last Updated At: October 14, 2025
     * @author Keith
     */
    async employeeTimeOut(req, res){
        const user = getUserFromSession(req);
        const employee_id = user.employee_id;
        const connection = await this.db.getConnection();
    
        try{
            await connection.beginTransaction();
    
            /* Fetch the latest Time In record for the employee */
            const latest_time_in = await this.attendanceModel.checkLatestTimeIn(employee_id);
            const active_time_in = latest_time_in.result;
           
            if(!latest_time_in.status){
                throw new Error(latest_time_in.error);
            }
    
            /* Check if employee has already timed out today */
            const latest_time_out = await this.attendanceModel.checkLatestTimeOut(employee_id);
    
            if(latest_time_out.status){
                throw new Error("Already time Out today");
            }
    
            const attendance_id = active_time_in.id;
            const time_in = active_time_in.time_in;
    
            if(!attendance_id || !time_in){
                throw new Error("No Time In Found");
            }
    
            /* Calculate current time out and total work hours */
            const time_out = this.timeHelper.checkEmployeeCurrentTime();
            let total_work_hours = this.timeHelper.calculateEmployeeWorkHour(time_in, time_out);
    
            /* Validate work hours before updating Time Out */
            const validation_check_time = this.workTimeHelper.validateEmployeeTimeOut({ id: attendance_id, time_out, work_hour: total_work_hours });
    
            if(!validation_check_time.status){
                throw new Error("Failed to Time Out");
            }

            const employee_time_out = {
                time_out: time_out, 
                work_hour: total_work_hours, 
                attendance_type_id: ATTENDANCE_TYPE_ID.time_out
            }
  
            /* Update employee Time Out record in the database */
            const update_attendance_record = await this.attendanceModel.updateEmployeeTimeOut(employee_time_out, attendance_id,  connection);

            if(!update_attendance_record.status){

                throw new Error(update_attendance_record.error);
            }
    
            /* Get the latest leave credit for the employee */
            const latest_credit_record = await this.leaveCreditModel.getLatestEmployeeCredit(employee_id);
            const current_credit = latest_credit_record.result || NUMBER.zero;
    
            /* Compute leave credit based on total work hours */
            const new_earned_credit = this.timeHelper.computeLeaveCredit(total_work_hours); 
            const { deducted_credit } = this.timeHelper.computeLeaveCredit(total_work_hours, current_credit);
            
            const latest_credit = current_credit + new_earned_credit - deducted_credit;
            let earned_credit = new_earned_credit; 
            

            const update_leave_credit = { 
                employee_id, 
                attendance_id, 
                earned_credit, 
                deducted_credit, 
                current_credit,
                latest_credit 
            }; 

            /* Update the employee's leave credit record */
            const update_latest_credit_record = await this.leaveCreditModel.updateEmployeeLeaveCredit(update_leave_credit, connection);
    
            if(!update_latest_credit_record.status){
                throw new Error(update_latest_credit_record.error);
            }
    
            await connection.commit();
            return res.json({ status: true, result: update_latest_credit_record.result});
        } 
        catch(error){
            await connection.rollback(); 
            return res.json({ status: false, error: error.message});
        } 
        finally{
            connection.release();
        }
    }
    
    /**
     * Retrieves all Time IN and Time OUT records for the logged-in employee.
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with attendance records
     * Last Updated At: October 14, 2025
     * @author Keith
     */
    async employeeAttendance(req, res){

        try{
            const user = getUserFromSession(req);
            const employee_record = await this.attendanceModel.getEmployeeAttendance(user.employee_id);
    
            if(!employee_record.status){
                throw new Error(employee_record.error);
            }

            return res.json({ status: true, result: employee_record.result });
        } 
        catch(error){
            return res.json({ status: false, error: error.message });
        }
    }

    /**
     * Retrieves all Time IN and Time OUT records for all employees.
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with all employees' attendance records
     * Last Updated At: October 10, 2025
     * @author Keith
     */
    async allEmployeeAttendance(req, res){
        
        try{
            const attendance_record = await this.attendanceModel.getAllEmployeeAttendance();
        
            if(!attendance_record.status){
                throw new Error(attendance_record.error);
            }
        
            return res.json({ status: true, result: attendance_record.result});
        } 
        catch(error){
            return res.json({ status: false, error: error.message });
        }
        
    }
}

export default new AttendanceControllers();