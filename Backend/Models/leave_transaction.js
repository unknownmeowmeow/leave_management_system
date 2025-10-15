import db from "../Configs/database.js";
import {
      NUMBER, LEAVE_TRANSACTION_STATUS,
      IS_WEEKEND,
      IS_ACTIVE
} from "../Constant/constants.js"

class leaveTransactionModel{
    constructor(connection = db){
        this.db = connection;
    }
     
    /**
     * Inserts a new leave transaction record into the database.
     * @param {Object} employee_leave_data - Parameters for the leave transaction.
     * @returns {Promise<Object>} response_data - Contains status, inserted ID, or error.
     * Last Updated At: September 25, 2025
     * @author Keith
     */
    async insertEmployeeTransaction(employee_leave_data, connection = this.db){
        const response_data = { status: false, result: null, error: null };
        const { employee_id, leave_transaction_status_id, leave_type_id, reason, total_leave, is_weekend = IS_WEEKEND.no,
            is_active = IS_ACTIVE.yes, start_date, end_date, filed_date = new Date(), year, rewarded_by_id = null, approved_by_id = null} = employee_leave_data;

        try{
            const [insert_transaction] = await connection.execute(`
                INSERT INTO leave_transactions (
                    employee_id,
                    leave_transaction_status_id,
                    leave_type_id,
                    reason,
                    total_leave,
                    is_weekend,
                    is_active,
                    start_date,
                    end_date,
                    filed_date,
                    year,
                    rewarded_by_id,
                    approved_by_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [ employee_id, leave_transaction_status_id, leave_type_id, reason, total_leave, is_weekend,
                is_active, start_date, end_date, filed_date, year, rewarded_by_id, approved_by_id]);
    
            if(insert_transaction.insertId){
                response_data.status = true;
                response_data.result = { leave_id: insert_transaction.insertId };
            } 
            else{
                response_data.error = "Insert transaction failed.";
            }
    
        } 
        catch(error){
            response_data.error = error.message;
        }
    
        return response_data;
    }
    
     /**
     * Retrieves a leave transaction record by its ID.
     * @param {number} leave_id - The unique identifier of the leave transaction.
     * @returns {Promise<Object>} response_data - Contains status, result, or error.
     * Last Updated At: September 25, 2025
     * @author Keith
     */
     async getLeaveTransactionId(leave_id){
        const response_data =  { status: false, result: null, error: null };

        try {
            const [get_transaction_credit] = await this.db.execute(`
                SELECT *
                FROM leave_transactions
                WHERE id = ?
            `, [leave_id]);

            if(get_transaction_credit.length){
                response_data.status = true;
                response_data.result = get_transaction_credit[NUMBER.zero];
            }
            else{
                response_data.error = "Leave transaction not found.";
            }
        }
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }
    
    /**
     * Updates the status of a leave transaction.
     * @param {number} leave_id - The ID of the leave transaction to update.
     * @param {number} status_id - The new status ID to set.
     * @param {number} approver_id - The ID of the approver making the update.
     * @returns {Promise<Object>} response_data - Contains status, result, or error.
     * Last Updated At: September 25, 2025
     * @author Keith
     */
    async updateLeaveStatus(update_leave_status, connection = this.db){
        const response_data = { status: false, result: null, error: null };
        const { leave_id, status_id, approver_id } = update_leave_status;

        try{
            const [update_leave_status_result] = await connection.execute(`
                UPDATE leave_transactions
                SET 
                    leave_transaction_status_id = ?, 
                    approved_by_id = ?
                WHERE id = ?
            `, [status_id, approver_id, leave_id]);
    
            if(update_leave_status_result.affectedRows){
                response_data.status = true;
                response_data.result = { leave_id, status_id };
            } 
            else{
                response_data.error = "Leave transaction not found or status unchanged.";
            }
        } 
        catch(error){
            response_data.error = error.message;
        }
    
        return response_data;
    }
    
    /**
     * Checks if an employee has an existing leave that overlaps with the given date range.
     * @param {number} employee_id - The ID of the employee to check.
     * @param {string} start_date - The start date of the leave.
     * @param {string} end_date - The end date of the leave.
     * @returns {Promise<Object>} response_data - Contains status, result, or error.
     * Last Updated At: October 8, 2025
     * @author Keith
     */
    async checkDateOverLapping(check_overlap_date){
        const response_data = { status: false, result: null, error: null };
        const { employee_id, start_date, end_date } = check_overlap_date;
        
        try{
            const [check_overlapping_leave] = await this.db.execute(`
                SELECT *
                FROM leave_transactions
                WHERE employee_id = ?
                AND leave_transaction_status_id NOT IN (?, ?)
                AND (start_date < ? AND end_date > ?)
                ORDER BY id DESC
            `, [employee_id, LEAVE_TRANSACTION_STATUS.rejected, LEAVE_TRANSACTION_STATUS.cancelled, end_date, start_date ]);

            if(check_overlapping_leave.length){
                response_data.status = true;
                response_data.result = check_overlapping_leave[NUMBER.zero];
            } 
            else{
                response_data.error = "No Existing Date Filled in this Date";
            }
        }
        catch(error){
            response_data.error = error.message;
        }
        return response_data;
    }  
    
    /**
    * Retrieves all leave transactions for a specific employee.
    * @param {number} employee_id - The ID of the employee to filter leave transactions.
    * @returns {Promise<Object>} - Response containing status, result (array of leave transactions), or error.
    * Last Updated At: October 2, 2025
    * @author Keith
    */
    async getEmployeeTransaction(employee_id){
        const response_data = { status: false, result: null, error: null };
    
        try{
            const [get_transaction_by_id] = await this.db.execute(`
                SELECT 
                    leave_transactions.id,
                    CONCAT(employees.first_name, ' ', employees.last_name) AS employee_name,
                    leave_types.name AS leave_type,
                    leave_type_grant_types.name AS grant_type_name, 
                    leave_transactions.start_date,
                    leave_transactions.end_date,
                    leave_transactions.reason,
                    leave_transactions.total_leave,
                    leave_transaction_statuses.name AS status,
                    CONCAT(rewarder.first_name, ' ', rewarder.last_name) AS rewarded_by,
                    CONCAT(approver.first_name, ' ', approver.last_name) AS approved_by
                FROM leave_transactions
                INNER JOIN employees ON employees.id = leave_transactions.employee_id
                INNER JOIN leave_types ON leave_types.id = leave_transactions.leave_type_id
                INNER JOIN leave_type_grant_types ON leave_type_grant_types.id = leave_types.leave_type_grant_type_id
                LEFT JOIN leave_transaction_statuses ON leave_transaction_statuses.id = leave_transactions.leave_transaction_status_id
                LEFT JOIN employees AS rewarder ON rewarder.id = leave_transactions.rewarded_by_id
                LEFT JOIN employees AS approver ON approver.id = leave_transactions.approved_by_id
                WHERE leave_transactions.employee_id = ?
                ORDER BY leave_transactions.id DESC;
            `, [employee_id]);
    
            if(get_transaction_by_id.length){
                response_data.status = true;
                response_data.result = get_transaction_by_id; 
            } 
            else{
                response_data.error = "No leave transactions Found for employee.";
            }
        } 
        catch(error){
            response_data.error = error.message;
        }
    
        return response_data;
    }

    /**
    * Retrieves all leave transactions from all employees that are not yet rewarded.
    * @returns {Promise<Object>} - Response containing status, result (array of leave transactions), or error.
    * Last Updated At: October 2, 2025
    * @author Keith
    */
    async getAllDefaultLeaveTransaction(){
        const response_data = { status: false, result: null, error: null };
    
        try{
            const [get_all_employee_transaction] = await this.db.execute(`
                SELECT 
                    leave_transactions.id,
                    CONCAT(employees.first_name, ' ', employees.last_name) AS employee_name,
                    leave_types.name AS leave_type,
                    leave_type_grant_types.name AS grant_type_name, 
                    leave_transactions.start_date,
                    leave_transactions.end_date,
                    leave_transactions.total_leave,
                    leave_transactions.reason,
                    leave_transaction_statuses.name AS status,
                    CONCAT(rewarder.first_name, ' ', rewarder.last_name) AS rewarded_by,
                    CONCAT(approver.first_name, ' ', approver.last_name) AS approved_by
                FROM leave_transactions
                INNER JOIN employees ON employees.id = leave_transactions.employee_id
                INNER JOIN leave_types ON leave_types.id = leave_transactions.leave_type_id
                INNER JOIN leave_type_grant_types ON leave_type_grant_types.id = leave_types.leave_type_grant_type_id
                LEFT JOIN leave_transaction_statuses ON leave_transaction_statuses.id = leave_transactions.leave_transaction_status_id
                LEFT JOIN employees AS rewarder ON rewarder.id = leave_transactions.rewarded_by_id
                LEFT JOIN employees AS approver ON approver.id = leave_transactions.approved_by_id
                WHERE leave_transactions.rewarded_by_id IS NULL
                ORDER BY leave_transactions.id DESC;
            `);
    
            if(get_all_employee_transaction.length){
                response_data.status = true;
                response_data.result = get_all_employee_transaction;
            } 
            else{
                response_data.error = "No leave transactions Found for admin.";
            }
        } 
        catch(error){
            response_data.error = error.message;
        }
    
        return response_data;
    }

    /**
    * Retrieves all leave transactions from all employees that have been rewarded.
    * @returns {Promise<Object>} - Response containing status, result (array of leave transactions), or error.
    * Last Updated At: October 2, 2025
    */
    async getAllRewardedEmployeeLeaveTransaction(){
        const response_data = { status: false, result: null, error: null };
    
        try{
            const [get_all_employee_transaction] = await this.db.execute(`
                SELECT 
                    leave_transactions.id,
                    CONCAT(employees.first_name, ' ', employees.last_name) AS employee_name,
                    leave_types.name AS leave_type,
                    leave_type_grant_types.name AS grant_type_name, 
                    leave_transactions.start_date,
                    leave_transactions.end_date,
                    leave_transactions.total_leave,
                    leave_transactions.reason,
                    leave_transaction_statuses.name AS status,
                    CONCAT(rewarder.first_name, ' ', rewarder.last_name) AS rewarded_by,
                    CONCAT(approver.first_name, ' ', approver.last_name) AS approved_by
                FROM leave_transactions
                INNER JOIN employees ON employees.id = leave_transactions.employee_id
                INNER JOIN leave_types ON leave_types.id = leave_transactions.leave_type_id
                INNER JOIN leave_type_grant_types ON leave_type_grant_types.id = leave_types.leave_type_grant_type_id
                LEFT JOIN leave_transaction_statuses ON leave_transaction_statuses.id = leave_transactions.leave_transaction_status_id
                LEFT JOIN employees AS rewarder ON rewarder.id = leave_transactions.rewarded_by_id
                LEFT JOIN employees AS approver ON approver.id = leave_transactions.approved_by_id
                WHERE leave_transactions.rewarded_by_id IS NOT NULL
                ORDER BY leave_transactions.id DESC;
            `);     
    
            if(get_all_employee_transaction.length){
                response_data.status = true;
                response_data.result = get_all_employee_transaction;
            } 
            else{
                response_data.error = "No leave transactions Found for admin.";
            }
        } 
        catch(error){
            response_data.error = error.message;
        }
    
        return response_data;
    }


    /**
    * Retrieves all leave transactions for a specific employee filtered by status.
    * @param {number} employee_id - The ID of the employee to filter leave transactions.
    * @param {number} [status=2] - The status ID to filter leave transactions (default is 2).
    * @returns {Promise<Object>} - Response containing status, result (array of leave transactions), or error.
    * Last Updated At: October 2, 2025
    * @author Keith
    */
    async getAllEmployeeLeave(){
        const response_data =  { status: false, result: null, error: null };
    
        try{
            const [get_all_employee_record] = await this.db.execute(`
                SELECT 
                    leave_transactions.id,
                    CONCAT(employees.first_name, ' ', employees.last_name) employee_name,
                    leave_types.name leave_type,
                    leave_type_grant_types.name AS grant_type_name,
                    leave_transactions.start_date,
                    leave_transactions.end_date,
                    leave_transactions.reason,
                    leave_transactions.total_leave,
                    leave_transaction_statuses.name status,
                    CONCAT(rewarded.first_name, ' ', rewarded.last_name) rewarded_by,
                    CONCAT(approved.first_name, ' ', approved.last_name) approved_by
                FROM leave_transactions
                INNER JOIN employees ON employees.id = leave_transactions.employee_id
                INNER JOIN leave_types ON leave_types.id = leave_transactions.leave_type_id
                INNER JOIN leave_type_grant_types ON leave_type_grant_types.id = leave_types.leave_type_grant_type_id
                LEFT JOIN leave_transaction_statuses ON leave_transaction_statuses.id = leave_transactions.leave_transaction_status_id
                LEFT JOIN employees rewarded ON rewarded.id = leave_transactions.rewarded_by_id
                LEFT JOIN employees approved ON approved.id = leave_transactions.approved_by_id
                ORDER BY leave_transactions.id DESC;
            `,[LEAVE_TRANSACTION_STATUS.pending]);
    
            if(get_all_employee_record.length){
                response_data.status = true;
                response_data.result = get_all_employee_record;
            } 
            else{
                response_data.error = "No leave transactions Found.";
            }
        } 
        catch(error){
            response_data.error = error.message;
        }
    
        return response_data;
    } 
}
export default new leaveTransactionModel();
