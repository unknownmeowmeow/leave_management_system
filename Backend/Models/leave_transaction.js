import db from "../config/database.js";
import {
<<<<<<< HEAD
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
    async insertEmployeeTransaction(employee_transaction, connection = this.db) {
        const response_data = { status: false, result: null, error: null };
    
        try {
            const [insert_transaction] = await connection.query(`
                INSERT INTO leave_transactions SET ?
            `, [employee_transaction]);
    
=======
      NUMBER
} from "../constant/constants.js"

class LeaveTransaction{

    /**
     * Inserts a new leave transaction record into the database.
     * @param {Object} params - Parameters for the leave transaction.
     * @param {number} params.employee_id - ID of the employee filing the leave.
     * @param {number} params.leave_transaction_status_id - Status ID of the leave transaction.
     * @param {number} params.leave_type_id - Type of leave.
     * @param {string} params.reason - Reason for the leave.
     * @param {number} params.total_leave - Total leave days/hours requested.
     * @param {number} [params.is_weekend=0] - Indicates if leave includes weekend days.
     * @param {number} [params.is_active=1] - Indicates if the transaction is active.
     * @param {string|Date} params.start_date - Leave start date.
     * @param {string|Date} params.end_date - Leave end date.
     * @param {Date} [params.filed_date=new Date()] - Date when leave was filed.
     * @param {number} params.year - Year of the leave transaction.
     * @param {number|null} [params.rewarded_by_id=null] - ID of the user who rewarded the leave, if applicable.
     * @param {number|null} [params.approved_by_id=null] - ID of the user who approved the leave, if applicable.
     * @returns {Promise<{status: boolean, result: Object|null, error: string|null}>} Response object containing status, inserted ID or error message.
     * created by: Rogendher Keith Lachica
     * updated at: September 25 2025 3:00 am
     */
    static async insertTransaction(insert_transaction_data){
        const response_data = { status: false, result: null, error: null };
        const { employee_id, leave_transaction_status_id, leave_type_id, reason, total_leave, is_weekend = NUMBER.zero,is_active = NUMBER.one, start_date, end_date, filed_date = new Date(), year, rewarded_by_id = null, approved_by_id = null} = insert_transaction_data;

        try{
            const [insert_transaction] = await db.execute(`
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
                    approved_by_id,
                    created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            `, [ employee_id, leave_transaction_status_id, leave_type_id, reason, total_leave, is_weekend, is_active, start_date, end_date, filed_date, year, rewarded_by_id,  approved_by_id ]);
            
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
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
<<<<<<< HEAD
     * @returns {Promise<Object>} response_data - Contains status, result, or error.
     * Last Updated At: September 25, 2025
     * @author Keith
=======
     * @returns {Promise<{status: boolean, result: Object|null, error: string|null}>} Response object containing status, result, or error.
     * created by: Rogendher Keith Lachica
     * updated at: September 25 2025 2:00 am
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
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
<<<<<<< HEAD
=======

    /**
     * Retrieves the aggregated leave credit summary for a specific employee.
     * @param {number} employee_id - The ID of the employee to get leave credit totals for.
     * @returns {Promise<{status: boolean, result: Array<Object>|null, error: string|null}>} Response object containing status, results, or error.
     * created by: Rogendher Keith Lachica
     * updated at: September 25 2025 1:30 am
     */
    static async getTotalCredit(employee_id){
        const response_data = { status: false, result: null, error: null };
        
        try{
            const [get_total_employee_credit] = await db.execute(`
                SELECT
                    leave_credits.employee_id,
                    employees.first_name,
                    employees.last_name,
                    employees.employee_role_type_id,
                    SUM(leave_credits.earned_credit) AS total_earned_credit,
                    SUM(leave_credits.used_credit) AS total_used_credit,
                    SUM(leave_credits.deducted_credit) AS total_deducted_credit,
                    SUM(leave_credits.latest_credit) AS total_latest_credit
                FROM leave_credits
                LEFT JOIN employees ON leave_credits.employee_id = employees.id
                WHERE leave_credits.employee_id = ?
                GROUP BY leave_credits.employee_id
                ORDER BY leave_credits.employee_id DESC
            `, [employee_id]);
            
            if(get_total_employee_credit.length){
                response_data.status = true;
                response_data.result = get_total_employee_credit[0];
            } 
            else{
                response_data.error = "No leave credit found for employee in leave transaction models.";
            }        
        } 
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }

    /**
    * Retrieves the most recent leave credit record for a specific employee.
    * @param {number} employee_id - The ID of the employee whose latest leave credit is requested.
    * @returns {Promise<{status: boolean, result: Object|null, error: string|null}>} Response object with status, result, or error.
    * created by: Rogendher Keith Lachica
    * updated at: September 25 2025 1:15 am
    */
    static async getLatestCreditRecord(employee_id){
        const response_data = { status: false, result: null, error: null };
    
    
        try{
            const [get_latest_employee_credit] = await db.execute(`
                SELECT id
                FROM leave_credits
                WHERE employee_id = ?
                ORDER BY created_at DESC
                LIMIT ${NUMBER.one}
            `, [employee_id]);
    
            if(get_latest_employee_credit.length){
                response_data.status = true;
                response_data.result = get_latest_employee_credit[0];
            } 
            else{
                response_data.error = "No latest credit record found in model."; 
            }
        } 
        catch(error){
            response_data.error = error.message;
        }
    
        return response_data;
    }
    

    /**
     * Deducts leave credits from an employee's leave credit record.
     * @param {number} credit_id - The ID of the leave credit record to update.
     * @param {number} total_leave - The amount of leave credit to deduct.
     * @param {Object} [connection=db] - Optional database connection.
     * @returns {Promise<Object>} Response object with status, result, or error message.
     * created by: Rogendher Keith Lachica
     * updated at: September 25 2025 1:00 am
     */
    static async deductCredit( deduct_credit_data, connection = db){
        const response_data = { status: false, result: null, error: null };
        const { credit_id, total_leave} = deduct_credit_data;

        try{
            const [deduct_leave_credit] = await connection.execute(`
                UPDATE leave_credits
                SET 
                    used_credit = used_credit + ?,
                    deducted_credit = deducted_credit + ?,
                    latest_credit = latest_credit - ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `, [total_leave, total_leave, total_leave, credit_id]);
            
            if(deduct_leave_credit.affectedRows){
                response_data.status = true;
                response_data.result = { credit_id, deducted: total_leave };
            }            
            else{
                response_data.error = "Leave credit record not found or deduction failed in model.";
               
            }
    
        } 
        catch(error){
            response_data.error = error.message;
        }
    
        return response_data;
    }    
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
    
    /**
     * Updates the status of a leave transaction.
     * @param {number} leave_id - The ID of the leave transaction to update.
     * @param {number} status_id - The new status ID to set.
     * @param {number} approver_id - The ID of the approver making the update.
<<<<<<< HEAD
     * @returns {Promise<Object>} response_data - Contains status, result, or error.
     * Last Updated At: September 25, 2025
     * @author Keith
     */
    async updateLeaveStatus(update_leave_status, connection = this.db){
        const response_data = { status: false, result: null, error: null };
        const { leave_id, status_id, approver_id } = update_leave_status;
=======
     * @param {Object} [connection=db] - Optional database connection.
     * @returns {Promise<Object>} Response with status, result, or error.
     * created by: Rogendher Keith Lachica
     * updated at: September 25 2025 12:45 am
     */
    static async updateStatus(update_status_data, connection = db){
        const response_data = { status: false, result: null, error: null };
        const { leave_id, status_id, approver_id } = update_status_data;
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06

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
     * @param {number} check_overlap_date - The ID of the employee to check.
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
            `, [ employee_id, LEAVE_TRANSACTION_STATUS.rejected, LEAVE_TRANSACTION_STATUS.cancelled, end_date, start_date ]);

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
<<<<<<< HEAD
export default new leaveTransactionModel();
=======
export default LeaveTransaction;
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
