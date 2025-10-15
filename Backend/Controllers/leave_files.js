import TimeValidationHelper from "../Helpers/time_validation_helper.js";
import EmployeeModel from "../Models/employee.js";
import LeaveTransactionModel from "../Models/leave_transaction.js";
import LeaveCreditModel from "../Models/leave_credit.js";
import LeaveTypeModel from "../Models/leave_type.js";
import { IS_ACTIVE, IS_WEEKEND, LEAVE_TRANSACTION_STATUS, NUMBER } from "../Constant/constants.js";
import { getUserFromSession } from "../Helpers/validation_session.js";

class LeaveController{
    constructor(){
        this.employeeModel = EmployeeModel;
        this.leaveTransactionModel = LeaveTransactionModel;
        this.leaveCreditModel = LeaveCreditModel;
        this.leaveTypeModel = LeaveTypeModel;
        this.timeValidationHelper = TimeValidationHelper;
    }

    /**
     * Allows an employee to file a leave request for themselves.
     * Validates leave type, employee gender, available leave credit, overlapping leaves, and duration.
     * @param {Object} req - Express request object containing session and body (leave details).
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response indicating success or failure of leave filing.
     * Last Updated At: October 1, 2025
     * @author Keith
     */
    async applyEmployeeLeave(req, res) {
        try {
            const user = getUserFromSession(req);
            const employee_id = user.employee_id;
            const { leave_type, start_date, end_date, reason } = req.body;
    
            // Fetch leave type
            const leave_type_record = await this.leaveTypeModel.getAllLeaveId(leave_type);

            if(!leave_type_record.status){
                throw new Error(leave_type_record.error);
            }
            const leave_type_data = leave_type_record.result;
    
            // Fetch employee
            const employee_record = await this.employeeModel.getEmployeeId({employee_id});

            if(!employee_record.status){
                throw new Error(employee_record.error);
            }
    
            // Gender eligibility
            const employee_gender_id = Number(employee_record.result.employee_gender_id);
            const leave_type_gender_id = Number(leave_type_data.gender_id);

            if(leave_type_gender_id !== NUMBER.three && leave_type_gender_id !== employee_gender_id){
                throw new Error("This leave type is not allowed for your gender.");
            }
    
            // Validate leave application
            const validation_result = await this.timeValidationHelper.validateLeaveApplication({ employee_id, leave_type_data, start_date, end_date, reason});
            
            if(!validation_result.is_valid){
                throw new Error(validation_result.result);
            }
    
            // Check overlapping leaves
            const overlapping_date_record = await this.leaveTransactionModel.checkDateOverLapping(employee_id, start_date, validation_result.adjusted_end_date);
            
            if(overlapping_date_record.status){
                throw new Error("Employee has overlapping leave");
            }
    
            // Fetch employee leave credit
            const employee_credit_data = await this.leaveCreditModel.latestCredit(employee_id, leave_type);
            const available_credit = employee_credit_data.status ? Number(employee_credit_data.result.total_earned_credit) : NUMBER.zero;

            if(available_credit <= NUMBER.zero){
                throw new Error(`Cannot apply leave: no available earned credit. Available: ${available_credit} days`);
            }
            
            if(validation_result.duration > available_credit){
                throw new Error(`Insufficient earned credit. Requested: ${validation_result.duration} days, Available: ${`available_credit days`}`);
            }
    
            // Insert leave transaction
            const employee_transaction_record = await this.leaveTransactionModel.insertEmployeeTransaction({
                employee_id,
                leave_type_id: leave_type,
                rewarded_by_id: null,
                start_date,
                end_date: validation_result.adjusted_end_date,
                reason,
                total_leave: validation_result.duration,
                leave_transaction_status_id: LEAVE_TRANSACTION_STATUS.pending,
                is_weekend: IS_WEEKEND.no,
                is_active: IS_ACTIVE.yes,
                filed_date: new Date(),
                year: new Date().getFullYear()
            });
    
            if(!employee_transaction_record.status){
                throw new Error(employee_transaction_record.error);
            }
    
            return res.json({ status: true, result: "Leave successfully filed."});
    
        } 
        catch(error){
            return res.json({ status: false, result: error.message });
        }
    }
    

    
}

export default new LeaveController();
