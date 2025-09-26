import LeaveTypeModel from "../Models/LeaveTypeModel.js";
import LeaveTransactionModel from "../Models/LeaveTransactionModel.js";
import { SESSION_USER_NOT_FOUND , ERROR_IN_LEAVE_CONTROLLER_ADMIN, ERROR_IN_STATUS_ID

 } from "../Constant/Constants.js";

class AdminLeaveController{

    /**
     * Retrieves all leave transactions of employees.
     *
     * @param {Object} req Express request object.
     * @param {Object} res Express response object.
     * @returns {Object} JSON response with leave transactions or error.
     * created by: Rogendher Keith Lachica
     * updated at: September 26 2025 8:50 am
     */
    static async getAllLeaveTransactions(req, res) {

        try{
            const leaves = await LeaveTypeModel.getAllLeaves();

            if(!leaves.status){
                return res.json({ success: false, message: leaves.error });
            }
            return res.json({ success: true, data: leaves.result });
        } 
        catch(error){
            return res.json(ERROR_IN_LEAVE_CONTROLLER_ADMIN);
        }
    }

    /**
     * Updates the status of a specific leave transaction.
     *
     * @param {Object} req Express request object.
     * @param {Object} res Express response object.
     * @returns {Object} JSON response with updated leave transaction or error.
     * created by: Rogendher Keith Lachica
     * updated at: September 26 2025 8:55 am
     */
    static async updateLeaveStatus(req, res){
        const { leave_id, status_id } = req.body;

        if(!leave_id || !status_id){
            return res.json(ERROR_IN_STATUS_ID);
        }

        try{
            const leave_transaction = await LeaveTransactionModel.getLeaveTransactionById(leave_id);

            if(!leave_transaction.status){
                return res.json({ success: false, message: leave_transaction.error });
            }
            const employee_id = leave_transaction.result.employee_id;
            const total_leave = leave_transaction.result.total_leave;
            const credit = await LeaveTransactionModel.checkLatestCredit(employee_id);

            if(!credit.status){
                return res.json({ success: false, message: credit.error });
            }

            if(Number(status_id) === 2){ 
                if(credit.result.latest_credit < total_leave){
                    return res.json({
                        success: false,
                        message: `Insufficient leave credit. Available: ${credit.result.latest_credit} days.`
                    });
                }
                const deduction = await LeaveTransactionModel.deductCredit(credit.result.id, total_leave);

                if(!deduction.status){
                    return res.json({ success: false, message: deduction.error });
                }
            }
            const update_response = await LeaveTransactionModel.updateStatus(leave_id, status_id);

            if(!update_response.status){
                return res.json({ success: false, message: update_response.error });
            }

            return res.json({ success: true, data: update_response.result });
        } 
        catch(error){
            return res.json({ success: false, message: error.message });
        }
    }

     /**
     * Retrieves all leave transactions for the logged-in employee.
     *
     * @param {Object} req Express request object.
     * @param {Object} res Express response object.
     * @returns {Object} JSON response with employee leave transactions or error.
     * created by: Rogendher Keith Lachica
     * updated at: September 26 2025 9:00 am
     */
    static async getAllEmployeeLeaveTransaction(req, res){
        const user = req.session.user;

        if(!user){
            return res.json(SESSION_USER_NOT_FOUND);
        }

        try{
            const leaves = await LeaveTypeModel.getAllByEmployeeRecordLeaves(user.employee_id);

            if(!leaves.status){
                return res.json({ success: false, message: leaves.error });
            }
            return res.json({ success: true, data: leaves.result });
        } 
        catch(error){
            return res.json(ERROR_IN_CATCH_GET_ALL_LEAVE_TRANSACTION);
        }
    }
}

export default AdminLeaveController;
