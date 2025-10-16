import LeaveCreditModel from "../Models/leave_credit.js";
import EmployeeRoleModel from "../Models/employee_role_type.js";
import CreditCalculationHelper from "../Helpers/credit_calulation_helper.js";
import AttendanceModel from "../Models/attendance.js";
import LeaveTransactionModel from "../Models/leave_transaction.js";
import LeaveTypeModel from "../Models/leave_type.js";
import EmployeeModel from "../Models/employee.js";
import database from "../Configs/database.js";
import { NUMBER, ROLE_TYPE_ID, LEAVE_TRANSACTION_STATUS, DECIMAL_NUMBER,GENDER_TYPE_ID, LEAVE_TYPE_ID } from "../Constant/constants.js";
import { getUserFromSession } from "../Helpers/validation_session.js";


class Credit{
    constructor(){
        this.leaveCreditModel = LeaveCreditModel;
        this.employeeRoleModel = EmployeeRoleModel;
        this.creditHelper = CreditCalculationHelper;
        this.attendanceModel = AttendanceModel;
        this.leaveTransactionModel = LeaveTransactionModel;
        this.leaveTypeModel = LeaveTypeModel;
        this.employeeModel = EmployeeModel;
        this.db = database;
    }
    
    /**
     * Adds yearly leave credits to qualified employees for the active yearly leave type.
     * Checks which employees qualify based on attendance and filters out those who have already received yearly credit.
     * Updates the leave credits for the remaining eligible employees.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response indicating success/failure and number of employees credited.
     * Last Updated At: October 14, 2025
     * @author Keith
     */
    async addYearlyCredit(req, res){
        try{
            /* Fetch the active yearly leave type */
            const leave_type_record = await this.leaveTypeModel.getYearlyLeaveType();
    
            if(!leave_type_record.status || leave_type_record.result.length === NUMBER.zero){
                throw new Error("No active yearly leave type found.");
            }
    
            /* Extract leave_type_id and gain_credit from the record */
            const leave_type_id = leave_type_record.result[NUMBER.zero].leave_type_id;
            const gain_credit = parseFloat(leave_type_record.result[NUMBER.zero].gain_credit);
    
            /* Get all employees who qualify for yearly credit */
            const qualified_employee = await this.attendanceModel.getQualifiedEmployee({ qualified_attendance: NUMBER.two_hundred_forty_eight, role_type_id: ROLE_TYPE_ID.employee });
    
            if(!qualified_employee.status){
                throw new Error(qualified_employee.error);
            }
    
            /* Extract all qualified employee IDs */
            const all_employee_id = (qualified_employee.result || []).map(employees => employees.employee_id);
    
            /* Fetch employees who have already received yearly credit this year */
            const employee_credited = await this.leaveCreditModel.getEmployeeYearylyAddedCredit({ leave_type_id, year: new Date().getFullYear() });
            const already_credited_id = ((employee_credited.result) || []).map(employee => employee.employee_id);
    
            /* Filter out employees who have already been credited */
            const employee_credit = all_employee_id.filter(id => !already_credited_id.includes(id));
    
            if(!employee_credit.length){
                throw new Error("All qualified employees have already received yearly credit.");
            }
    
            const update_yearly_credit = await this.leaveCreditModel.updateYearlyCreditBatch({ leave_type_id, gain_credit, employee_ids: employee_credit });
    
            if(!update_yearly_credit.status){
                throw new Error(update_yearly_credit.error);
            }
    
            return res.json({ status: true, result: update_yearly_credit});
    
        } 
        catch(error){
            return res.json({ status: false, error: error.message});
        }
    }
    
