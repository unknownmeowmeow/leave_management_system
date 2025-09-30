import TimeValidationHelper from "../Helpers/TimeValidationHelper.js";
import EmployeeModel from "../Models/Employee.js";
import LeaveTransactionModel from "../Models/LeaveTransaction.js";
import LeaveCreditModel from "../Models/LeaveCredit.js";
import database  from "../Configs/Database.js";
import ValidationHelper from "../Helpers/ValidationHelper.js";

class LeaveController{

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
        const connection = await database.getConnection();
    
        try{
            await connection.beginTransaction();
            const admin = req.session.user;

            if(!admin || !admin.employee_id){
                await connection.rollback();
                return res.json({ success: false, message: "No admin session found." });
            }
            const rewarded_by_id = admin.employee_id;
            const { employee_id, leave_type, start_date, end_date, reason } = req.body;
            
            if(!employee_id){
                await connection.rollback();
                return res.json({ success: false, message: "Please select an employee." });
            }
            const leave_validation = ValidationHelper.validateLeaveApplication({ leave_type, start_date, end_date});
            
            if(leave_validation.length){
                await connection.rollback();
                return res.json({ success: false, message: leave_validation[0] });
            }
            const year = new Date().getFullYear();
            const { is_valid, message, duration } = await TimeValidationHelper.validateLeaveApplication({ employee_id, leave_type, start_date, end_date, reason});
    
            if(!is_valid){
                await connection.rollback();
                return res.json({ success: false, message });
            }
            const total_credit = await LeaveTransactionModel.getTotalCredit(employee_id);

            if(!total_credit.status){
                await connection.rollback();
                return res.json({ success: false, message: total_credit.error });
            }
            const available_credit = Number(total_credit.result.total_latest_credit);
    
            if(available_credit <= 0){
                await connection.rollback();
                return res.json({ success: false, message: `No credit available: ${available_credit} days.` });
            }
    
            if(duration > available_credit){
                await connection.rollback();
                return res.json({ success: false, message: `Insufficient leave credit. Available: ${available_credit} days.` });
            }
            const latest_record = await LeaveTransactionModel.getLatestCreditRecord(employee_id);
            
            if(!latest_record.status){
                await connection.rollback();
                return res.json({ success: false, message: latest_record.error });
            }
    
            const transaction_response = await LeaveTransactionModel.insertTransaction({
                employee_id,
                leave_type_id: leave_type,
                rewarded_by_id, 
                start_date,
                end_date,
                reason,
                total_leave: duration,
                leave_transaction_status_id: 1,
                is_weekend: 0,
                is_active: 1,
                filed_date: new Date(),
                year,
                connection
            });
    
            if(!transaction_response.status || !transaction_response.result?.leave_id){
                await connection.rollback();
                return res.json({ success: false, message: "Error inserting leave transaction." });
            }
            await connection.commit();
            return res.json({ success: true, message: "Leave successfully filed." });
    
        } 
        catch(error){
            await connection.rollback();
            return res.json({ success: false, message: "Error occurred while filing leave.", error: error.message });
        } 
        finally{
            connection.release();
        }
    }

    /**
     * Applies for a leave request by the logged-in employee.
     * 
     * This function validates the leave request, checks available credits,
     * ensures the requested duration does not exceed available credits, 
     * and inserts a new leave transaction if all validations pass.
     * 
     * @param {Object} req - Express request object containing session and leave details.
     * @param {Object} res - Express response object used to return success or error messages.
     * @returns {Object} JSON response with success or failure message.
     * 
     * created by: Rogendher Keith Lachica
     * updated at: September 30 2025 6:30 pm
     */
    static async applyEmployeeLeave(req, res){
        const connection = await database.getConnection();
    
        try{
            await connection.beginTransaction();
            const employee = req.session.user;
            const employee_id = employee.employee_id;
            const { leave_type, start_date, end_date, reason } = req.body;
            const leave_validation = ValidationHelper.validateLeaveApplication({ leave_type, start_date, end_date });
            
            if(leave_validation.length){
                await connection.rollback();
                return res.json({ success: false, message: leave_validation[0] });
            }
            const { is_valid, message, duration } = await TimeValidationHelper.validateLeaveApplication({ employee_id, leave_type, start_date, end_date, reason});
    
            if(!is_valid){
                await connection.rollback();
                return res.json({ success: false, message });
            }
            const total_credit = await LeaveTransactionModel.getTotalCredit(employee_id);

            if(!total_credit.status){
                await connection.rollback();
                return res.json({ success: false, message: total_credit.error });
            }
            const available_credit = Number(total_credit.result.total_latest_credit);
    
            if(available_credit <= 0){
                await connection.rollback();
                return res.json({ success: false, message: `No credit available: ${available_credit} days.` });
            }
    
            if(duration > available_credit){
                await connection.rollback();
                return res.json({ success: false, message: `Insufficient leave credit. Available: ${available_credit} days.` });
            }
            const latest_record = await LeaveTransactionModel.getLatestCreditRecord(employee_id);

            if(!latest_record.status){
                await connection.rollback();
                return res.json({ success: false, message: latest_record.error });
            }
    
            const transaction_response = await LeaveTransactionModel.insertTransaction({
                employee_id,
                leave_type_id: leave_type,
                rewarded_by_id: null, 
                start_date,
                end_date,
                reason,
                total_leave: duration,
                leave_transaction_status_id: 1, 
                is_weekend: 0,
                is_active: 1,
                filed_date: new Date(),
                year: new Date().getFullYear(),
                connection
            });
    
            if(!transaction_response.status || !transaction_response.result?.leave_id){
                await connection.rollback();
                return res.json({ success: false, message: "Error inserting leave transaction in controller." });
            }
    
            await connection.commit();
            return res.json({ success: true, message: "Leave successfully filed in controller." });
    
        } 
        catch(error){
            await connection.rollback();
            return res.json({ success: false, message: "Error occurred while filing leave in controller."});
        }
        finally{
            connection.release();
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
    static async getEmployeesByRole(req, res){

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
