<<<<<<< HEAD
import TimeValidationHelper from "../Helpers/time_validation_helper.js";
import EmployeeModel from "../Models/employee.js";
import LeaveTransactionModel from "../Models/leave_transaction.js";
import LeaveCreditModel from "../Models/leave_credit.js";
import LeaveTypeModel from "../Models/leave_type.js";
import { GENDER_TYPE_ID, IS_ACTIVE, IS_WEEKEND, LEAVE_TRANSACTION_STATUS, NUMBER } from "../Constant/constants.js";
import { getUserFromSession } from "../Helpers/validation_session.js";

class LeaveController{
    constructor(){
        this.employeeModel = EmployeeModel;
        this.leaveTransactionModel = LeaveTransactionModel;
        this.leaveCreditModel = LeaveCreditModel;
        this.leaveTypeModel = LeaveTypeModel;
        this.timeValidationHelper = TimeValidationHelper;
    }
=======
import timeValidation from "../helpers/time_validation_helper.js";
import employee from "../models/employee.js";
import leaveTransaction from "../models/leave_transaction.js";
import leaveCredit from "../models/leave_credit.js";
import leaveType from "../models/leave_type.js";
import validationHelper from "../helpers/validation_helper.js";
import { IS_ACTIVE, IS_WEEKEND, LEAVE_TRANSACTION_STATUS, NUMBER } from "../constant/constants.js";

class LeaveFile{

    /**
     * Applies a leave request for an employee.
     *
     * @param {Object} req - Express request object containing session and leave details.
     * @param {Object} res - Express response object for sending JSON results.
     * @returns {Object} JSON response indicating success or failure.
     *
     * created by: Rogendher Keith Lachica
     * updated at: September 26, 2025 01:15 PM
     */
    static async applyLeave(req, res){

        try{
            const rewarded_by_id =   req.employee_id;
            const { employee_id, leave_type, start_date, end_date, reason } = req.body;
            const leave_type_record = await leaveType.getLeaveTypeById(leave_type);
            
            // Validate leave type exists
            if(!leave_type_record.status || leave_type_record.error) 
                throw new Error(leave_type_record.error);

            // Extract leave type data from DB record
            const leave_type_data = leave_type_record.result;

            // Perform basic leave validation
            const leave_validation = validationHelper.validateLeaveApplication({ leave_type, start_date, end_date});

            // Return first validation error if exists
            if(leave_validation.is_valid) 
                return res.json({ success: false, message: leave_validation.message });

            // Get current year
            const year = new Date().getFullYear();

            // Detailed leave validation including duration, weekend adjustment, and notice period
            const { is_valid, message, duration, adjusted_end_date } = await timeValidation.validateLeaveApplication({ employee_id, leave_type_data, start_date, end_date, reason});
    
            // Stop if leave validation fails
            if(!is_valid){
                return res.json({ success: false, message });
            }

            const check_credit_employee_record = await leaveTransaction.getTotalCredit(employee_id);

            // Ensure employee has leave credits
            if(!check_credit_employee_record.status || check_credit_employee_record.error) 
                throw new Error(check_credit_employee_record.error);

            // Store available leave credit
            const available_credit = Number(check_credit_employee_record.result.total_latest_credit);
    
            // Employee has zero or negative credit
            if(available_credit <= NUMBER.zero) 
                throw new Error(`No credit available: ${available_credit} for this days.`);
    
            // Check requested leave vs available credit
            if(duration > available_credit) 
                throw new Error(`Insufficient leave credit. Available: ${available_credit} days.`);

            // Insert leave transaction into database
            const leave_transaction_data = await leaveTransaction.insertTransaction({employee_id, leave_type_id: leave_type, rewarded_by_id, start_date,end_date: adjusted_end_date,reason,total_leave: duration,leave_transaction_status_id: LEAVE_TRANSACTION_STATUS.pending,is_weekend: IS_WEEKEND.no,is_active: IS_ACTIVE.yes,filed_date: new Date(),year});

            // Validate transaction insert
            if(!leave_transaction_data.status || leave_transaction_data.error){
                throw new Error(leave_transaction_data.error);
            } 
                
            return res.json({ success: true, message: "Leave successfully filed." });
        } 
        catch(error){
            return res.json({ success: false, message: error.message || "Server error in controller" });
        } 
    } 


>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06

