import db from "../Configs/database.js";
import {
      NUMBER
} from "../Constant/constants.js"

class leaveTransactionModel{

    /**
     * Insert a new leave transaction record.
     *
     * @param {Object} params
     * @param {number} params.employee_id
     * @param {number} params.leave_transaction_status_id
     * @param {number} params.leave_type_id
     * @param {string} params.reason
     * @param {number} params.total_leave
     * @param {number} [params.is_weekend=0]
     * @param {number} [params.is_active=1]
     * @param {string|Date} params.start_date
     * @param {string|Date} params.end_date
     * @param {Date} [params.filed_date=new Date()]
     * @param {number} params.year
     * @param {number|null} [params.rewarded_by_id=null]
     * @param {number|null} [params.approved_by_id=null]
     * @returns {Promise<{status: boolean, result: Object|null, error: string|null}>}
     * created by: Rogendher Keith Lachica
     * updated at: September 26 2025 10:40 am
     */
    static async insertTransaction({ employee_id, leave_transaction_status_id, leave_type_id, reason, total_leave, is_weekend = NUMBER.zero,
        is_active = NUMBER.one, start_date, end_date, filed_date = new Date(), year, rewarded_by_id = null, approved_by_id = null}){
        const response_data = { status: false, result: null, error: null };
    
        try{
            const [insert_data_result] = await db.execute(`
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
            `, [ employee_id, leave_transaction_status_id, leave_type_id, reason, total_leave, is_weekend, is_active, start_date, end_date, filed_date, year, rewarded_by_id,  approved_by_id]);
            
            if(!insert_data_result.insertId){
                response_data.error = "Insert failed in model.";
            } 
            else{
                response_data.status = true;
                response_data.result = { leave_id: insert_data_result.insertId };
            }
        } 
        catch(error){
            response_data.status = false;
            response_data.error = error.message;
        }
    
        return response_data;
    }
    
    /**
     * Get leave transaction by its ID.
     *
     * @param {number} leave_id
     * @returns {Promise<{status: boolean, result: Object|null, error: string|null}>}
     * created by: Rogendher Keith Lachica
     * updated at: September 26 2025 10:41 am
     */
    static async getLeaveTransactionById(leave_id){
        const response_data =  { status: false, result: null, error: null };

        try {
            const [get_all_leave_transaction_result] = await db.execute(`
                SELECT id, employee_id, total_leave, leave_transaction_status_id
                FROM leave_transactions
                WHERE id = ?
            `, [leave_id]);

            if(!get_all_leave_transaction_result.length){
                response_data.error = "Leave transaction not found.";
            }
            else{
                response_data.status = true;
                response_data.result = get_all_leave_transaction_result[NUMBER.zero];
            }
        }
        catch(error){
            response_data.status = false;
            response_data.error = error.message;
        }
        return response_data;
    }

    /**
     * Get total leave credit of an employee.
     *
     * @param {number} employee_id
     * @returns {Promise<{status: boolean, result: number|null, error: string|null}>}
     * created by: Rogendher Keith Lachica
     * updated at: September 29 2025
     */
    static async getTotalCredit(employee_id){
        const response_data = { status: false, result: null, error: null };
        
        try{
            const [get_total_credit_result] = await db.execute(`
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
                LEFT JOIN employees 
                    ON leave_credits.employee_id = employees.id
                WHERE leave_credits.employee_id = ?
                GROUP BY leave_credits.employee_id
                ORDER BY leave_credits.employee_id DESC
            `, [employee_id]);
            
            if(!get_total_credit_result.length){
                response_data.error = "No leave credit found for employee in leave transaction models.";
            } 
            else{
                response_data.status = true;
                response_data.result = get_total_credit_result[NUMBER.zero];
            }        
        } 
        catch(error){
            response_data.status = false;
            response_data.error = error.message;
        }
        return response_data;
    }

