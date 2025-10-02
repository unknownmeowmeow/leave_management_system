import TimeValidationHelper from "../Helpers/time_validation_helper.js";
import EmployeeModel from "../Models/employee.js";
import LeaveTransactionModel from "../Models/leave_transaction.js";
import LeaveCreditModel from "../Models/leave_credit.js";
import LeaveTypeModel from "../Models/leave_type.js";
import ValidationHelper from "../Helpers/validation_helper.js";
import { NUMBER } from "../Constant/constants.js";

class LeaveController{

 /**
     * Applies a leave request for an employee.
     *
     * Workflow:
     * 1. **Check Admin Session**
     *    - Verifies that `req.session.user` exists and has a valid `employee_id`.
     *    - If not → return:
     *      `{ success: false, message: "No admin session found." }`.
     *
     * 2. **Extract Request Data**
     *    - Retrieves `employee_id, leave_type, start_date, end_date, reason` from `req.body`.
     *    - If `employee_id` is missing → return:
     *      `{ success: false, message: "Please select an employee." }`.
     *
     * 3. **Validate Leave Type**
     *    - Calls `LeaveTypeModel.getLeaveTypeById(leave_type)` to confirm validity.
     *    - If invalid → return:
     *      `{ success: false, message: "This leave type is invalid or cannot be carried over." }`.
     *
     * 4. **Validate Date Range**
     *    - Runs `ValidationHelper.validateLeaveApplication()`.
     *    - If validation errors exist → return the first error message.
     *    - Uses `TimeValidationHelper.validateLeaveApplication()` for duration, adjustments, and validity.
     *    - If invalid → return:
     *      `{ success: false, message }`.
     *
     * 5. **Check Employee Credits**
     *    - Calls `LeaveTransactionModel.getTotalCredit(employee_id)` to get available credits.
     *    - If no credits or insufficient credits → return:
     *      `{ success: false, message: "Insufficient leave credit." }`.
     *
     * 6. **Insert Leave Transaction**
     *    - Calls `LeaveTransactionModel.insertTransaction()` with leave details.
     *    - If insert fails → return:
     *      `{ success: false, message: "Error inserting leave transaction." }`.
     *
     * 7. **Return Success**
     *    - If everything passes → return:
     *      `{ success: true, message: "Leave successfully filed." }`.
     *
     * Error Handling:
     * - Any unexpected exceptions are caught and return:
     *   `{ success: false, message: "Error occurred while filing leave.", error: error.message }`.
     *
     * Example Response (Success):
     * {
     *   success: true,
     *   message: "Leave successfully filed."
     * }
     *
     * Example Response (Failure - insufficient credit):
     * {
     *   success: false,
     *   message: "Insufficient leave credit. Available: 2 days."
     * }
     *
     * @param {Object} req - Express request object containing session and leave details.
     * @param {Object} res - Express response object for sending JSON results.
     * @returns {Object} JSON response indicating success or failure.
     *
     * created by: Rogendher Keith Lachica
     * updated at: September 26, 2025 01:15 PM
     */
    static async applyLeave(req, res){

        try{
            const admin = req.session.user;

            if(!admin || !admin.employee_id){
              throw new Error("No Session Found for Admin");
            }

            const rewarded_by_id = admin.employee_id;
            const { employee_id, leave_type, start_date, end_date, reason } = req.body;
            
            if(!employee_id){
              throw new Error("No Employee Found");
            }

            const leave_type_record = await LeaveTypeModel.getLeaveTypeById(leave_type);
            
            if(!leave_type_record.status || !leave_type_record.result){
                throw new Error(leave_type_record.error);
            }

            const leave_type_data = leave_type_record.result;
            const leave_validation = ValidationHelper.validateLeaveApplication({ leave_type, start_date, end_date});
            
            if(leave_validation.length){
                return res.json({ success: false, message: leave_validation[NUMBER.zero] });
            }

            const year = new Date().getFullYear();
            const { is_valid, message, duration, adjusted_end_date } = await TimeValidationHelper.validateLeaveApplication({ employee_id, leave_type_data, start_date, end_date, reason});
    
            if(!is_valid){
                return res.json({ success: false, message });
            }
            const check_credit_employee_record = await LeaveTransactionModel.getTotalCredit(employee_id);

            if(!check_credit_employee_record.status){
                throw new Error(check_credit_employee_record.error);
            }

            const available_credit = Number(check_credit_employee_record.result.total_latest_credit);
    
            if(available_credit <= NUMBER.zero){
                throw new Error(`No credit available: ${available_credit} for this days.`);
            }
    
            if(duration > available_credit){
               throw new Error(`Insufficient leave credit. Available: ${available_credit} days.`);
            }

            // const employee_latest_credit_data = await LeaveTransactionModel.getLatestCreditRecord(employee_id);
            
            // if(!employee_latest_credit_data.status){
            //    throw new Error("No Latest Credit Record Found");
            // }
    
            const leave_transaction_data = await LeaveTransactionModel.insertTransaction({
                employee_id,
                leave_type_id: leave_type,
                rewarded_by_id, 
                start_date,
                end_date: adjusted_end_date,
                reason,
                total_leave: duration,
                leave_transaction_status_id: NUMBER.one,
                is_weekend: NUMBER.zero,
                is_active: NUMBER.one,
                filed_date: new Date(),
                year
            });
    
            if(!leave_transaction_data.status || !leave_transaction_data.result.leave_id){
               throw new Error(leave_transaction_data.error);
            }
            return res.json({ success: true, message: "Leave successfully filed." });
    
        } 
        catch(error){
            return res.json({ success: false, message: error.message || "Server error register in controller" });
        } 
    }


/**
     * Allows an employee to file a leave request for themselves.
     *
     * Workflow:
     * 1. **Check Session**
     *    - Retrieves the logged-in employee from `req.session.user`.
     *    - Extracts `employee_id` for processing.
     *
     * 2. **Validate Leave Type**
     *    - Calls `LeaveTypeModel.getLeaveTypeById(leave_type)` to ensure the leave type is valid.
     *    - If invalid → return `{ success: false, message: "This leave type is invalid or cannot be carried over." }`.
     *
     * 3. **Validate Dates & Duration**
     *    - Uses `TimeValidationHelper.validateLeaveApplication()` to check validity of leave duration and adjust dates.
     *    - If invalid → return `{ success: false, message }`.
     *
     * 4. **Check Employee Leave Credits**
     *    - Calls `LeaveTransactionModel.getTotalCredit(employee_id)` to get total available credits.
     *    - If none available → return `{ success: false, message: "No credit available: 0 days." }`.
     *    - If insufficient → return `{ success: false, message: "Insufficient leave credit. Available: X days." }`.
     *
     * 5. **Insert Leave Transaction**
     *    - Calls `LeaveTransactionModel.insertTransaction()` to insert a new leave request.
     *    - Inserts with `rewarded_by_id = null` (since this is employee-initiated).
     *    - If insert fails → return `{ success: false, message: "Error inserting leave transaction in controller." }`.
     *
     * 6. **Return Success**
     *    - If successful → return `{ success: true, message: "Leave successfully filed in controller." }`.
     *
     * 7. **Error Handling**
     *    - Any unexpected errors caught by `try/catch` → return:
     *      `{ success: false, message: "Error occurred while filing leave in controller." }`.
     *
     * Example Response (Success):
     * {
     *   success: true,
     *   message: "Leave successfully filed in controller."
     * }
     *
     * Example Response (Failure - no credit):
     * {
     *   success: false,
     *   message: "No credit available: 0 days."
     * }
     *
     * Example Response (Failure - invalid leave type):
     * {
     *   success: false,
     *   message: "This leave type is invalid or cannot be carried over."
     * }
     *
     * @param {Object} req - Express request object containing session and body (leave details).
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response indicating success or failure.
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 01:35 PM
     */
    static async applyEmployeeLeave(req, res){

        try{
            const employee = req.session.user;
            const employee_id = employee.employee_id;
            const { leave_type, start_date, end_date, reason } = req.body;
            const leave_type_id_data = await LeaveTypeModel.getLeaveTypeById(leave_type);
            
            if(!leave_type_id_data.status || !leave_type_id_data.result){
                throw new Error(leave_type_id_data.error);
            }

            const leave_type_data = leave_type_id_data.result;
            const leave_validation = ValidationHelper.validateLeaveApplication({ leave_type, start_date, end_date});
            
            if(leave_validation.length){
                return res.json({ success: false, message: leave_validation[NUMBER.zero] });
            }

            const year = new Date().getFullYear();
            const { is_valid, message, duration, adjusted_end_date } = await TimeValidationHelper.validateLeaveApplication({employee_id, leave_type_data, start_date, end_date, reason});
    
            if(!is_valid){
                return res.json({ success: false, message });
            }

            const employee_credit_data = await LeaveTransactionModel.getTotalCredit(employee_id);

            if(!employee_credit_data.status){
                throw new Error(employee_credit_data.error)
            }
    
            const available_credit = Number(employee_credit_data.result.total_latest_credit);

            if(available_credit <= NUMBER.zero){
                throw new Error(`No credit available: ${available_credit} for this days.`);
            }
    
            if(duration > available_credit){
               throw new Error(`Insufficient leave credit. Available: ${available_credit} days.`);
            }
            
            const employee_transaction_data = await LeaveTransactionModel.insertTransaction({
                employee_id,
                leave_type_id: leave_type,
                rewarded_by_id: null,
                start_date,
                end_date: adjusted_end_date,
                reason,
                total_leave: duration,
                leave_transaction_status_id: NUMBER.one,
                is_weekend: NUMBER.zero,
                is_active: NUMBER.one,
                filed_date: new Date(),
                year
            });
    
            if(!employee_transaction_data.status || !employee_transaction_data.result.leave_id){
               throw new Error(employee_transaction_data.error);
            }

            return res.json({ success: true, message: "Leave successfully filed in controller." });
    
        } 
        catch(error){
            return res.json({ success: false, message: error.message || "Server error register in controller" });
        }
    }
               
