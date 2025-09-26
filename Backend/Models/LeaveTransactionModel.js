import db from "../Configs/Database.js";
import {
    STATUS_QUERY, ZERO, ONE, ERROR_IN_UPDATE_STATUS, ERROR_IN_LEAVE_BY_ID, ERROR_IN_GET_ALL_LEAVE, ERROR_IN_INSERT,
    ERROR_IN_DEDUCT_CREDIT_MODEL
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
    static async insertTransaction({
        employee_id,
        leave_transaction_status_id,
        leave_type_id,
        reason,
        total_leave,
        is_weekend = ZERO,
        is_active = ONE,
        start_date,
        end_date,
        filed_date = new Date(),
        year,
        rewarded_by_id = null,
        approved_by_id = null
    }) {
        const response_data = { ...STATUS_QUERY };

        try{
            const [insert_transaction_result] = await db.execute(`
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
            `, [
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
            ]);

            if(!insert_transaction_result.insertId){
                response_data.status = false;
                response_data.error = ERROR_IN_INSERT;
            }
            else{
                response_data.status = true;
                response_data.result = { leave_id: insert_transaction_result.insertId };
            }
        }
        catch(error){
            response_data.status = false;
            response_data.error = ERROR_IN_INSERT_LEAVE_TRANSACTION;
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
        const response = { ...STATUS_QUERY };
        try {
            const [get_all_leave_transaction_result] = await db.execute(`
                SELECT id, employee_id, total_leave, leave_transaction_status_id
                FROM leave_transactions
                WHERE id = ?
            `, [leave_id]);

            if (!get_all_leave_transaction_result.length) {
                response.status = false;
                response.error = ERROR_IN_LEAVE_BY_ID;
            }
            else{
                response.status = true;
                response.result = get_all_leave_transaction_result[0];
            }
        }
        catch(error){
            response.status = false;
            response.error = error.message;
        }
        return response;
    }

    /**
     * Check latest leave credit of an employee.
     *
     * @param {number} employee_id
     * @returns {Promise<{status: boolean, result: Object|null, error: string|null}>}
     * created by: Rogendher Keith Lachica
     * updated at: September 26 2025 10:42 am
     */
    static async checkLatestCredit(employee_id, greater = ZERO) {
        const response = { ...STATUS_QUERY };

        try{
            const [check_latest_credit_result] = await db.execute(`
                SELECT id, SUM(latest_credit), used_credit, deducted_credit
                FROM leave_credits
                WHERE employee_id = ? AND latest_credit > ?
                ORDER BY created_at DESC
                LIMIT 1
            `, [employee_id, greater]);

            if(!check_latest_credit_result.length){
                response.status = false;
                response.error = ERROR_IN_GET_ALL_LEAVE;
            }
            else{
                response.status = true;
                response.result = check_latest_credit_result[0];
            }
        }
        catch(error){
            response.status = false;
            response.error = error.message;
        }
        return response;
    }

   /**
     * Deduct leave credit after approval.
     *
     * @param {number} credit_id
     * @param {number} total_leave
     * @returns {Promise<{status: boolean, result: Object|null, error: string|null}>}
     * created by: Rogendher Keith Lachica
     * updated at: September 26 2025 10:43 am
     */
    static async deductCredit(credit_id, total_leave){
        const response = { ...STATUS_QUERY };

        try{
            const [deducted_credit_result] = await db.execute(`
                UPDATE leave_credits
                SET deducted_credit = deducted_credit + ?,
                    used_credit = used_credit + ?,
                    latest_credit = latest_credit - ?
                WHERE id = ?
            `, [total_leave, total_leave, total_leave, credit_id]);

            if(deducted_credit_result.affectedRows === 0){
                response.status = false;
                response.error = ERROR_IN_DEDUCT_CREDIT_MODEL;
            }
            else{
                response.status = true;
                response.result = { credit_id, deducted: total_leave };
            }
        }
        catch (err) {
            response.status = false;
            response.error = err.message;
        }
        return response;
    }

    /**
     * Update leave transaction status.
     *
     * @param {number} leave_id
     * @param {number} status_id
     * @returns {Promise<{status: boolean, result: Object|null, error: string|null}>}
     * created by: Rogendher Keith Lachica
     * updated at: September 26 2025 10:44 am
     */
    static async updateStatus(leave_id, status_id){
        const response = { ...STATUS_QUERY };

        try{
            const [update_status_result] = await db.execute(`
                UPDATE leave_transactions
                SET leave_transaction_status_id = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `, [status_id, leave_id]);

            if(update_status_result.affectedRows === 0){
                response.status = false;
                response.error = ERROR_IN_UPDATE_STATUS;
            }
            else{
                response.status = true;
                response.result = { leave_id, status_id };
            }
        }
        catch(error){
            response.status = false;
            response.error = error.message;
        }
        return response;
    }

}
export default leaveTransactionModel;