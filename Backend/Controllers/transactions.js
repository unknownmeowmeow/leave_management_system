import LeaveTypeModel from "../Models/leave_type.js";
import LeaveTransactionModel from "../Models/leave_transaction.js";
import database from "../Configs/database.js";
import { APPROVED_LEAVE_STATUS } from "../Constant/constants.js";
import LeaveCreditModel from "../Models/leave_credit.js";
import { getUserFromSession } from "../Helpers/validation_session.js";

class AdminLeaveController {
    constructor(){
        this.leaveTypeModel = LeaveTypeModel;
        this.leaveTransactionModel = LeaveTransactionModel;
        this.leaveCreditModel = LeaveCreditModel;
        this.db = database;
    }

    /**
     * Fetches all leave transactions across all employees.
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with all leave transactions
     * Last Updated At: October 14, 2025
     * @author Keith
     */
    async getAllEmployeeTransaction(req, res){
        try{
            const employee_leave_record = await this.leaveTransactionModel.getAllEmployeeLeave();
            
            if(employee_leave_record.status){
                throw new Error(employee_leave_record.error || "No leave transactions found.");     
            }   

            return res.json({ status: true, result: employee_leave_record.result });
        } 
        catch(error){
            return res.json({ status: false, result: error.message});
        }
    }

    /**
     * Fetches leave transactions for the currently logged-in employee.
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with the employee's leave transactions
     * Last Updated At: October 14, 2025
     * @author Keith
     */
    async employeeLeaveTransaction(req, res){

       try{
            const user = getUserFromSession(req);
            const leave_transaction_record = await this.leaveTransactionModel.getEmployeeTransaction(user.employee_id);

            if(!leave_transaction_record.status){
                throw new Error(leave_transaction_record.error);
            }

            return res.json({ status: true, result: leave_transaction_record.result });
       } 
       catch(error){
            return res.json({ status: false, result: error.message});
       }
    }
    
    /**
     * Updates the status of a leave transaction.
     * If approved, deducts leave credits accordingly.
     * @param {Object} req - Express request object containing leave_id and status_id
     * @param {Object} res - Express response object
     * @returns {Object} JSON response indicating success or failure
     * Last Updated At: October 14, 2025
     * @author Keith
     */
    async updateLeaveTransaction(req, res) {
        const { leave_id, status_id } = req.body;
        const user = getUserFromSession(req);
    
        /* Validate request body to ensure leave_id and status_id are provided */
        if(!leave_id || !status_id){
            throw new Error({ status: false, result: "Leave ID or status ID missing" });
        }
    
        const connection = await this.db.getConnection();
    
        try{
            await connection.beginTransaction();
    
            /* Fetch the leave transaction record by leave_id */
            const employee_leave_transaction_record = await this.leaveTransactionModel.getLeaveTransactionId(leave_id);
            
            if(!employee_leave_transaction_record.status){
                throw new Error(employee_leave_transaction_record.error);
            }
    
            const { employee_id, leave_type_id, total_leave } = employee_leave_transaction_record.result;
    
            /* Update the status of the leave transaction */
            const update_status_record = await this.leaveTransactionModel.updateLeaveStatus({leave_id, status_id, approver_id: user.employee_id, connection});
            
            if(!update_status_record.status){
                throw new Error(update_status_record.error);
            }
    
            /* If leave is approved, process leave credit deduction */
            if(Number(status_id) === APPROVED_LEAVE_STATUS){

                /* Fetch total earned leave credit for the employee for this leave type */
                const employee_total_credit_record = await this.leaveCreditModel.getEmployeeCredit( employee_id, leave_type_id );
                
                if(!employee_total_credit_record.status){
                    throw new Error(employee_total_credit_record.error);
                }
    
                const available_earned_credit = Number(employee_total_credit_record.result.total_earned_credit);
    
                /* Check if available credit is enough to cover the leave */
                if(available_earned_credit < total_leave){
                    throw new Error(`Insufficient earned credit. Available: ${available_earned_credit} days, required: ${total_leave} days`);
                }
    
                /* Get the latest leave credit record for deduction */
                const latest_employee_credit_record = await this.leaveCreditModel.getEmployeeLatestCredit({employee_id,leave_type_id,required_credit: total_leave});
        
                if(!latest_employee_credit_record.status){
                    throw new Error(latest_employee_credit_record.error);
                }
    
                /* Deduct the leave from the employee's leave credit */
                const deduction_credit_record = await this.leaveCreditModel.leaveDeductedCredit({ credit_id:latest_employee_credit_record.result.id, total_leave, connection});
                
                if(!deduction_credit_record.status){
                    throw new Error(deduction_credit_record.error);
                }
            }
    
            await connection.commit();
            return res.json({ status: true, result: update_status_record.result });
        } 
        catch(error){
            await connection.rollback();
            return res.json({ status: false, result: error.message});
        } 
        finally{
            connection.release();
        }
    }

    
    
    /**
     * Retrieves all default employee leave transactions.
     * 
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response containing all default employee leave records.
     * @lastUpdated October 14, 2025
     * @author Keith
     */
    async allDefaultEmployeeTransaction(req, res){
        
        try{
            const employee_leave_record = await this.leaveTransactionModel.getAllDefaultLeaveTransaction();
        
            if(!employee_leave_record.status){
                throw new Error(employee_leave_record.error);
            }
    
            return res.json({ status: true, result: employee_leave_record.result });  
        } 
        catch(error){
            return res.json({ status: false, result: error.message});
        }
    }

    /**
     * Retrieves all rewarded leave transactions for employees.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response containing all rewarded employee leave records.
     * @lastUpdated October 14, 2025
     * @author Keith
     */
    async allEmployeeRewardedLeaveTransaction(req, res){
        try {
            const employee_leave_record = await this.leaveTransactionModel.getAllRewardedEmployeeLeaveTransaction();
        
            if(!employee_leave_record.status){
                throw new Error(employee_leave_record.error);
            }

            return res.json({ status: true, result: employee_leave_record.result }); 
        } 
        catch(error){
            return res.json({ status: false, result: error.message});
        } 
    }
}

export default new AdminLeaveController();