    /**
     * Retrieves all employees and interns from the database.
     *
     * Workflow:
     * 1. **Fetch Data**
     *    - Calls `EmployeeModel.getAllEmployeeAndIntern()` to fetch a combined list of employees and interns.
     *
     * 2. **Return Response**
     *    - If the query succeeds → return the full response from the model.
     *    - If an error occurs → return `{ status: false, result: null, error: error.message }`.
     *
     * Example Response (Success):
     * {
     *   status: true,
     *   result: [
     *     { employee_id: 1, name: "John Doe", role: "Employee" },
     *     { employee_id: 2, name: "Jane Smith", role: "Intern" }
     *   ],
     *   error: null
     * }
     *
     * Example Response (Failure):
     * {
     *   status: false,
     *   result: null,
     *   error: "Database connection error"
     * }
     *
     * @param {Object} req - Express request object (not used in this method).
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response containing employees and interns or an error.
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 01:50 PM
     */
    static async getAllEmployeeAndIntern(req, res){

        try{
            const get_all_employee_intern_record = await EmployeeModel.getAllEmployeeAndIntern();
            return res.json(get_all_employee_intern_record);
        } 
        catch(error){
            return res.json({ status: false, result: null, error: error.message });
        }
    }

    /**
     * Retrieves the latest leave credit for the currently logged-in employee.
     *
     * Workflow:
     * 1. **Validate Session**
     *    - Ensures `req.session.user.employee_id` exists.
     *    - If not found → return:
     *      `{ success: false, message: "No Employee Session Found in Log out." }`.
     *
     * 2. **Fetch Latest Credit**
     *    - Calls `LeaveCreditModel.getLatestEmployeeLeaveCredited(employee_id)` to retrieve the employee’s latest leave credit.
     *    - If no credit record is found → return:
     *      `{ success: false, message: "No credit found in model" }`.
     *
     * 3. **Return Success**
     *    - On success, returns:
     *      `{ success: true, latest_credit: <Number> }` where `<Number>` is the parsed float value of the latest credit.
     *
     * 4. **Error Handling**
     *    - Any unexpected error → return:
     *      `{ success: false, message: "Failed to fetch leave credit." }`.
     *
     * Example Response (Success):
     * {
     *   success: true,
     *   latest_credit: 10.5
     * }
     *
     * Example Response (Failure - no session):
     * {
     *   success: false,
     *   message: "No Employee Session Found in Log out."
     * }
     *
     * Example Response (Failure - no credit record):
     * {
     *   success: false,
     *   message: "No credit found in model"
     * }
     *
     * @param {Object} req - Express request object containing employee session data.
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response with success status and latest leave credit (if available).
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 01:57 PM
     */
    static async getLatestCredit(req, res){

        try{
            const employee_id = req.session.user.employee_id;
    
            if(!employee_id){
                throw new Error("No user Found");
            }

            const employee_credit_record = await LeaveCreditModel.getLatestEmployeeLeaveCredited(employee_id);
    
            if(!employee_credit_record.status || !employee_credit_record.result){
                throw new Error(employee_credit_record.error);
            }

            return res.json({ success: true, latest_credit: parseFloat(employee_credit_record.result.latest_credit)});
        } 
        catch(error){
            return res.json({ success: false, message: error.message || "Server error register in controller" });
        }
    }
    
}

export default LeaveController;