    /**
     * Allows an employee to file a leave request for themselves.
     * Validates leave type, employee gender, available leave credit, overlapping leaves, and duration.
     * @param {Object} req - Express request object containing session and body (leave details).
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response indicating success or failure of leave filing.
     * Last Updated At: October 1, 2025
     * @author Keith
     */
<<<<<<< HEAD
    async applyEmployeeLeave(req, res) {
        try {
            /* Get logged-in employee information */
            const user = getUserFromSession(req);
            const employee_id = user.employee_id;
            const { leave_type, start_date, end_date, reason } = req.body;
=======
    static async applyEmployeeLeave(req, res){

        try{
            const employee_id = req.employee_id;
            const { leave_type, start_date, end_date, reason } = req.body;
            const leave_type_id_record = await leaveType.getLeaveTypeById(Number(leave_type));
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
    
            /* Fetch leave type */
            const leave_type_record = await this.leaveTypeModel.getAllLeaveId(leave_type);
    
            if(!leave_type_record.status){
                throw new Error(leave_type_record.error);
            }
    
            const leave_types = leave_type_record.result;
    
<<<<<<< HEAD
            /* Fetch employee record */
            const employee_record = await this.employeeModel.getEmployeeId({employee_id});
    
            if(!employee_record.status){
                throw new Error(employee_record.error);
            }
            
            /* Check gender eligibility */
            const employee_gender_id = Number(employee_record.result.employee_gender_id);
            const leave_type_gender_id = Number(leave_types.gender_id);
    
            /* Use both_gender constant */
            if(leave_type_gender_id !== GENDER_TYPE_ID.both_gender && leave_type_gender_id !== employee_gender_id){
                throw new Error("This leave type is not allowed for your gender.");
            }
    
            /* Validate leave application dates and duration */
            const validation_result = await this.timeValidationHelper.validateLeaveApplication({ 
                employee_id, 
                leave_type_data: leave_types, 
                start_date, 
                end_date, 
                reason
            });
            
            if(!validation_result.status){
                throw new Error(validation_result.error);
=======
            // Perform detailed leave validation (e.g., overlapping dates, policy rules)
            const validation_result = await timeValidation.validateLeaveApplication({employee_id, leave_type_data, start_date, end_date, reason: reason.trim()});

            // Return validation error if leave is not valid
            if(!validation_result.is_valid){
                return res.json({ success: false, message: validation_result.message });
            }
    
            // Get employee's available leave credit
            const employee_credit_data = await leaveTransaction.getTotalCredit(employee_id);
    
            // Validate if employee credit data is fetched properly
            if(!employee_credit_data.status || !employee_credit_data.result || employee_credit_data.error){
                throw new Error(employee_credit_data.error);
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
            }
    
            /* Check for overlapping leave records */
            const overlapping_date_record = await this.leaveTransactionModel.checkDateOverLapping( employee_id, start_date, validation_result.adjusted_end_date );
            
            if(overlapping_date_record.status){
                throw new Error("Employee has overlapping leave");
            }
    
            /* Get employee’s available leave credit */
            const employee_credit_data = await this.leaveCreditModel.latestCredit( employee_id, leave_type );
            const available_credit = employee_credit_data.status ? Number( employee_credit_data.result.total_earned_credit ) : NUMBER.zero;
    
            if(available_credit <= NUMBER.zero){
                throw new Error(`Cannot apply leave: no available earned credit. Available: ${available_credit} days`);
            }
            
            if(validation_result.duration > available_credit){
                throw new Error(`Insufficient earned credit. Requested: ${validation_result.duration} days, Available: ${available_credit} days`);
            }
    
<<<<<<< HEAD
            const employee_transaction = {
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
            }
            /* Insert new leave transaction record */
            const employee_transaction_record = await this.leaveTransactionModel.insertEmployeeTransaction(employee_transaction);
    
            if(!employee_transaction_record.status){
                throw new Error(employee_transaction_record.error);
=======
            // Insert leave transaction into the database
            const employee_transaction_record = await leaveTransaction.insertTransaction({employee_id,leave_type_id: leave_type, rewarded_by_id: null, start_date,end_date: validation_result.adjusted_end_date, reason: reason,total_leave: validation_result.duration,leave_transaction_status_id: LEAVE_TRANSACTION_STATUS.pending,is_weekend: IS_WEEKEND.no,is_active: IS_ACTIVE.yes,filed_date: new Date(),year: new Date().getFullYear()});
    
            // Validate if leave transaction was inserted successfully
            if (!employee_transaction_record.status || employee_transaction_record.error) {
                throw new Error(employee_transaction_record.error); 
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
            }
    
            return res.json({ status: true, result: employee_transaction_record.result });
    
<<<<<<< HEAD
        } 
        catch(error){
            return res.json({ status: false, error: error.message });
        }
=======
    /**
     * Retrieves all employees and interns from the database.
     * @param {Object} req - Express request object (not used in this method).
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response containing employees and interns or an error.
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 01:50 PM
     */
    static async getAllEmployeeAndIntern(req, res){
        const get_all_employee_intern_record = await employee.getAllEmployeeAndIntern();
        return res.json({ success: true, data: get_all_employee_intern_record.result });
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
    }

<<<<<<< HEAD

    
}

export default new LeaveController();
=======
    /**
     * Retrieves the latest leave credit for the currently logged-in employee.
     * @param {Object} req - Express request object containing employee session data.
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response with success status and latest leave credit (if available).
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 01:57 PM
     */
    static async getLatestCredit(req, res){
        const employee_id =  req.employee_id;
        const employee_credit_record = await leaveCredit.getLatestEmployeeLeaveCredit(employee_id);
        return res.json({success: true, latest_credit: parseFloat(employee_credit_record.result)});
    }
}

export default LeaveFile;
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
