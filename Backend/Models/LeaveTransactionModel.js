import db from "../Configs/Database.js";
import { STATUS_QUERY, ZERO, ONE } from "../Constant/Constants.js"

class leaveTransactionModel{

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
                response_data.error = "Insert failed, no insertId returned.";
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
     * Update leave status by leave_id
     * @param {number} leave_id 
     * @param {number} status_id 
     * @returns {Promise<Object>} Response data with status and result/error
     */
    static async updateStatus(leave_id, status_id) {
        const response_data = { ...STATUS_QUERY };

        try{
            const [update_leave_status_result] = await db.execute(`
                UPDATE leave_transactions
                SET leave_transaction_status_id = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `, [status_id, leave_id]);

            if(update_leave_status_result.affectedRows === 0){
                response_data.status = false;
                response_data.error = "Leave transaction not found or status unchanged.";
            } 
            else {
                response_data.status = true;
                response_data.result = { id: leave_id, status_id };
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