     /**
     * Adds monthly leave credits to qualified employees for specific leave types.
     * Retrieves active monthly leave types, filters by specified IDs, checks which employees qualify, and updates their leave credits.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response indicating success/failure and number of employees credited.
     * Last Updated At: October 14, 2025
     * @author Keith
     */
    async addMonthlyCredit(req, res) {
        try{
            // const monthly_credit = {

            // }

            const monthly_earned_leave = await this.leaveCreditModel.updateMonthlyCredit();
            
            if(!monthly_earned_leave.status){
                throw new Error(monthly_earned_leave.error);
            }

            return res.json({ status: true, result: monthly_earned_leave.result });
        } 
        catch(error){
            return res.json({ status: false, error: error.message });
        }
    }

    /**
     * Retrieves all employee leave credits.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response containing all leave credits.
     * Last Updated At: September 26, 2025 
     * @author Keith
     */
    async allEmployeeCredit(req, res){    
       
        try{
            const leave_credit_record = await this.leaveCreditModel.getAllEmployeeCredit();
        
            if(!leave_credit_record.status){
                throw new Error(leave_credit_record.error);
            }
    
            return res.json({ status: true, result: leave_credit_record.result}); 
        } 
        catch(error){
            return res.json({ status: false, error: error.message});
        }
    }  

    /**
     * Adds leave credit to a specific employee.
     * Validates employee session and request body, inserts leave transaction, and updates leave credit.
     * @param {Object} req - Express request object with employee_id, leave_type_id, and earned_credit in body.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response indicating success/failure.
     * Last Updated At: September 26, 2025
     * @author Keith
     */
    async addLeaveCredit(req, res){
        const connection = await this.db.getConnection();
    
        try{
            await connection.beginTransaction();
            const user = req.session.user;
    
            /* Validate user session */
            if(!user || !user.employee_id){
                throw new Error("User session not found.");
            }

            const rewarded_by_id = user.employee_id; 
            const { employee_id, leave_type_id, earned_credit } = req.body;
    
            /* Validate request body */
            if(!employee_id || !leave_type_id || !earned_credit || isNaN(earned_credit)){
                throw new Error("Employee, leave type, and earned credit are required." );
             
            }
    
            if(Number(earned_credit) === NUMBER.zero){
                throw new Error("Cannot add zero leave credit.");
            }
    
            /* Fetch employee and leave type records */
            const employee_record = await this.employeeModel.getEmployeeId({employee_id});
            const leave_type_record = await this.leaveTypeModel.getAllLeaveId(leave_type_id);
    
            if(!employee_record.status){
                throw new Error(employee_record.error);
            }
    
            if(!leave_type_record.status){
                throw new Error(leave_type_record.error);
            }
    
            /* Check gender restriction for leave type */
            const employee_gender_id = Number(employee_record.result.employee_gender_id); 
            const leave_type_gender_id = Number(leave_type_record.result.gender_id); 
            
            if(leave_type_gender_id !== GENDER_TYPE_ID.both_gender && leave_type_gender_id !== employee_gender_id){
                throw new Error("This leave type is not allowed for this employee's gender.");
            }
            
            const employee_transaction = {
                employee_id,
                leave_type_id,
                rewarded_by_id,
                total_leave: earned_credit,
                leave_transaction_status_id: LEAVE_TRANSACTION_STATUS.approved,
                is_weekend: null,
                is_active: null,
                start_date: null,
                end_date: null,
                filed_date: null,
                year: new Date().getFullYear(),
                approved_by_id: null,
                reason: null,
            }
    
            /* Insert leave transaction for the employee */
            const leave_transaction = await this.leaveTransactionModel.insertEmployeeTransaction(employee_transaction, connection);            
            
            if(!leave_transaction.status){
                throw new Error(leave_transaction.error);
            }
    
            /* Get the latest leave credit record for the employee and leave type */
            const existing_credit = await this.leaveCreditModel.getLatestCredit({ employee_id, leave_type_id });
            
            if(!existing_credit.status){
                throw new Error(existing_credit.error);
            }
    
            /* Calculate updated leave credits */
            const current_credit = Number(existing_credit.result.current_credit || NUMBER.zero) + parseFloat(earned_credit);
            const latest_credit = Number(existing_credit.result.latest_credit || NUMBER.zero) + parseFloat(earned_credit);
    
            const update_credit = {
                employee_id,
                leave_type_id,
                earned_credit: parseFloat(earned_credit),
                current_credit,
                latest_credit
            };
            
            /* Update leave credit in the database */
            const leave_credit_data = await this.leaveCreditModel.updateEmployeeCredit( update_credit, connection);
            
            if(!leave_credit_data.status){
                throw new Error(leave_credit_data.error);
            }
    
            await connection.commit();
            return res.json({ status: true, result: leave_credit_data.result});
    
        } 
        catch(error){
            await connection.rollback();
            return res.json({ status: false, error: error.message});
        }
        finally{
            connection.release();
        }
    }
    
