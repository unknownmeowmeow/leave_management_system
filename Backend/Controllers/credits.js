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
            const employee_ids_all = (qualified_employee.result || []).map(employees => employees.employee_id);
    
            /* Fetch employees who have already received yearly credit this year */
            const already_credited_record = await this.leaveCreditModel.getEmployeeYearylyAddedCredit({ leave_type_id, year: new Date().getFullYear() });
            const already_credited_ids = ((already_credited_record.result) || []).map(employee => employee.employee_id);
    
            /* Filter out employees who have already been credited */
            const employee_credit = employee_ids_all.filter(id => !already_credited_ids.includes(id));
    
            if(!employee_credit.length){
                throw new Error("All qualified employees have already received yearly credit.");
            }
    
            const update_yearly_credit = await this.leaveCreditModel.updateYearlyCreditBatch({ leave_type_id, gain_credit, employee_ids: employee_credit });
    
            if(!update_yearly_credit.status){
                throw new Error(update_yearly_credit.error);
            }
    
            return res.json({ status: true, result: update_yearly_credit, result: `Successfully credited ${update_yearly_credit.result} employees with ${gain_credit} leave days.`});
    
        } 
        catch(error){
            return res.json({ status: false, result: error.message});
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
    async addMonthlyCredit(req, res){
        try{
            /* Define leave type IDs to be credited monthly */
            const leave_type_ids = [LEAVE_TYPE_ID.vacation_leave, LEAVE_TYPE_ID.sick_leave];
    
            /* Fetch all active monthly leave types from the database */
            const leave_type_records = await this.leaveTypeModel.getMonthlyEarnLeaveType();
    
            if(!leave_type_records.status){
                throw new Error(leave_type_records.error);
            }
    
            /* Filter leave types to include only the ones specified in leave_type_ids */
            const filtered_leave_types = leave_type_records.result.filter(leave_type => leave_type_ids.includes(leave_type.id));
    
            if(!filtered_leave_types.length){
                throw new Error("No active leave types matching IDs found.");
            }
    
            /* Map leave_type_ids to their corresponding gain credits */
            const gain_credits = leave_type_ids.map(id => { 
                const leave = filtered_leave_types.find(leave_type => leave_type.id === id);
                return leave ? parseFloat(leave.gain_credit) : NUMBER.zero;
            });
    
            /* Get employees who qualify for monthly leave credit */
            const qualified_employee = await this.attendanceModel.getMonthlyAttendance({ required_count: NUMBER.twenty, role_type_id: ROLE_TYPE_ID.employee });
    
            if(!qualified_employee.status){
                throw new Error(qualified_employee.error);
            }
    
            /* Extract employee IDs for updating */
            const employee_ids = qualified_employee.result.map(employee => employee.employee_id);
    
            if(!employee_ids.length){
                throw new Error("No employees to update.");
            }

            const update_result = await this.leaveCreditModel.updateMonthlyCredit({ leave_type_ids, gain_credits, employee_ids });
            return res.json({ status: true, result: update_result.result || NUMBER.zero, 
                result: `Successfully credited ${update_result.result || NUMBER.zero} employees with leave days.`});
    
        } 
        catch(error){
            return res.json({ status: false, result: error.message});
        }
    }

    /**
     * Retrieves all employee leave credits.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response containing all leave credits.
     * Last Updated At: September 26, 2025 12:15 PM
     * @author Keith
     */
    async allEmployeeCredit(req, res){    
       
        try{
            const leave_credit_record = await this.leaveCreditModel.getAllEmployeeCredit();
        
            if(!leave_credit_record){
                throw new Error(leave_credit_record.error);
            }
    
            return res.json({ status: true, result: leave_credit_record.result}); 
        } 
        catch(error){
            return res.json({ status: false, result: error.message});
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
    
            /* Insert leave transaction for the employee */
            const leave_transaction_data = await this.leaveTransactionModel.insertEmployeeTransaction({
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
                connection
            });            
    
            if(!leave_transaction_data.status){
                throw new Error(leave_transaction_data.error);
            }
    
            /* Get the latest leave credit record for the employee and leave type */
            const existing_credit_data = await this.leaveCreditModel.getLatestCredit({ employee_id, leave_type_id });
            
            if(!existing_credit_data.status){
                throw new Error(existing_credit_data.error);
            }
    
            /* Calculate updated leave credits */
            const current_credit = Number(existing_credit_data.result.current_credit || NUMBER.zero) + parseFloat(earned_credit);
            const latest_credit = Number(existing_credit_data.result.latest_credit || NUMBER.zero) + parseFloat(earned_credit);
    
            /* Update leave credit in the database */
            const leave_credit_data = await this.leaveCreditModel.updateEmployeeCredit({
                employee_id, 
                leave_type_id, 
                earned_credit: parseFloat(earned_credit), 
                current_credit, 
                latest_credit, 
                connection
            });
    
            if(!leave_credit_data.status){
                throw new Error(leave_credit_data.error);
            }
    
            await connection.commit();
            return res.json({ status: true, result: "Leave credit successfully updated." });
    
        } 
        catch(error){
            await connection.rollback();
            return res.json({ status: false, result: error.message});
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
     * Last Updated At: September 26, 2025 12:30 PM
     * @author Keith
     */
    async resetEmployeeCredit(req, res){
        try{
            /* Fetch all employees with the 'employee' role */
            const employee_record = await this.employeeModel.getEmployeeId({role_id: ROLE_TYPE_ID.employee});
            
            if(!employee_record.status){
                throw new Error(employee_record.error);
            }
    
            let employees = [];

            if(employee_record.result){
                employees = [employee_record.result];
            } 
            else{
                throw new Error("No employees found to reset credits.");
            }
    
            /* Check if there are any employees to reset credits for */
            if(!employees.length){
               throw new Error("No employees found to reset credits.");
            }
    
            /* Fetch leave types that are not carried over */
            const leave_type_record = await this.leaveTypeModel.getNotCarryOverLeave();
            
            if(!leave_type_record.status){
                throw new Error(leave_type_record.error);
            }
            
            const leave_types = leave_type_record.result;
    
            /* Check if there are leave types to reset */
            if(!leave_types.length){
               throw new Error("No leave types found to reset.");
            }
    
            /* Prepare reset data: for each employee and leave type, reset all credit fields to 0 */
            const reset_data = employees.flatMap(employee => leave_types.map(leave_type => ({
                employee_id: employee.id,
                leave_type_id: leave_type.id,
                earned_credit:  DECIMAL_NUMBER.zero_point_zero_zero,    
                deducted_credit:  DECIMAL_NUMBER.zero_point_zero_zero,    
                used_credit:  DECIMAL_NUMBER.zero_point_zero_zero,        
                current_credit:  DECIMAL_NUMBER.zero_point_zero_zero,     
                latest_credit:  DECIMAL_NUMBER.zero_point_zero_zero       
            })));
    
            const reset_result = await this.leaveCreditModel.resetUpdateCredit(reset_data);
            
            if(!reset_result.status){
                throw new Error(reset_result.error);
            }
    
            return res.json({ status: true, result: "Employee leave credits successfully reset per leave type."});
    
        } 
        catch(error){
            return res.json({ status: false, result: error.message});
        }
    }
    
    
    /**
     * Retrieves the latest leave credit for the currently logged-in employee.
     * @param {Object} req - Express request object containing employee session data.
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response with success status and latest leave credit (if available).
     *
     * created by: keith
     * updated at: October 1, 2025 01:57 PM
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
            return res.json({ status: false, result: error.message});
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
            return res.json({ status: false, result: error.message});
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
            
            if(!get_employee_leave_record){
                throw new Error(get_employee_leave_record.error);
            }
    
            return res.json({ status: true, result: get_employee_leave_record.result });
        } 
        catch(error){
            return res.json({ status: false, result: error.message});
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
            return res.json({ status: false, result: error.message});
        }
    }
   
}

export default new Credit();
