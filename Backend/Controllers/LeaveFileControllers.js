import {
    SUCCESS_LEAVE_FILE_CONTROLLERS,
    ERROR_IN_GET_EMPLOYEE,
    ERROR_IN_GET_EMPLOYEE_CREDIT_MODEL,
    ERROR_IN_INSERT_TRANSACTION
} from "../Constant/Constants.js";

import TimeValidationHelper from "../Helpers/TimeValidationHelper.js";
import EmployeeModel from "../Models/EmployeeModel.js";
import LeaveTransactionModel from "../Models/LeaveTransactionModel.js";
import LeaveCreditModel from "../Models/LeaveCreditModel.js";

class LeaveController {

    /**
     * Handles leave application for employees.
     *
     * @param {Object} req Express request object.
     * @param {Object} res Express response object.
     * @returns {Object} JSON response indicating success or failure of leave application.
     * created by: Rogendher Keith Lachica
     * updated at: September 26 2025 9:10 am
     */
    static async applyLeave(req, res) {

        try {
            const employee_id = req.session?.user?.employee_id;
            const { leave_type, start_date, end_date, reason } = req.body;
    
            const { is_valid, message, duration } = await TimeValidationHelper.validateLeaveApplication({
                employee_id,
                leave_type,
                start_date,
                end_date,
                reason
            });
    
            if(!is_valid){
                return res.json({ success: false, message });
            }
            const employee_response = await EmployeeModel.getById(employee_id);

            if(!employee_response.status || !employee_response.result){
                return res.json({ success: false, message: ERROR_IN_GET_EMPLOYEE });
            }
            const employee = employee_response.result;
            const role_type = employee.employee_role_type_id;
            const year = new Date().getFullYear();
            let credit_calculation = null;
    

            if(role_type === 3){
                const credit_response = await LeaveCreditModel.getLatestEmployeeLeaveCredit(employee_id);
                
                if(!credit_response.status || !credit_response.result){
                    return res.json({ success: false, message: ERROR_IN_GET_EMPLOYEE_CREDIT_MODEL });
                }
                const latest_credit = parseFloat(credit_response.result.latest_credit || 0);
    
                if(duration > latest_credit){
                    return res.json({
                        success: false,
                        message: `Insufficient leave credit. Available: ${latest_credit} days.`
                    });
                }
                credit_calculation = TimeValidationHelper.calculateDeductedCredit(duration, latest_credit);
            }
            const rewarded_by_id = req.user?.id || null;
    
            const transaction_response = await LeaveTransactionModel.insertTransaction({
                employee_id,
                leave_type_id: leave_type,
                rewarded_by_id,
                start_date,
                end_date,
                reason,
                total_leave: duration,
                leave_transaction_status_id: 2,
                is_weekend: 0,
                is_active: 1,
                filed_date: new Date(),
                year
            });
    
            if(!transaction_response.status || !transaction_response.result?.leave_id){
                return res.json({ success: false, message: ERROR_IN_INSERT_TRANSACTION });
            }
            const leave_transaction_id = transaction_response.result.leave_id;
    
        
            if(role_type === 3 && credit_calculation){
                const update_credit_response = await LeaveCreditModel.updateLatest_credit({
                    employee_id,
                    leave_transaction_id,
                    leave_type_id: leave_type,
                    used_credit: credit_calculation.used_credit,
                    latest_credit: credit_calculation.latest_credit,
                    current_credit: credit_calculation.current_credit,
                    deducted_credit: credit_calculation.deducted_credit,
                    created_at: new Date()
                });
    
                if(!update_credit_response.status){
                    return res.json({ success: false, message: "Failed to deduct credit" });
                }
            }
    
            return res.json(SUCCESS_LEAVE_FILE_CONTROLLERS);
    
        } 
        catch(error){
            return res.json({
                success: false,
                message: "Error occurred in leave filing.",
                error: error.message
            });
        }
    }
    

    /**
     * Retrieves all employees grouped by role.
     *
     * @param {Object} req Express request object.
     * @param {Object} res Express response object.
     * @returns {Object} JSON response with employees or error.
     * created by: Rogendher Keith Lachica
     * updated at: September 26 2025 9:15 am
     */
    static async getEmployeesByRole(req, res) {
        try{
            const response = await EmployeeModel.getAllEmployeeByRoleId();
            return res.json(response);
        } 
        catch(error){
            return res.json({ status: false, result: null, error: error.message });
        }
    }

    /**
     * Retrieves the latest leave credit of the logged-in employee.
     *
     * @param {Object} req Express request object.
     * @param {Object} res Express response object.
     * @returns {Object} JSON response with latest credit or error.
     * created by: Rogendher Keith Lachica
     * updated at: September 26 2025 9:20 am
     */
    static async getLatestCredit(req, res) {

        try{
            const employee_id = req.session?.user?.employee_id;
    
            if(!employee_id){
                return res.json({ success: false, message: "Employee not authenticated." });
            }
            const credit_response = await LeaveCreditModel.getLatestEmployeeLeaveCredit(employee_id);
    
            if(!credit_response.status || !credit_response.result){
                return res.json({ success: false, message: ERROR_IN_GET_EMPLOYEE_CREDIT_MODEL });
            }
    
            return res.json({ success: true, latest_credit: parseFloat(credit_response.result.latest_credit || 0) 
            });
    
        } 
        catch(error){
            return res.json({ success: false, message: "Failed to fetch leave credit.", error: error.message });
        }
    }
    
}

export default LeaveController;
