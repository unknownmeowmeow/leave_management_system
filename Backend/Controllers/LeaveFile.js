import TimeValidationHelper from "../Helpers/TimeValidationHelper.js";
import EmployeeModel from "../Models/Employee.js";
import LeaveTransactionModel from "../Models/LeaveTransaction.js";
import LeaveCreditModel from "../Models/LeaveCredit.js";

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
    static async applyLeave(req, res){
        
        try{
            const user = req.session?.user;
    
            if(!user || !user.employee_id){
                return res.json({ success: false, message: "No employee session found." });
            }
            const employee_id = user.employee_id;
            const { leave_type, start_date, end_date, reason } = req.body;
            const year = new Date().getFullYear();
    
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
            const credit_response = await LeaveCreditModel.getLatestEmployeeLeaveCredited(employee_id);
    
            if(!credit_response.status || !credit_response.result) {
                return res.json({ success: false, message: "No leave credit found." });
            }
    
            const latest_credit = parseFloat(credit_response.result.latest_credit || 0);
            if (duration > latest_credit) {
                return res.json({ success: false, message: `Insufficient leave credit. Available: ${latest_credit} days.` });
            }
    
            const transaction_response = await LeaveTransactionModel.insertTransaction({
                employee_id,
                leave_type_id: leave_type,
                rewarded_by_id: employee_id,
                start_date,
                end_date,
                reason,
                total_leave: duration,
                leave_transaction_status_id: 1,
                is_weekend: 0,
                is_active: 1,
                filed_date: new Date(),
                year
            });
    
            if(!transaction_response.status || !transaction_response.result?.leave_id){
                return res.json({ success: false, message: "Error inserting leave transaction." });
            }
    
            return res.json({ success: true, message: "Leave successfully filed." });
        } 
        catch(error){
            return res.json({ success: false, message: "Error occurred while filing leave." });
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
    static async getLatestCredit(req, res){

        try{
            const employee_id = req.session?.user?.employee_id;
    
            if(!employee_id){
                return res.json( { success: false, message: "No Employee Session Found in Log out."});
            }
            const credit_response = await LeaveCreditModel.getLatestEmployeeLeaveCredited(employee_id);
    
            if(!credit_response.status || !credit_response.result){
                return res.json({ success: false, message: "No credit found in model" });
            }
    
            return res.json({ success: true, latest_credit: parseFloat(credit_response.result.latest_credit) 
            });
    
        } 
        catch(error){
            return res.json( { success: false, message: "Failed to fetch leave credit."});
        }
    }
    
}

export default LeaveController;
