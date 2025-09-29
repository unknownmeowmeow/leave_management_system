import LeaveTypeModel from "../Models/LeaveType.js";
import LeaveTransactionModel from "../Models/LeaveTransaction.js";

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
    static async getAllLeaveTransactions(req, res){

        try{
            const leaves = await LeaveTypeModel.getAllLeaves();

            if(!leaves.status){
                return res.json({ success: false, message: leaves.error });
            }
            return res.json({ success: true, data: leaves.result });
        } 
        catch(error){
            return res.json({ success: false, message: "failed to update leave status."});
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
    static async updateLeaveStatus(req, res) {
        const { leave_id, status_id } = req.body;
    
        if (!leave_id || !status_id) {
            return res.json({ success: false, message: "Leave ID and status required." });
        }
    
        try{
            const leave_transaction = await LeaveTransactionModel.getLeaveTransactionById(leave_id);
    
            if(!leave_transaction.status){
                return res.json({ success: false, message: leave_transaction.error });
            }
            const employee_id = leave_transaction.result.employee_id;
            const total_leave = Number(leave_transaction.result.total_leave); 
    
            if(Number(status_id) === 2){
                const total_credit = await LeaveTransactionModel.getTotalCredit(employee_id);
    
                if(!total_credit.status){
                    return res.json({ success: false, message: total_credit.error });
                }
                const available_credit = Number(total_credit.result); 
    
                if(available_credit < total_leave){
                    return res.json({
                        success: false,
                        message: `Insufficient leave credit. Available: ${available_credit} days.`
                    });
                }
                const latest_credit = await LeaveTransactionModel.getLatestCreditRecord(employee_id);
    
                if(!latest_credit.status){
                    return res.json({ success: false, message: latest_credit.error });
                }
                const deduction = await LeaveTransactionModel.deductCredit(latest_credit.result.id, total_leave);
    
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
            return res.json({ success: false, message: "User session not found." });
        }

        try{
            const leaves = await LeaveTypeModel.getAllByEmployeeRecordLeaves(user.employee_id);

            if(!leaves.status){
                return res.json({ success: false, message: leaves.error });
            }
            return res.json({ success: true, data: leaves.result });
        } 
        catch(error){
            return res.json({ success: false, message: "Failed to fetch leave records." });
        }
    }
}

export default AdminLeaveController;
