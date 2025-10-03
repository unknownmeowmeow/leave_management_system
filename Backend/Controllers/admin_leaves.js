import LeaveTypeModel from "../Models/leave_type.js";
import LeaveTransactionModel from "../Models/leave_transaction.js";
import database from "../Configs/database.js";
import { NUMBER, APPROVED_LEAVE_STATUS } from "../Constant/constants.js";

class AdminLeaveController{

    /**
     * Retrieves all leave transactions in the system.
     *
     * This controller is intended for administrators or HR staff 
     * who need to view every leave transaction across all employees.
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
            const employee_leave_record = await LeaveTypeModel.getAllEmployeeLeaveTransaction();

            if(!employee_leave_record.status || employee_leave_record.error){
               throw new Error(employee_leave_record.error);
            }

            return res.json({ success: true, data: employee_leave_record.result });
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

            if(!leave_transaction_record.status || leave_transaction_record.error){
                throw new Error(leave_transaction_record.error);
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
    
        /* Throw error if leave_id or status_id is missing */
        if(!leave_id || !status_id){
            throw new Error("No leave id found or status");
        }
    
        const connection = await database.getConnection();
        
        try{
            await connection.beginTransaction();
            const employee_leave_transaction_record = await LeaveTransactionModel.getLeaveTransactionById(leave_id);
                
            /* Throw error if record retrieval fails */
            if(!employee_leave_transaction_record.status || employee_leave_transaction_record.error){
                throw new Error(employee_leave_transaction_record.error);
            }
    
            /* Extract employee_id from the leave transaction record */
            const employee_id = employee_leave_transaction_record.result.employee_id;
    
            /* Extract total_leave from the leave transaction record */
            const total_leave = Number(employee_leave_transaction_record.result.total_leave);
    
            /* If the leave is approved, handle leave credit deduction */
            if(Number(status_id) === APPROVED_LEAVE_STATUS){
                const employee_total_credit_record = await LeaveTransactionModel.getTotalCredit(employee_id);
    
                /* Throw error if total credit retrieval fails */
                if(!employee_total_credit_record.status || employee_total_credit_record.error){
                   throw new Error(employee_total_credit_record.error);
                }
    
                /* Get available leave credit */
                const available_credit = Number(employee_total_credit_record.result.total_latest_credit);
              
                /* Throw error if available credit is insufficient */
                if(available_credit <= NUMBER.zero || available_credit < total_leave){
                    throw new Error(`No credit available: ${available_credit} days.`)
                }
    
                const latest_employee_credit_record = await LeaveTransactionModel.getLatestCreditRecord(employee_id);
                   
                /* Throw error if latest credit record retrieval fails */
                if(!latest_employee_credit_record.status || latest_employee_credit_record.error){
                    throw new Error(latest_employee_credit_record.error);
                }
    
                const deduction_credit_record = await LeaveTransactionModel.deductCredit(latest_employee_credit_record.result.id, total_leave, connection);
              
                /* Throw error if deduction fails */
                if(!deduction_credit_record.status || deduction_credit_record.error){
                    throw new Error(deduction_credit_record.error);
                }
            }
    
            /* Update the leave status in the database */
            const update_status_record = await LeaveTransactionModel.updateStatus(leave_id, status_id, user.employee_id, connection);
                
            /* Throw error if status update fails */
            if(!update_status_record.status || update_status_record.error){
                throw new Error(update_status_record.error);
            }

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
            const employee_leave_record = await LeaveTypeModel.getAllByEmployeeRecordLeaves();

            if(!employee_leave_record.status || employee_leave_record.error){
                throw new Error(employee_leave_record.error);
            }

            return res.json({ success: true, data: employee_leave_record.result });
        } 
        catch(error){
            return res.json({ success: false, message: error.message || "Server error admin in controller" });
        }
    }
}

export default AdminLeaveController;
