import db from "../Configs/Database.js";
import {
    STATUS_QUERY, ERROR_IN_INSERT_CREDIT_MODEL, ERROR_IN_GET_ALL_CREDIT_MODEL,
    ERROR_IN_GET_EMPLOYEE_CREDIT_MODEL, ROLE_TYPE_INTERN, ROLE_TYPE_EMPLOYEE,
    INSERT_YEARLY_CREDIT_MODEL, ZERO_POINT_ZERO_ZERO, ZERO
} from "../Constant/Constants.js";

class LeaveCreditModel {

    /**
     * Inserts a new leave credit record into the database.
     *
     * - Accepts full credit data including earned, used, deducted, current, and latest values.
     * - Records the transaction time with NOW().
     * - Returns the inserted record ID on success.
     *
     * @param {Object} data Leave credit data to insert.
     * @param {number} data.employee_id
     * @param {number} data.leave_transaction_id
     * @param {number|null} data.attendance_id
     * @param {number} data.leave_type_id
     * @param {number} data.earned_credit
     * @param {number} data.used_credit
     * @param {number} data.current_credit
     * @param {number} data.latest_credit
     * @returns {Promise<{status: boolean, result: Object|null, error: string|null}>}
     * created by: Rogendher Keith Lachica
     * updated at: September 24 2025 10:20 pm  
     */
    static async insertLeaveCredit({ employee_id, leave_transaction_id, attendance_id = null, leave_type_id = null,
        earned_credit, used_credit = ZERO, deducted_credit, current_credit, latest_credit = ZERO }) {
        const response_data = { ...STATUS_QUERY };

        try {
            const [insert_employee_credit_result] = await db.execute(`
                INSERT INTO leave_credits (
                    employee_id, 
                    leave_transaction_id, 
                    attendance_id, 
                    leave_type_id, 
                    earned_credit,
                    deducted_credit, 
                    used_credit, 
                    current_credit, 
                    latest_credit, 
                    created_at, 
                    updated_at
                ) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
            `, [employee_id, leave_transaction_id, attendance_id, leave_type_id, earned_credit, deducted_credit, used_credit, current_credit, latest_credit]);

            if(!insert_employee_credit_result.insertId){
                response_data.status = false;
                response_data.error = ERROR_IN_INSERT_CREDIT_MODEL;
            }
            else{
                response_data.status = true;
                response_data.result = { id: insert_employee_credit_result.insertId };
            }
        }
        catch(error){
            response_data.status = false;
            response_data.error = error.message;
        }

        return response_data;
    }

    /**
     * Inserts yearly credit for an employee based on leave type.
     *
     * - Used during leave resets or annual accrual.
     * - Initializes earned, current, and latest credit with the same value.
     * - Returns the inserted record ID on success.
     *
     * @param {number} employee_id
     * @param {number} leave_type_id
     * @param {number} credit_value
     * @returns {Promise<{status: boolean, result: Object|null, error: string|null}>}
     * created by: Rogendher Keith Lachica
     * updated at: September 25 2025 01:10 am
     */
    static async insertYearlyCredit(employee_id, leave_type_id, credit_value) {
        const response = { status: false, result: null, error: null };

        try{

            const [insert_yearly_credit_result] = await db.execute(`
                INSERT INTO leave_credits (
                    employee_id, leave_transaction_id, attendance_id, leave_type_id,
                    earned_work_hour_credit, deducted_work_hour_credit, used_work_hour_credit,
                    earned_credit, deducted_credit, used_credit, current_credit, latest_credit,
                    created_at, updated_at
                 ) 
                    VALUES (?, NULL, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `, [employee_id, leave_type_id, ZERO_POINT_ZERO_ZERO, ZERO_POINT_ZERO_ZERO,
                ZERO_POINT_ZERO_ZERO, credit_value, ZERO_POINT_ZERO_ZERO, ZERO_POINT_ZERO_ZERO,
                credit_value, credit_value]);

            if(!insert_yearly_credit_result.insertId){
                response.status = false;
                response.error = INSERT_YEARLY_CREDIT_MODEL;
            } 
            else{
                response.status = true;
                response.result = { id: insert_yearly_credit_result.insertId };
            }

        }
        catch(error){
            response.status = false;
            response.error = error.message;
        }

        return response;
    }