    /**
     * Retrieves the most recent leave credit record of an employee.
     * 
     * This method queries the `leave_credits` table and fetches the latest 
     * record based on `created_at` in descending order. The result is used 
     * for validating or deducting credits in leave transactions.
     * 
     * @param {number} employee_id - Unique identifier of the employee.
     * 
     * @returns {Promise<{status: boolean, result: Object|null, error: string|null}>} 
     * Returns an object indicating the status, the latest credit record if found, 
     * or an error message.
     * 
     * created by: Rogendher Keith Lachica
     * updated at: September 30 2025 6:55 pm
     */
    static async getLatestCreditRecord(employee_id){
        const response_data = { status: false, result: null, error: null };
    
    
        try{
            const [get_latest_credit_record_result] = await db.execute(`
                SELECT id
                FROM leave_credits
                WHERE employee_id = ?
                ORDER BY created_at DESC
                LIMIT ${NUMBER.one}
            `, [employee_id]);
    
            if(!get_latest_credit_record_result.length){
                response_data.error = "No latest credit record found in model.";
            } 
            else{
                response_data.status = true;
                response_data.result = get_latest_credit_record_result[NUMBER.zero];
            }
        } 
        catch(error){
            response_data.status = false;
            response_data.error = error.message;
        }
    
        return response_data;
    }
    

    /**
     * Deducts leave credits from the employee's record after leave approval.
     * 
     * This method updates the `leave_credits` table by increasing the 
     * deducted and used credits while reducing the latest available credit. 
     * It ensures the employee’s leave balance is properly adjusted.
     * 
     * @param {number} credit_id - Identifier of the leave credit record to update.
     * @param {number} total_leave - Number of leave days to deduct.
     * @param {Object} [connection=db] - Database connection object (default: db).
     * 
     * @returns {Promise<{status: boolean, result: Object|null, error: string|null}>} 
     * Returns a response object with status, deduction result, or error details.
     * 
     * created by: Rogendher Keith Lachica
     * updated at: September 30 2025 7:05 pm
     */
    static async deductCredit(credit_id, total_leave, connection = db){
        const response_data = { status: false, result: null, error: null };
    
        try{
            const [deducted_credit_result] = await connection.execute(`
                UPDATE leave_credits
                SET deducted_credit = deducted_credit + ?,
                    used_credit = used_credit + ?,
                    latest_credit = latest_credit - ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `, [total_leave, total_leave, total_leave, credit_id]);
    
            if(deducted_credit_result.affectedRows){
                response_data.error = "Leave credit record not found or deduction failed in model.";
            } 
            else{
                response_data.status = true;
                response_data.result = { credit_id, deducted: total_leave };
            }
    
        } 
        catch(error){
            response_data.status = false;
            response_data.error = error.message;
        }
    
        return response_data;
    }    
    
    /**
     * Updates the status of a leave transaction.
     * 
     * This method modifies the `leave_transactions` table by changing the 
     * transaction status and recording the approver who performed the update. 
     * It also refreshes the `updated_at` timestamp to reflect the modification.
     * 
     * @param {number} leave_id - Identifier of the leave transaction to update.
     * @param {number} status_id - New status ID to set for the leave transaction.
     * @param {number} approver_id - Employee ID of the approver updating the record.
     * @param {Object} [connection=db] - Database connection object (default: db).
     * 
     * @returns {Promise<{status: boolean, result: Object|null, error: string|null}>} 
     * Returns a response object with operation status, updated leave details, or an error message.
     * 
     * created by: Rogendher Keith Lachica
     * updated at: September 30 2025 7:15 pm
     */
    static async updateStatus(leave_id, status_id, approver_id, connection = db){
        const response_data = { status: false, result: null, error: null };
    
        try{
            const [update_status_result] = await connection.execute(`
                UPDATE leave_transactions
                SET leave_transaction_status_id = ?, approved_by_id = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `, [status_id, approver_id, leave_id]);
    
            if(update_status_result.affectedRows === NUMBER.zero){
                response_data.error = "Leave transaction not found or status unchanged.";
            } 
            else{
                response_data.status = true;
                response_data.result = { leave_id, status_id };
            }
        } 
        catch(error){
            response_data.status = false;
            response_data.error = error.message;
        }
    
        return response_data;
    }
    

}
export default leaveTransactionModel;
