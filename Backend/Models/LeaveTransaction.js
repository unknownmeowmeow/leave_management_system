import db from "../Configs/Database.js";
import {
    ZERO, ONE, LIMIT
} from "../Constant/Constants.js"

class leaveTransactionModel {

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
    static async insertTransaction({ employee_id, leave_transaction_status_id, leave_type_id, reason, total_leave, is_weekend = ZERO,
        is_active = ONE, start_date, end_date, filed_date = new Date(), year, rewarded_by_id = null, approved_by_id = null}){
        const response_data = { status: false, result: null, error: null };
    
        try{
            const [insert_result] = await db.execute(`
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
                    created_at,
                    updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
            `, [employee_id,leave_transaction_status_id,leave_type_id,reason,total_leave,is_weekend,is_active,start_date,end_date,filed_date,year,rewarded_by_id,approved_by_id]);
            
            if(!insert_result.insertId){
                response_data.error = "Insert failed in model.";
            } 
            else{
                response_data.status = true;
                response_data.result = { leave_id: insert_result.insertId };
            }
        } 
        catch(error){
            response_data.error = { success: false, message: "Leave ID and status required in model." };
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

            if (!get_all_leave_transaction_result.length) {
                response_data.status = false;
                response_data.error = "Leave transaction not found.";
            }
            else{
                response_data.status = true;
                response_data.result = get_all_leave_transaction_result[0];
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
        static async getTotalCredit(employee_id) {
            const response_data = { status: false, result: null, error: null };

            try {
                const [get_total_credit_result] = await db.execute(`
                    SELECT SUM(latest_credit) as total_credit
                    FROM leave_credits
                    WHERE employee_id = ?
                `, [employee_id]);

                response_data.status = true;
                response_data.result = get_total_credit_result[0].total_credit || ZERO;
            } catch (error) {
                response_data.status = false;
                response_data.error = error.message;
            }
            return response_data;
        }

    /**
     * Get latest leave credit record for deduction.
     *
     * @param {number} employee_id
     * @returns {Promise<{status: boolean, result: Object|null, error: string|null}>}
     */
    static async getLatestCreditRecord(employee_id) {
        const response_data = { status: false, result: null, error: null };
        try {
            const [get_latest_credit_record_result] = await db.execute(`
                SELECT id, latest_credit, used_credit, deducted_credit
                FROM leave_credits
                WHERE employee_id = ? AND latest_credit > ${ZERO}
                ORDER BY created_at DESC
                LIMIT ${LIMIT}
            `, [employee_id]);

            if(!get_latest_credit_record_result.length){
                response_data.status = false;
                response_data.error = "No latest credit record found.";
            } 
            else{
                response_data.status = true;
                response_data.result = get_latest_credit_record_result[0];
            }
        } 
        catch(error){
            response_data.status = false;
            response_data.error = error.message;
        }
        return response_data;
    }

    /**
     * Deduct leave credit after approval.
     *
     * @param {number} credit_id
     * @param {number} total_leave
     * @returns {Promise<{status: boolean, result: Object|null, error: string|null}>}
     */
    static async deductCredit(credit_id, total_leave){
        const response_data =  { status: false, result: null, error: null };

        try{
            const [deducted_credit_result] = await db.execute(`
                UPDATE leave_credits
                SET deducted_credit = deducted_credit + ?,
                    used_credit = used_credit + ?,
                    latest_credit = latest_credit - ?
                WHERE id = ?
                LIMIT ${LIMIT}
            `, [total_leave, total_leave, total_leave, credit_id]);

            if(deducted_credit_result.affectedRows === 0){
                response_data.status = false;
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
     * Update leave transaction status.
     *
     * @param {number} leave_id
     * @param {number} status_id
     * @returns {Promise<{status: boolean, result: Object|null, error: string|null}>}
     */
    static async updateStatus(leave_id, status_id){
        const response_data =  { status: false, result: null, error: null };

        try{
            const [update_status_result] = await db.execute(`
                UPDATE leave_transactions
                SET leave_transaction_status_id = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `, [status_id, leave_id]);

            if(update_status_result.affectedRows === 0){
                response_data.status = false;
                response_data.error =  "Leave transaction not found or status unchanged in model.";
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