    /**
     * Resets leave credits for all employees for non-carry-over leave types.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response indicating success or failure.
     * Last Updated At: September 26, 2025 
     * @author Keith
     */
    async resetEmployeeCredit(req, res){
        try{
            const reset_credit = await this.leaveCreditModel.resetUpdateCredit();
            
            if(!reset_credit.status){
                throw new Error(reset_credit.error);
            }
    
            return res.json({ status: true, result: reset_credit.result });
        }
        catch(error){
            return res.json({ status: false, error: error.message });
        }
    }
    
      
    /**
     * Retrieves the latest leave credit for the currently logged-in employee.
     * @param {Object} req - Express request object containing employee session data.
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response with success status and latest leave credit (if available).
     *
     * created by: keith
     * updated at: October 1, 2025
     */
    async allLatestCredit(req, res){
        
        try{
            const user = getUserFromSession(req);
            const employee_credit_record = await this.leaveCreditModel.getTotalCredit(user.employee_id);
        
            if(employee_credit_record.status){
                throw new Error(employee_credit_record.error);
            
            }

            return res.json({ status: true, result: parseFloat(employee_credit_record.result)});
        } 
        catch(error){
            return res.json({ status: false, error: error.message});
        }
    }

     /**
     * Retrieves leave history for all employees.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response containing all employee leave records or error.
     * Last Updated At: September 26, 2025
     * @author Keith
     */
     async employeeCreditLeave(req, res){
        
        try{
            const get_all_leave_record = await this.leaveCreditModel.getAllEmployeeCredit();
        
            if(!get_all_leave_record.status){
                throw new Error(get_all_leave_record.error);
            }

            return res.json({ status: true, result: get_all_leave_record.result });
        } 
        catch(error){
            return res.json({ status: false, error: error.message});
        }
    }
    
    /**
     * Retrieves leave history for the logged-in employee.
     * @param {Object} req - Express request object containing employee session.
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response containing leave history or error.
     * Last Updated At: September 26, 2025 
     * @author Keith
     */
    async employeeLeaveCreditHistory(req, res){
       
        try{
            const user = req.session.user;
            const get_employee_leave_record = await this.leaveCreditModel.getCreditSummary(user.employee_id);
            
            if(!get_employee_leave_record.status){
                throw new Error(get_employee_leave_record.error);
            }
    
            return res.json({ status: true, result: get_employee_leave_record.result });
        } 
        catch(error){
            return res.json({ status: false, error: error.message});
        }
    }

    /**
     * Retrieves a summary of leave credits for a specific employee.
     * @param {Object} req - Express request object with employee_id in params.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response containing leave summary or error.
     * Last Updated At: September 26, 2025 
     * @author Keith
     */
    async employeeLeaveCreditSummary(req, res){
        
        try{
            const employee_id = req.params.employee_id;
            const get_specific_leave_record = await this.leaveCreditModel.getCreditSummary(employee_id);
        
            if(!get_specific_leave_record.status){
                throw new Error(get_specific_leave_record.error);
            }

            return res.json({ status: true, result: get_specific_leave_record.result });
        } 
        catch(error){
            return res.json({ status: false, error: error.message});
        }
    }
   
}

export default new Credit();
