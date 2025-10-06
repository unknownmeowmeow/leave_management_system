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
            const rewarded_by_id = req.session.user.employee_id;
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



    /**
     * Allows an employee to file a leave request for themselves.
     *
     * @param {Object} req - Express request object containing session and body (leave details).
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response indicating success or failure.
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 01:35 PM
     */
    static async applyEmployeeLeave(req, res){

        try{
            const employee_id = req.session.user.employee_id;
            const { leave_type, start_date, end_date, reason } = req.body;
            const leave_type_id_record = await leaveType.getLeaveTypeById(leave_type);
    
            // Validate the fetched leave type record
            if (!leave_type_id_record.status || !leave_type_id_record.result || leave_type_id_record.error){
                throw new Error(leave_type_id_record.error);
            }
    
            const leave_type_data = leave_type_id_record.result;
    
            // Perform detailed leave validation (e.g., overlapping dates, policy rules)
            const validation_result = await timeValidation.validateLeaveApplication({employee_id, leave_type_data, start_date, end_date, reason});
    
            // Return validation error if leave is not valid
            if(!validation_result.is_valid){
                return res.json({ success: false, message: validation_result.message });
            }
    
            // Get employee's available leave credit
            const employee_credit_data = await leaveTransaction.getTotalCredit(employee_id);
    
            // Validate if employee credit data is fetched properly
            if(!employee_credit_data.status || !employee_credit_data.result || employee_credit_data.error){
                throw new Error(employee_credit_data.error);
            }
    
            const available_credit = Number(employee_credit_data.result.total_latest_credit);
    
            // Check if employee has any leave credit available
            if(available_credit <= NUMBER.zero){
                return res.json({ success: false, message: `No credit available for leave.` });
            }
    
            // Check if requested leave duration exceeds available credit
            if(validation_result.duration > available_credit){
                return res.json({success: false,message: `Insufficient leave credit. Available: ${available_credit} days.`});
            }
    
            // Insert leave transaction into the database
            const employee_transaction_record = await leaveTransaction.insertTransaction({employee_id,leave_type_id: leave_type,rewarded_by_id: null,start_date,end_date: validation_result.adjusted_end_date, reason: reason,total_leave: validation_result.duration,leave_transaction_status_id: LEAVE_TRANSACTION_STATUS.pending,is_weekend: IS_WEEKEND.no,is_active: IS_ACTIVE.yes,filed_date: new Date(),year: new Date().getFullYear()});
    
            // Validate if leave transaction was inserted successfully
            if (!employee_transaction_record.status || employee_transaction_record.error) {
                throw new Error(employee_transaction_record.error);
            }

            return res.json({ success: true, message: "Leave successfully filed." });
    
        }
        catch(error){
            return res.json({ success: false, message: error.message || "Server error in controller" });
        }
    }
    
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
    }

    /**
     * Retrieves the latest leave credit for the currently logged-in employee.
     * @param {Object} req - Express request object containing employee session data.
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response with success status and latest leave credit (if available).
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 01:57 PM
     */
    static async getLatestCredit(req, res){
        const employee_id = req.session.user.employee_id;
        const employee_credit_record = await leaveCredit.getLatestEmployeeLeaveCredit(employee_id);
        return res.json({success: true, latest_credit: parseFloat(employee_credit_record.result)});
    }
}

export default LeaveFile;
