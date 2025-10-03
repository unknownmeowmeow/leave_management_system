import LeaveCreditModel from "../Models/leave_credit.js";
import LeaveType from "../Models/leave_type.js";
import EmployeeModel from "../Models/employee_role_type.js";
import CreditCalculationHelper from "../Helpers/credit_calulation_helper.js";
import { NUMBER, ROLE_TYPE_ID } from "../Constant/constants.js";

class Credit{

    /**
     * Inserts yearly leave credits for all employees with carry-over leave types.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response indicating success or failure.
     *
     * created by: Rogendher Keith Lachica
     * updated at: September 26, 2025 12:05 PM
     */
    static async runYearlyCreditInsertion(req, res){
        
        try{
            const leave_type_carryover_record = await LeaveType.getAllCarryOverLeaveTypes();
            console.log(leave_type_carryover_record);
            if(!leave_type_carryover_record.status || leave_type_carryover_record.error){
                throw new Error(leave_type_carryover_record.error);
            }
    
            const employee_record = await EmployeeModel.getRoleByIdEmployee(ROLE_TYPE_ID.employee);
            console.log(employee_record);
            if(!employee_record.status || employee_record.error){
                throw new Error(employee_record.error);
            }
    
            const leave_types = leave_type_carryover_record.result;
            const employees = employee_record.result;
            const total_base_value = CreditCalculationHelper.getTotalBaseValue(leave_types);
            console.log(total_base_value);
            const employee_data = employees.map(employee => [  
                employee.id,        
                null,               
                null,               
                null,             
                total_base_value,  
                NUMBER.zero_point_zero_zero,              
                NUMBER.zero_point_zero_zero,               
                total_base_value, 
                total_base_value, 
                new Date()          
            ]);
            const insert_yearly_credit = await LeaveCreditModel.insertYearlyCredit(employee_data);
            console.log(insert_yearly_credit);
            if(!insert_yearly_credit.status || insert_yearly_credit.error){
                throw new Error(insert_yearly_credit.error);
            }
    
            return res.json({ success: true, result: "Leave credits successfully added for all employees in controls." });
        } 
        catch(error){
            return res.json({ success: false, message: error.message || "Server error admin in controller" });
        } 
    }
    
    
    
    /**
     * Retrieves all leave credit records for employees.
     *
     * @param {Object} req - Express request object with session info.
     * @param {Object} res - Express response object used to send JSON.
     * @returns {Object} JSON response with leave credits or error.
     *
     * created by: Rogendher Keith Lachica
     * updated at: September 26, 2025 12:15 PM
     */
    static async getAllEmployeeCredits(req, res){

        try{
            const user = req.session.user;
    
            if(!user || !user.employee_id){
                throw new Error("No User Found");
            }
    
            const leave_credit_record = await LeaveCreditModel.getAllEmployeeCredit();
    
            if(leave_credit_record.error){
                throw new Error("No leave Credit Found");
            }
    
            return res.json({ success: true, result: leave_credit_record.result });
        }
        catch(error){
            return res.json({ success: false, message: error.message || "Server error admin in controller" });
        }
    }    

}

export default Credit;
