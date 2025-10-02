import LeaveTypeModel from "../Models/leave_type.js";
import LeaveTransactionModel from "../Models/leave_transaction.js";
import database from "../Configs/database.js";
import { NUMBER } from "../Constant/constants.js";

class AdminLeaveController{

    /**
     * Retrieves all leave transactions in the system.
     *
     * This controller is intended for administrators or HR staff 
     * who need to view every leave transaction across all employees.
     *
     * Workflow:
     * 1. **Fetch Leave Data**
     *    - Calls `LeaveTypeModel.getAllLeaves()` to retrieve all leave records.
     *
     * 2. **Validate Retrieval**
     *    - If query fails (`status = false`) → return error with reason.
     *    - If successful → return the list of leave transactions.
     *
     * 3. **Response**
     *    - Success → `{ success: true, data: [...] }`
     *    - Failure → `{ success: false, message: string }`
     *
     * 
     *
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object used to send JSON.
     * @returns {Object} JSON response:
     *  - { success: true, data: Array } on success.
     *  - { success: false, message: string } on failure.
     *
     * created by: Rogendher Keith Lachica
     * updated at: September 26, 2025 10:15 AM
     */
    static async getAllEmployeeTransaction(req, res){

        try{
            const leave_data = await LeaveTypeModel.getAllEmployeeLeaveTransaction();

            if(!leave_data.status){
               throw new Error("No leave transaction found");
            }

            return res.json({ success: true, data: leave_data.result });
        } 
        catch(error){
            return res.json({ success: false, message: "failed to view all in controllers."});
        }
    }

    /**
     * Retrieves all leave transactions for the logged-in employee.
     *
     * This controller returns every leave transaction record associated 
     * with the employee currently logged into the session.
     *
     * Workflow:
     * 1. **Session Validation**
     *    - Ensures that a valid user session exists.
     *    - If no session → return error response.
     *
     * 2. **Extract Employee ID**
     *    - Retrieves the employee ID from the session user object.
     *
     * 3. **Fetch Leave Transactions**
     *    - Calls `LeaveTypeModel.getAllLeave(employee_id)` to retrieve all 
     *      leave records for the employee.
     *
     * 4. **Validate Retrieval**
     *    - If query fails (`status = false`) → return error with reason.
     *    - If successful → return list of leave transactions.
     *
     * 5. **Response**
     *    - Success → `{ success: true, data: [...] }`
     *    - Failure → `{ success: false, message: string }`
     *
     * 
     *
     * @param {Object} req - Express request object containing session user data.
     * @param {Object} res - Express response object used to send JSON.
     * @returns {Object} JSON response:
     *  - { success: true, data: Array } on success.
     *  - { success: false, message: string } on failure.
     *
     * created by: Rogendher Keith Lachica
     * updated at: September 26, 2025 9:30 AM
     */
    static async getAllLeaveTransactionByEmployee(req, res){
        const user = req.session.user;

        if(!user){
            return res.json({ success: false, message: "User session not found in controllers." });
        }

        const employee_id = user.employee_id;

        try{
            const leave_transaction_record = await LeaveTypeModel.getAllLeaveTransactionByEmployeeId(employee_id);

            if(!leave_transaction_record.status){
                throw new Error("No leave Transaction Found");
            }

            return res.json({ success: true, data: leave_transaction_record.result });
        } 
        catch(error){
            return res.json({ success: false, message: error.message || "Server error attendance in controller" });
        }
    }
    
