import db from "../Configs/Database.js";
import {
    STATUS_QUERY, ERROR_IN_CARRY_OVER_LEAVE_TYPE_MODEL,
    LEAVE_STATUS, IS_CARRIED_OVER, ERROR_IN_LEAVE_DEFAULT_MODEL, GRANT_TYPE_ID_DEFAULT,
    GRANT_TYPE_ID_SPECIAL, GRANT_TYPE_ID_REWARDED, LEAVE_TYPE_ID_MODEL_SICK_LEAVE, 
    LEAVE_TYPE_ID_MODEL_VACATION_LEAVE, GET_YEARLY_LEAVE_TYPE_ADDING_ID_1, GET_YEARLY_LEAVE_TYPE_ADDING_ID_2,
    GET_YEARLY_LEAVE_TYPE_ADDING_ID_6, ZERO
} from "../Constant/Constants.js";

class LeaveTypeModel{

    /**
     * Retrieves all active leave types that are marked as carried over.
     *
     * - Filters leave types based on is_carried_over and is_active flags.
     * - Returns list of eligible leave types or error if none found.
     *
     * @returns {Promise<{status: boolean, result: Array|null, error: string|null}>}
     * created by: [Your Name or Team]
     * updated at: September 25 2025
     */
    static async getAllCarryOverLeaveTypes(){
        const response_data = { ...STATUS_QUERY };

        try{
            const [get_all_carry_over_leave_type_result] = await db.execute(`
                    SELECT id, base_value 
                    FROM leave_types 
                    WHERE is_carried_over = ? AND is_active = ? AND id IN (?, ?)
                `, [IS_CARRIED_OVER.yes, LEAVE_STATUS.active, 
                    LEAVE_TYPE_ID_MODEL_VACATION_LEAVE, LEAVE_TYPE_ID_MODEL_SICK_LEAVE]
            );

            if(get_all_carry_over_leave_type_result.length === ZERO){
                response_data.status = false;
                response_data.result = [];
                response_data.error = ERROR_IN_CARRY_OVER_LEAVE_TYPE_MODEL;
            }
            else{
                response_data.status = true;
                response_data.result = get_all_carry_over_leave_type_result;

            }
        }
        catch(error){
            response_data.status = false;
            response_data.error = error.message;
        }

        return response_data;
    }

    /**
     * Retrieves yearly leave types by fixed IDs (1, 2, 6).
     *
     * - These IDs represent predefined yearly leave categories.
     * - Used for initializing or displaying standard yearly leaves.
     *
     * @returns {Promise<{status: boolean, result: Array|null, error: string|null}>}
     * created by: [Your Name or Team]
     * updated at: September 25 2025
     */
    static async GetYearlyLeaveTypeAdding(){
        const response_data = { ...STATUS_QUERY };

        try{
            const [get_all_yearly_leave_type_result] = await db.execute(`
                SELECT * FROM leave_types 
                WHERE id IN (?, ?, ?)
            `, [GET_YEARLY_LEAVE_TYPE_ADDING_ID_1, GET_YEARLY_LEAVE_TYPE_ADDING_ID_2, GET_YEARLY_LEAVE_TYPE_ADDING_ID_6]);

            if(!get_all_yearly_leave_type_result.length){
                response_data.status = false;
                response_data.result = [];
                response_data.error = ERROR_IN_CARRY_OVER_LEAVE_TYPE_MODEL;
            }
            else{
                response_data.status = true;
                response_data.result = get_all_yearly_leave_type_result;
            }
        }
        catch(error){
            response_data.status = false;
            response_data.error = error.message;
        }

        return response_data;
    }

    /**
     * Retrieves all active leave types with 'Default' grant type.
     *
     * - Joins leave_types with grant type table for lookup.
     * - Filters using grant type ID and active status.
     *
     * @returns {Promise<{status: boolean, result: Array|null, error: string|null}>}
     * created by: [Your Name or Team]
     * updated at: September 25 2025
     */
    static async getAllLeaveDefaultType(){
        const response_data = { ...STATUS_QUERY };

        try{
            const [get_all_leave_type_by_id_result] = await db.execute(`
                SELECT leave_types.id, leave_types.name
                FROM leave_types
                LEFT JOIN leave_type_grant_types 
                ON leave_types.leave_type_grant_type_id = leave_type_grant_types.id
                WHERE leave_types.leave_type_grant_type_id = ? AND leave_types.is_active = ?
            `, [GRANT_TYPE_ID_DEFAULT, LEAVE_STATUS.active]);

            if(!get_all_leave_type_by_id_result.length){
                response_data.status = false;
                response_data.error = ERROR_IN_LEAVE_DEFAULT_MODEL;
            }
            else{
                response_data.status = true;
                response_data.result = get_all_leave_type_by_id_result;
            }
        }
        catch(error){
            response_data.status = false;
            response_data.error = error.message;
        }

        return response_data;
    }

