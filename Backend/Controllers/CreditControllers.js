import LeaveCreditModel from "../Models/LeaveCreditModel.js";
import LeaveType from "../Models/LeaveTypeModel.js";
import EmployeeModel from "../Models/EmployeeRoleTypeModel.js";
import { GET_ROLE_EMPLOYEE, MESSAGE_RESULT_IN_LEAVE_CREDIT, ZERO

 } from "../Constant/Constants.js";

class CreditControllers {
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
        
        try{
            const leave_type_response = await LeaveType.GetYearlyLeaveTypeAdding();
            
            if(!leave_type_response.status){
                return res.json({ success: false, error: leave_type_response.error });
            }
            const employee_type_response = await EmployeeModel.getRoleByIdEmployee(GET_ROLE_EMPLOYEE);
            
            if(!employee_type_response.status){
                return res.json({ success: false, error: employee_type_response.error });
            }
            const leave_types = leave_type_response.result;
            const employees = employee_type_response.result;
            const results = [];

            for(const employee of employees){
                for(const leave_type of leave_types){
                    const credit_value = parseFloat(leave_type.base_value) || ZERO;
                    const insert_result = await LeaveCreditModel.insertYearlyCredit(
                        employee.id,
                        leave_type.id,
                        credit_value
                    );
                    results.push(insert_result);
                }
            }

            return res.json({
                success: true,
                result: MESSAGE_RESULT_IN_LEAVE_CREDIT,
                details: results,
            });
        } 
        catch(error){
            return res.json({ success: false, error: error.message });
        }
    }
}

export default CreditControllers;
