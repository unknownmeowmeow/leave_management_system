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
     *
     * Workflow:
     * 1. **Session Validation**
     *    - Confirms a valid user session exists.
     *    - If missing, returns an error immediately.
     *
     * 2. **Database Transaction Start**
     *    - Begins a transaction to ensure data consistency.
     *
     * 3. **Check Existing Time-In**
     *    - Calls `AttendanceModel.checkEmployeeLatestTimeIn(employee_id)` to verify 
     *      if the employee already has a time-in today.
     *    - If yes → rollback and return error (`"Already time in today."`).
     *
     * 4. **Insert Time-In Record**
     *    - Calls `AttendanceModel.insertEmployeeTimeInAttendance({ employee_id, connection })`
     *      to insert a new attendance record for today.
     *    - If insertion fails → rollback and return error.
     *
     * 5. **Commit Transaction**
     *    - Commits the transaction if all steps succeed.
     *
     * 6. **Return Response**
     *    - On success: returns JSON with `{ success: true, message: "Time IN recorded successfully" }`.
     *    - On failure: returns JSON with `{ success: false, message: string }`.
     *
     * Transactional Safety:
     * - Ensures attendance is either fully inserted or not inserted at all (no partial updates).
     *
     * Example Response (Success):
     * {
     *   success: true,
     *   message: "Time IN recorded successfully"
     * }
     *
     * Example Response (Failure):
     * {
     *   success: false,
     *   message: "Already time in today."
     * }
     *
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

        const connection = await database.getConnection();

        try{
            await connection.beginTransaction();
            const employee_id = user.employee_id;
            const check_time_in = await AttendanceModel.checkEmployeeLatestTimeIn(employee_id);

            if(check_time_in.status && check_time_in.result){
                throw new Error("Already Time in to this day");
            }

            const insert_employee_attendance_record = await AttendanceModel.insertEmployeeTimeInAttendance({ employee_id});

            if(!insert_employee_attendance_record.status){
                throw new Error("Insert Time In Failed");
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
     * Workflow:
     * 1. **Session Validation**
     *    - Ensures that a user session exists.
     *    - If missing, returns an error response.
     *
     * 2. **Database Transaction Start**
     *    - Opens a DB transaction to ensure all operations (attendance update + leave credit update) 
     *      succeed together or fail together.
     *
     * 3. **Fetch Latest Active Time-In Record**
     *    - Retrieves the employee’s latest active time-in record for today.
     *    - If no active record is found → rollback and return error.
     *
     * 4. **Check if Already Timed-Out**
     *    - Ensures that the employee has not already recorded a time-out today.
     *    - If already timed-out → rollback and return error.
     *
     * 5. **Validate Time-In Data**
     *    - Confirms that both the attendance record ID and time-in value are present.
     *    - If invalid/missing → rollback and return error.
     *
     * 6. **Generate Time-Out & Calculate Work Hours**
     *    - Uses `TimeValidationHelper.checkEmployeeCurrentTime()` to get the current time-out.
     *    - Uses `TimeValidationHelper.calculateEmployeeWorkHour()` to compute total worked hours.
     *
     * 7. **Validate Time-Out Data**
     *    - Calls `WorkTimeValidationHelper.validateEmployeeTimeOut()` to check business rules (e.g. 
     *      valid duration, not too short/long, etc.).
     *    - If validation fails → rollback and return error.
     *
     * 8. **Update Attendance Record**
     *    - Calls `AttendanceModel.updateEmployeeTimeOutAttendance()` to save the time-out and 
     *      calculated work hours in the attendance table.
     *    - If update fails → rollback and return error.
     *
     * 9. **Leave Credit Computation**
     *    - Retrieves the employee’s latest leave credit balance using 
     *      `LeaveCreditModel.getLatestEmployeeLeaveCredited()`.
     *    - Computes earned or deducted credits based on work hours via 
     *      `TimeValidationHelper.computeLeaveCreditFromWorkHour()`.
     *    - Inserts new leave credit entry using `LeaveCreditModel.insertLeaveCreditFromWorkHour()`.
     *    - If insertion fails → rollback and return error.
     *
     * 10. **Commit Transaction**
     *    - If all operations succeed, commits the transaction.
     *
     * 11. **Response**
     *    - Returns a success response with details (time_out, work_hour, earned/deducted credits, balance).
     *
     * Transactional Safety:
     * - Ensures no partial updates (e.g., prevents attendance being updated without leave credit adjustments).
     *
     * Example Response (Success):
     * {
     *   success: true,
     *   message: "Time out successfully",
     *   time_out: "2025-09-24T23:59:59",
     *   work_hour: 8,
     *   earned_credit: 0.25,
     *   deducted_credit: 0,
     *   latest_credit: 10.25
     * }
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
    static async employeetimeOut(req, res){
        const user = req.session.user;
    
        if(!user){
            return res.json({ success: false, message: "User session not found." });
        }

        const connection = await database.getConnection();
    
        try{
            await connection.beginTransaction();
            const employee_id = user.employee_id;
            const attendance_type_id = ATTENDANCE_TYPE_ID.time_out;
            const record = await AttendanceModel.checkEmployeeLatestTimeIn(employee_id);
            const active_record_time_in = record.result;
    
            if(!record.status || !active_record_time_in){
                throw new Error("No Record for time In");
            }

            const check_time_out = await AttendanceModel.checkLatestEmployeeTimeOut(employee_id);
            
            if(check_time_out.status && check_time_out.result){
                throw new Error("Already Time Out this day");
            }

            const id = active_record_time_in.id;
            const time_in = active_record_time_in.time_in;
    
            if(!id || !time_in){
                throw new Error("No Time In Found");
            }

            const time_out = TimeValidationHelper.checkEmployeeCurrentTime();
            const work_hour = TimeValidationHelper.calculateEmployeeWorkHour(time_in, time_out);
            const validation_check_time = WorkTimeValidationHelper.validateEmployeeTimeOut({ id, time_out, work_hour });

            if(!validation_check_time.is_valid){
                throw new Error("Failed to Time Out in controller");
            }

            const update_attendance = await AttendanceModel.updateEmployeeTimeOutAttendance({ id, time_out, work_hour, attendance_type_id, connection});
    
            if(!update_attendance.status){
                await connection.rollback();
                return res.json({ success: false, message: update_attendance.error });
            }
            const latest_credit_result = await LeaveCreditModel.getLatestEmployeeLeaveCredited(employee_id);
            const current_credit = latest_credit_result.latest_credit || NUMBER.zero;
            const { earned_credit, deducted_credit, latest_credit } = TimeValidationHelper.computeLeaveCreditFromWorkHour(work_hour, current_credit);
            const update_credit = await LeaveCreditModel.insertLeaveCreditFromWorkHour({ employee_id, attendance_id: id, earned_credit, deducted_credit, current_credit, latest_credit, connection});
    
            if(!update_credit.status){
                throw new Error("Failed to insert credit in controller");
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
     *
     * Workflow:
     * 1. **Verify Session**
     *    - Ensures that a valid `req.session.user` exists.
     *    - If not found → return `{ success: false, message: "User session not found." }`.
     *
     * 2. **Fetch Records**
     *    - Uses `AttendanceModel.getAllEmployeesRecord(employee_id)` 
     *      to retrieve all attendance logs for the given employee.
     *
     * 3. **Validate Response**
     *    - If `response_data.error` exists → return failure response.
     *    - Else return `{ success: true, records: [...] }`.
     *
     * 4. **Error Handling**
     *    - Any thrown errors are caught and return 
     *      `{ success: false, message: "Error in Catch in Get All Record" }`.
     *
     * Example Response (Success):
     * {
     *   success: true,
     *   records: [
     *     { id: 1, employee_id: 1001, time_in: "2025-09-25T08:00:00", time_out: "2025-09-25T17:00:00", work_hour: 8 },
     *     { id: 2, employee_id: 1001, time_in: "2025-09-26T08:05:00", time_out: "2025-09-26T17:10:00", work_hour: 8.1 }
     *   ]
     * }
     *
     * Example Response (Failure - no session):
     * {
     *   success: false,
     *   message: "User session not found."
     * }
     *
     * Example Response (Failure - DB error):
     * {
     *   success: false,
     *   message: "Database connection error"
     * }
     *
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
            const employee_record = await AttendanceModel.getAllEmployeesRecord(employee_id);

            if(employee_record.error){
                throw new Error("No Employee Found");
            }

            return res.json({ success: true, records: employee_record.result });
        } 
        catch(error){
            return res.json({ success: false, message: error.message || "Server error admin in controller" });
        }
    }

    /**
     * Retrieves attendance records for all employees.
     *
     * Workflow:
     * 1. **Verify Session**
     *    - Ensures `req.session.user` exists.
     *    - If missing → returns `{ success: false, message: "User session not found." }`.
     *
     * 2. **Fetch All Records**
     *    - Calls `AttendanceModel.getAllEmployeesRecords()` to fetch records across employees.
     *
     * 3. **Validate Response**
     *    - If `response_data.error` is present → return failure response.
     *    - Else → return `{ success: true, records: [...] }`.
     *
     * 4. **Error Handling**
     *    - Any runtime errors are caught and return 
     *      `{ success: false, message: "Error in Catch in Get All Record" }`.
     *
     * Example Response (Success):
     * {
     *   success: true,
     *   records: [
     *     { employee_id: 1001, name: "Juan Dela Cruz", time_in: "2025-09-25T08:00:00", time_out: "2025-09-25T17:00:00", work_hour: 8 },
     *     { employee_id: 1002, name: "Maria Santos", time_in: "2025-09-25T09:00:00", time_out: "2025-09-25T18:00:00", work_hour: 8 }
     *   ]
     * }
     *
     * Example Response (Failure - no session):
     * {
     *   success: false,
     *   message: "User session not found."
     * }
     *
     * Example Response (Failure - DB error):
     * {
     *   success: false,
     *   message: "Database connection error"
     * }
     *
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
            const attendance_record = await AttendanceModel.getAllEmployeesRecords();

            if(attendance_record.error){
                throw new Error("Attendance No Record Found");
            }

            return res.json({ success: true, records: attendance_record.result });
        } 
        catch(error){
            return res.json({ success: false, message: error.message || "Server error admin in controller" });
        }
    }

}

export default AttendanceControllers;
