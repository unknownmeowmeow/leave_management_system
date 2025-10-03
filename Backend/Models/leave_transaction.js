import db from "../Configs/database.js";
import {
      NUMBER
} from "../Constant/constants.js"

class leaveTransactionModel{

    /**
     * Inserts a new leave transaction record into the database.
     *
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
     * 
     * @returns {Promise<{status: boolean, result: Object|null, error: string|null}>} Response object containing status, inserted ID or error message.
     * 
     * created by: Rogendher Keith Lachica
     * updated at: September 25 2025 3:00 am
     */
    static async insertTransaction({ employee_id, leave_transaction_status_id, leave_type_id, reason, total_leave, is_weekend = NUMBER.zero,is_active = NUMBER.one, start_date, end_date, filed_date = new Date(), year, rewarded_by_id = null, approved_by_id = null}){
        const response_data = { status: false, result: null, error: null };
    
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
            
            if(insert_transaction.insertId){
                response_data.status = true;
                response_data.result = { leave_id: insert_transaction.insertId };
            } 
            else{
                response_data.error = "Insert failed in model.";
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
     * @returns {Promise<{status: boolean, result: Object|null, error: string|null}>} Response object containing status, result, or error.
     *
     * created by: Rogendher Keith Lachica
     * updated at: September 25 2025 2:00 am
     */
    static async getLeaveTransactionById(leave_id){
        const response_data =  { status: false, result: null, error: null };

        try {
            const [get_transaction_credit] = await db.execute(`
                SELECT 
                    id, 
                    employee_id, 
                    total_leave, 
                    leave_transaction_status_id
                FROM leave_transactions
                WHERE id = ?
            `, [leave_id]);

            if(get_transaction_credit.length){
                response_data.status = true;
                response_data.result = get_transaction_credit[0];
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
     * Retrieves the aggregated leave credit summary for a specific employee.
     * @param {number} employee_id - The ID of the employee to get leave credit totals for.
     * @returns {Promise<{status: boolean, result: Array<Object>|null, error: string|null}>} Response object containing status, results, or error.
     *
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
    *
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
     *
     * created by: Rogendher Keith Lachica
     * updated at: September 25 2025 1:00 am
     */
    static async deductCredit(credit_id, total_leave, connection = db){
        const response_data = { status: false, result: null, error: null };
    
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
    
    /**
     * Updates the status of a leave transaction.
     * @param {number} leave_id - The ID of the leave transaction to update.
     * @param {number} status_id - The new status ID to set.
     * @param {number} approver_id - The ID of the approver making the update.
     * @param {Object} [connection=db] - Optional database connection.
     * @returns {Promise<Object>} Response with status, result, or error.
     *
     * created by: Rogendher Keith Lachica
     * updated at: September 25 2025 12:45 am
     */
    static async updateStatus(leave_id, status_id, approver_id, connection = db){
        const response_data = { status: false, result: null, error: null };
    
        try{
            const [update_leave_status] = await connection.execute(`
                UPDATE leave_transactions
                SET 
                    leave_transaction_status_id = ?, 
                    approved_by_id = ?, 
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `, [status_id, approver_id, leave_id]);
    
            if(update_leave_status.affectedRows){
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
    

}
export default leaveTransactionModel;
