import LeaveCreditModel from "../Models/leave_credit.js";
import LeaveType from "../Models/leave_type.js";
import EmployeeModel from "../Models/employee_role_type.js";
import CreditCalculationHelper from "../Helpers/credit_calulation.js";
import { NUMBER, ROLE_TYPE_ID } from "../Constant/constants.js";

class Credit{

    /**
     * Inserts yearly leave credits for all employees with carry-over leave types.
     *
     * Workflow:
     * 1. **Open DB Transaction**
     *    - Starts a transaction to ensure atomicity of credit insertion.
     *
     * 2. **Fetch Carry-Over Leave Types**
     *    - Calls `LeaveType.getAllCarryOverLeaveTypes()`.
     *    - If none found → rollback and return error response.
     *
     * 3. **Fetch Eligible Employees**
     *    - Calls `EmployeeModel.getRoleByIdEmployee(ROLE_TYPE_ID.employee)`.
     *    - If no employees found → rollback and return error response.
     *
     * 4. **Compute Total Base Value**
     *    - Uses `CreditCalculationHelper.getTotalBaseValue(leave_types)` 
     *      to calculate the total credit value employees should receive.
     *
     * 5. **Prepare Employee Credit Data**
     *    - Maps each employee to a dataset structured for bulk insertion:
     *      `[employee_id, null, null, null, total_base_value, 0.00, 0.00, total_base_value, total_base_value]`
     *      → representing earned/used/deducted credits initialized properly.
     *
     * 6. **Insert Yearly Credits**
     *    - Calls `LeaveCreditModel.insertYearlyCredit(employee_data, connection)` 
     *      to insert credits for all employees in bulk.
     *
     * 7. **Commit Transaction**
     *    - On success, commits the transaction and returns success response.
     *
     * 8. **Error Handling**
     *    - Any error during the process triggers a rollback and 
     *      returns `{ success: false, error: error.message }`.
     *
     * Example Response (Success):
     * {
     *   success: true,
     *   result: "Leave credits successfully added for all employees in controls."
     * }
     *
     * Example Response (Failure - no leave types):
     * {
     *   success: false,
     *   error: "No carry-over leave types found"
     * }
     *
     * Example Response (Failure - no employees):
     * {
     *   success: false,
     *   error: "No employees found"
     * }
     *
     * Example Response (Failure - DB error):
     * {
     *   success: false,
     *   error: "Database connection error"
     * }
     *
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response indicating success or failure.
     *
     * created by: Rogendher Keith Lachica
     * updated at: September 26, 2025 12:05 PM
     */
    static async runYearlyCreditInsertion(req, res){
        
        try{
            const leave_type_carry_over_record = await LeaveType.getAllCarryOverLeaveTypes();
    
            if(!leave_type_carry_over_record.status || leave_type_carry_over_record.result.length === NUMBER.zero){
                throw new Error("No Leave Type for Carry Over");
            }
    
            const employee_record = await EmployeeModel.getRoleByIdEmployee(ROLE_TYPE_ID.employee);
    
            if(!employee_record.status || employee_record.result.length === NUMBER.zero){
                throw new Error("No Employee Record Found");
            }
    
            const leave_types = leave_type_carry_over_record.result;
            const employees = employee_record.result;
            const total_base_value = CreditCalculationHelper.getTotalBaseValue(leave_types);
            const employee_data = employees.map(employee => [
                employee.id, 
                null, 
                null, 
                null, 
                NUMBER.zero_point_zero_zero, 
                NUMBER.zero_point_zero_zero,
                NUMBER.zero_point_zero_zero, 
                total_base_value, 
                NUMBER.zero_point_zero_zero, 
                NUMBER.zero_point_zero_zero, 
                total_base_value, 
                total_base_value, 
                new Date()
            ]);
    
            const insert_result = await LeaveCreditModel.insertYearlyCredit(employee_data);
    
            if(!insert_result.status){
                throw new Error("Failed to insert yearly leave credits");
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
     * Workflow:
     * 1. **Verify Session**
     *    - Ensures `req.session.user` exists and has an `employee_id`.
     *    - If not found → returns `{ success: false, message: "User session not found." }`.
     *
     * 2. **Fetch Employee Leave Credits**
     *    - Calls `LeaveCreditModel.getAllEmployeeCredits()`.
     *    - Intended to fetch leave credit records across all employees.
     *
     * 3. **Validate Response**
     *    - If `response_data.error` exists → returns failure response.
     *    - Otherwise → returns `{ success: true, result: [...] }`.
     *
     * 4. **Error Handling**
     *    - Any runtime error returns `{ success: false, error: "Failed to fetch employee leave credits." }`.
     *
     * Example Response (Success):
     * {
     *   success: true,
     *   result: [
     *     { id: 1, employee_id: 1001, earned_credit: 15, used_credit: 5, remaining_credit: 10 },
     *     { id: 2, employee_id: 1002, earned_credit: 10, used_credit: 2, remaining_credit: 8 }
     *   ]
     * }
     *
     * Example Response (Failure - no session):
     * {
     *   success: false,
     *   message: "User session not found."
     * }
     *
     * Example Response (Failure - DB error):
     * {
     *   success: false,
     *   error: "Database connection error"
     * }
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
    
            const leave_credit_record = await LeaveCreditModel.getAllEmployeeCredits();
    
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