    /**
     * Updates the status of a specific leave transaction.
     *
     * This controller is responsible for changing the approval/denial status 
     * of an employee's leave request. It supports transactional safety by 
     * ensuring that credit deduction and status updates are atomic operations.
     *
     * Workflow:
     * 1. Validate session user and required request fields (leave_id, status_id).
     * 2. Begin a database transaction to ensure atomicity.
     * 3. Fetch the leave transaction details using `leave_id`.
     *    - If not found or an error occurs, rollback and return an error.
     * 4. If `status_id` equals `NUMBER.two` (commonly "Approved"):
     *    - Fetch the employee’s total available leave credit.
     *    - Ensure the employee has sufficient credits:
     *      - If no credits or insufficient credits, rollback and return an error.
     *    - Fetch the latest leave credit record.
     *    - Deduct the required leave days from the latest credit record.
     *      - If deduction fails, rollback and return an error.
     * 5. Update the leave transaction status with the approver’s (session user’s) ID.
     *    - If the update fails, rollback and return an error.
     * 6. Commit the transaction if all steps succeed.
     * 7. Always release the connection (whether success, failure, or error).
     *
     * Example cases:
     * - **Pending → Approved**: Checks credits, deducts balance, then updates status.
     * - **Pending → Rejected**: Simply updates status without affecting credits.
     * - **Invalid session or missing fields**: Returns error immediately.
     *
     * @param {Object} req - Express request object containing:
     *   @param {number} req.body.leave_id - ID of the leave transaction to update.
     *   @param {number} req.body.status_id - New status ID (e.g., approved/rejected).
     *   @param {Object} req.session.user - Logged-in user session data.
     * @param {Object} res - Express response object used to return JSON.
     * 
     * @returns {Object} JSON response:
     * - { success: true, data: Object } → On successful status update.
     * - { success: false, message: string } → On validation failure, insufficient credit, or DB error.
     *
     * Transactional Safety:
     * - Uses MySQL transaction (BEGIN, COMMIT, ROLLBACK).
     * - Ensures credits are only deducted if status update succeeds.
     * - Prevents partial updates that could corrupt data.
     *
     * Created by: Rogendher Keith Lachica
     * Updated at: September 26, 2025 8:55 AM
     */
    static async updateLeaveStatus(req, res){
        const { leave_id, status_id } = req.body;
        const user = req.session.user;

        if(!user){
            throw new Error("No User Found");
        }

        if(!leave_id || !status_id){
            throw new Error("No leave id found or status");
        }

        const connection = await database.getConnection();
    
        try{
            await connection.beginTransaction();
            const employee_leave_transaction_record = await LeaveTransactionModel.getLeaveTransactionById(leave_id);
          
            if(!employee_leave_transaction_record.status){
                throw new Error("No Transaction Found");
            }

            const employee_id = employee_leave_transaction_record.result.employee_id;
            const total_leave = Number(employee_leave_transaction_record.result.total_leave);

            if(Number(status_id) === NUMBER.two){
                const employee_total_credit_record = await LeaveTransactionModel.getTotalCredit(employee_id);

                if(!employee_total_credit_record.status){
                   throw new Error("No Employee Credit Found");
                }

                const available_credit = Number(employee_total_credit_record.result.total_latest_credit);
          
                if(available_credit <= NUMBER.zero || available_credit < total_leave){
                    throw new Error(`No credit available: ${available_credit} days.`)
                }

                const latest_employee_credit_record = await LeaveTransactionModel.getLatestCreditRecord(employee_id);
               
                if(!latest_employee_credit_record.status){
                    throw new Error("No Latest Credit Record Found");
                }

                const deduction_credit_record = await LeaveTransactionModel.deductCredit(latest_employee_credit_record.result.id, total_leave, connection);
          
                if(!deduction_credit_record.status){
                    throw new Error("Failed to Deduct Credit Record");
                }
            }

            const update_status_record = await LeaveTransactionModel.updateStatus(leave_id, status_id, user.employee_id, connection);
            await connection.commit();
            return res.json({ success: true, data: update_status_record.result });
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
     * Retrieves all leave transactions for the logged-in employee.
     *
     * This controller provides employees with their complete leave records 
     * (approved, pending, rejected, etc.) by querying the `LeaveTypeModel`.
     *
     * Workflow:
     * 1. **Session Validation**
     *    - Ensures a valid user session exists.
     *    - If no session, returns an error response.
     *
     * 2. **Fetch Employee Leave Records**
     *    - Calls `LeaveTypeModel.getAllByEmployeeRecordLeaves(employee_id)` 
     *      to retrieve all leave transactions for the logged-in employee.
     *
     * 3. **Validate Retrieval**
     *    - If retrieval fails (status = false), returns error response with reason.
     *    - If successful, returns the list of leave transactions.
     *
     * 4. **Response**
     *    - On success: returns JSON with `{ success: true, data: [...] }`.
     *    - On failure: returns JSON with `{ success: false, message: string }`.
     *
     * @param {Object} req - Express request object containing session data.
     * @param {Object} res - Express response object used to send JSON.
     * @returns {Object} JSON response:
     *  - { success: true, data: Array } on success.
     *  - { success: false, message: string } on failure.
     *
     * created by: Rogendher Keith Lachica
     * updated at: September 26, 2025 9:20 AM
     */
    static async getAllEmployeeLeaveTransaction(req, res){
        const user = req.session.user;

        if(!user){
            throw new Error("No User Found");
        }
        
        try{
            const employee_leave_data = await LeaveTypeModel.getAllByEmployeeRecordLeaves();

            if(!employee_leave_data.status){
                throw new Error("No Leave Transaction Found in controller");
            }

            return res.json({ success: true, data: employee_leave_data.result });
        } 
        catch(error){
            return res.json({ success: false, message: error.message || "Server error admin in controller" });
        }
    }
}

export default AdminLeaveController;
