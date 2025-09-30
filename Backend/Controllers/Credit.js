import LeaveCreditModel from "../Models/LeaveCredit.js";
import LeaveType from "../Models/LeaveType.js";
import EmployeeModel from "../Models/EmployeeRoleType.js";
import CreditCalculationHelper from "../Helpers/CreditCalulation.js";
import database from "../Configs/Database.js";

class Credit{
    /**
     * Automatically inserts yearly leave credits for employees with role type 3.
     * Triggered by cron or manual API call.
     * 
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} JSON response indicating success or failure.
     * created by: rogendher keith lachica
     * updated at: September 25 2025 10:00 am
     */
    static async runYearlyCreditInsertion(req, res) {
        const connection = await database.getConnection();

        try {
            await connection.beginTransaction();
            const leave_type_response = await LeaveType.getAllCarryOverLeaveTypes();
            
            if(!leave_type_response.status || leave_type_response.result.length === 0){
                await connection.rollback();
                return res.json({ success: false, error: leave_type_response.error || "No carry-over leave types found" });
            }
            const employee_type_response = await EmployeeModel.getRoleByIdEmployee(3);
            if(!employee_type_response.status || employee_type_response.result.length === 0){
                await connection.rollback();
                return res.json({ success: false, error: employee_type_response.error || "No employees found" });
            }
            const leave_types = leave_type_response.result;
            const employees = employee_type_response.result;
            const total_base_value = CreditCalculationHelper.getTotalBaseValue(leave_types);

            const insert_data = employees.map(employee => ({
                employee_id: employee.id,
                leave_transaction_id: null,
                attendance_id: null,
                leave_type_id: null,
                earned_credit: total_base_value,
                used_credit: 0.00,
                deducted_credit: 0.00,
                current_credit: total_base_value,
                latest_credit: total_base_value,
                connection
            }));
            await Promise.all(insert_data.map(insert_yearly_credit => LeaveCreditModel.insertLeaveCredit(insert_yearly_credit)));
            await connection.commit();
            return res.json({ success: true, result: "leave type that are default successfully earned credit yearly" });
        }
        catch(error){
            await connection.rollback();
            return res.json({ success: false, error: error.message });
        }
        finally {
            connection.release();
        }
    }
    /**
     * Controller to get all employee leave credit records.
     * 
     * @param {Object} req - The Express request object.
     * @param {Object} res - The Express response object.
     * @returns {Promise<Object>} Sends JSON response with credit records or error message.
     * created by: rogendher keith lachica
     * updated at: September 24 2025 1:30 pm  
     */
    static async getAllEmployeeCredits(req, res){
        const user = req.session.user;

        if(!user || !user.employee_id){
            return res.json({ success: false, message: "User session not found." });
        }

        try{
            const response_data = await LeaveCreditModel.getAllEmployeeCredits();

            if(response_data.error){
                return res.json({ success: false, error: response_data.error });
            }

            res.json({ success: true, result: response_data.result });
        }
        catch(error){
            res.json({ success: false, error: "Failed to fetch employee leave credits." });
        }
    }

}

export default Credit;