    /**
     * Retrieves all active leave types categorized as 'Special' or 'Rewarded'.
     *
     * - Uses IN clause to filter by both grant type IDs.
     * - Ensures leave types are active before returning.
     *
     * @returns {Promise<{status: boolean, result: Array|null, error: string|null}>}
     * created by: [Your Name or Team]
     * updated at: September 25 2025
     */
    static async getAllSpecialAndRewardedLeaveType(){
        const response_data = { ...STATUS_QUERY };

        try{
            const [get_all_special_and_rewarded_result] = await db.execute(`
                SELECT leave_types.id, leave_types.name
                FROM leave_types
                LEFT JOIN leave_type_grant_types 
                ON leave_types.leave_type_grant_type_id = leave_type_grant_types.id
                WHERE leave_types.is_active = ?
                AND leave_types.leave_type_grant_type_id IN (?, ?)
            `, [LEAVE_STATUS.active, GRANT_TYPE_ID_REWARDED, GRANT_TYPE_ID_SPECIAL]);

            if(!get_all_special_and_rewarded_result.length){
                response_data.status = false;
                response_data.error = ERROR_IN_LEAVE_DEFAULT_MODEL;
            }
            else{
                response_data.status = true;
                response_data.result = get_all_special_and_rewarded_result;
            }
        }
        catch(error){
            response_data.status = false;
            response_data.error = error.message;
        }

        return response_data;
    }

    static async getLeaveTypeById(leave_type_id) {
        const response_data = { ...STATUS_QUERY };

        try {
            const [get_leave_type_result] = await db.execute(`
                SELECT 
                    id, name, is_carried_over, notice_day, 
                    leave_type_grant_type_id, leave_type_rule_id, base_value
                FROM leave_types
                WHERE id = ? AND is_active = ?
            `, [leave_type_id, LEAVE_STATUS.active]);

            if(get_leave_type_result.length === ZERO){
                response_data.status = false;
                response_data.result = null;
                response_data.error = ERROR_IN_GET_LEAVE_TYPE_BY_ID_MODEL;
            } 
            else{
                response_data.status = true;
                response_data.result = get_leave_type_result[0];
            }
        } 
        catch(error){
            response_data.status = false;
            response_data.error = error.message;
        }

        return response_data;
    }
 
    static async getAllLeaves(){
        const response_data = { ...STATUS_QUERY };
    
        try {
            const [get_all_employee_leave_result] = await db.execute(`
               SELECT 
                    leave_transactions.id,
                    CONCAT(employees.first_name, ' ', employees.last_name) AS employee_name,
                    leave_types.name AS leave_type,
                    leave_type_grant_types.name AS grant_type_name, 
                    leave_transactions.start_date,
                    leave_transactions.end_date,
                    leave_transactions.reason,
                    leave_transaction_statuses.name AS status
                FROM leave_transactions
                JOIN employees 
                ON employees.id = leave_transactions.employee_id
                JOIN leave_types 
                ON leave_types.id = leave_transactions.leave_type_id
                JOIN leave_type_grant_types
                ON leave_type_grant_types.id = leave_types.leave_type_grant_type_id
                LEFT JOIN leave_transaction_statuses 
                ON leave_transaction_statuses.id = leave_transactions.leave_transaction_status_id
                ORDER BY leave_transactions.id DESC;

            `);
    
            if(!get_all_employee_leave_result.length){
                response_data.status = false;
                response_data.result = [];
                response_data.error = "No leave transactions found.";
            } 
            else{
                response_data.status = true;
                response_data.result = get_all_employee_leave_result;
            }
        } 
        catch(error){
            response_data.status = false;
            response_data.error = error.message;
        }
    
        return response_data;
    }
    

    /**
     * Update leave transaction status (approved, rejected, etc.)
     * For admin leave actions
     */
    static async updateLeaveStatus(leave_id, status_id){
        const response_data = { ...STATUS_QUERY };
    
        try{
            const [update_result] = await db.execute(`
                UPDATE leave_transactions
                SET leave_transaction_status_id = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `, [status_id, leave_id]);
    
            if(update_result.affectedRows === 0){
                response_data.status = false;
                response_data.error = "Leave transaction not found or status unchanged.";
            } 
            else{
                response_data.status = true;
            }
        } 
        catch(error){
            response_data.status = false;
            response_data.error = error.message;
        }
    
        return response_data;
    }
    static async getAllByEmployeeRecordLeaves(employee_id){
        const response_data = { ...STATUS_QUERY };
    
        try {
            const [get_all_employee_leave_result] = await db.execute(`
               SELECT 
                    leave_transactions.id,
                    CONCAT(employees.first_name, ' ', employees.last_name) AS employee_name,
                    leave_types.name AS leave_type,
                    leave_type_grant_types.name AS grant_type_name, 
                    leave_transactions.start_date,
                    leave_transactions.end_date,
                    leave_transactions.reason,
                    leave_transaction_statuses.name AS status
                FROM leave_transactions
                JOIN employees 
                ON employees.id = leave_transactions.employee_id
                JOIN leave_types 
                ON leave_types.id = leave_transactions.leave_type_id
                JOIN leave_type_grant_types
                ON leave_type_grant_types.id = leave_types.leave_type_grant_type_id
                LEFT JOIN leave_transaction_statuses 
                ON leave_transaction_statuses.id = leave_transactions.leave_transaction_status_id
                WHERE leave_transactions.employee_id = ?
                ORDER BY leave_transactions.id DESC;

            `[employee_id]);
    
            if(!get_all_employee_leave_result.length){
                response_data.status = false;
                response_data.result = [];
                response_data.error = "No leave transactions found.";
            } 
            else{
                response_data.status = true;
                response_data.result = get_all_employee_leave_result;
            }
        } 
        catch(error){
            response_data.status = false;
            response_data.error = error.message;
        }
    
        return response_data;
    }

}

export default LeaveTypeModel; 
