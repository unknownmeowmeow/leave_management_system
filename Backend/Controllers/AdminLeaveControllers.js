import LeaveTypeModel from "../Models/LeaveTypeModel.js";
import LeaveTransactionModel from "../Models/LeaveTransactionModel.js";
import { SESSION_USER_NOT_FOUND } from "../Constant/Constants.js";
class AdminLeaveController {

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
                return res.json({ success: false, message: leaves.error || "No leave records found." });
            }

            return res.json({ success: true, data: leaves.result });
        } 
        catch(error){
            return res.json({ success: false, message: "Failed to fetch leave records.", error: error.message });
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

        try{
            const response = await LeaveTransactionModel.updateStatus(leave_id, status_id);

            if(!response.status){
                return res.json({ success: false, message: response.error });
            }

            return res.json({ success: true, data: response.result });
        } 
        catch(error){
            return res.json({ success: false, message: "Failed to update leave status.", error: error.message });
        }
    }
    static async getAllLeaveTransactions(req, res) {
        const user = req.session.user;
       
        if(!user){
            return res.json(SESSION_USER_NOT_FOUND);
        } 
        try{
            
            const leaves = await LeaveTypeModel.getAllLeaves(employee_id);

            if(!leaves.status){
                return res.json({ success: false, message: leaves.error });
            }

            return res.json({ success: true, data: leaves.result });
        } 
        catch(error){
            return res.json({ success: false, message: "Failed to fetch leave records."});
        }
    }
}

export default AdminLeaveController;