    /**
     * Retrieve summarized leave credit totals per employee.
     *
     * - Includes total earned, used, deducted, and latest credit.
     * - Joins with employee table and filters by role types (intern, employee).
     * - Grouped by employee and ordered descending by ID.
     *
     * @returns {Promise<{status: boolean, result: Array<Object>|null, error: string|null}>}
     * created by: Rogendher Keith Lachica
     * updated at: September 24 2025 1:25 pm  
     */
    static async getAllEmployeeCredits() {
        const response_data = { ...STATUS_QUERY };

        try{
            const [get_all_employee_credit_result] = await db.execute(`
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
                WHERE employees.employee_role_type_id IN (?, ?)
                GROUP BY leave_credits.employee_id 
                ORDER BY leave_credits.employee_id DESC
            `, [ROLE_TYPE_INTERN, ROLE_TYPE_EMPLOYEE]);

            if(get_all_employee_credit_result.length === ZERO){
                response_data.status = false;
                response_data.result = null;
                response_data.error = ERROR_IN_GET_ALL_CREDIT_MODEL;
            }
            else{
                response_data.status = true;
                response_data.result = get_all_employee_credit_result;
            }
        }
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }

    /**
     * Retrieves the latest leave credit record for the given employee.
     *
     * - Ordered by creation date (most recent first).
     * - Returns only the latest_credit field.
     *
     * @param {number} employee_id ID of the employee
     * @returns {Promise<{status: boolean, result: Object|null, error: string|null}>}
     * created by: Rogendher Keith Lachica
     * updated at: September 25 2025 12:10 am
     */
    static async getLatestEmployeeLeaveCredit(employee_id) {
        const response_data = { ...STATUS_QUERY };

        try{
            const [get_all_latest_credit_result] = await db.execute(`
                    SELECT latest_credit 
                    FROM leave_credits 
                    WHERE employee_id = ? 
                    ORDER BY created_at DESC 
                    LIMIT 1
                `, [employee_id]);

            if(!get_all_latest_credit_result.length){
                response_data.status = false;
                response_data.result = null;
                response_data.error = ERROR_IN_GET_EMPLOYEE_CREDIT_MODEL;
            }
            else{
                response_data.status = true;
                response_data.result = get_all_latest_credit_result;
            }
        }
        catch(error){
            response_data.status = false;
            response_data.result = null;
            response_data.error = error.message;
        }

        return response_data;
    }

    static async insertLeaveCredit({ employee_id, leave_transaction_id, leave_type_id, used_credit, latest_credit }) {
        const response_data = { ...STATUS_QUERY };
    
        try{
            const [insert_result] = await db.execute(`
                INSERT INTO leave_credits (
                    employee_id,
                    leave_transaction_id,
                    leave_type_id,
                    used_credit,
                    latest_credit
                ) VALUES (?, ?, ?, ?, ?)
            `, [employee_id, leave_transaction_id, leave_type_id, used_credit, latest_credit]);
    
            if(!insert_result.insertId){
                response_data.status = false;
                response_data.error = "Insert failed, no insertId returned.";
            } 
            else {
                response_data.status = true;
                response_data.result = { leave_credit_id: insert_result.insertId };
            }
    
        } 
        catch(error){
            response_data.status = false;
            response_data.error = error.message;
        }
    
        return response_data;
    }
    

    static async updateLatest_credit({ employee_id, leave_transaction_id, leave_type_id, used_credit, latest_credit, current_credit, deducted_credit}) {
        const response_data = { ...STATUS_QUERY };

        try {
            const [update_result] = await db.execute(`
                UPDATE leave_credits
                SET used_credit = ?, deducted_credit = ?, current_credit = ?, latest_credit = ?, leave_transaction_id = ?,  leave_type_id = ?, updated_at = NOW()
                WHERE employee_id = ?
                ORDER BY id DESC
                LIMIT 1
            `, [ used_credit, deducted_credit, current_credit, latest_credit, leave_transaction_id, leave_type_id, employee_id]);

            response_data.status = update_result.affectedRows > ZERO;
            response_data.result = update_result;

        } 
        catch(error){
            response_data.status = false;
            response_data.error = error.message;
        }

        return response_data;
    }

}

export default LeaveCreditModel; 
