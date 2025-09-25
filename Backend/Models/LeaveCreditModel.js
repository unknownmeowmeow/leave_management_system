import db from "../Configs/Database.js";
import {
    STATUS_QUERY, ERROR_IN_INSERT_CREDIT_MODEL, ERROR_IN_GET_ALL_CREDIT_MODEL,
    ERROR_IN_GET_EMPLOYEE_CREDIT_MODEL, ROLE_TYPE_INTERN, ROLE_TYPE_EMPLOYEE
} from "../Constant/Constants.js";

class LeaveCreditModel {
    /**
     * Insert a new leave credit record
     * @param {Object} data
     * @param {number} data.employee_id
     * @param {number} data.leave_transaction_id
     * @param {number|null} data.attendance_id
     * @param {number} data.leave_type_id
     * @param {number} data.earned_credit
     * @param {number} data.used_credit
     * @param {number} data.current_credit
     * @param {number} data.latest_credit
     * @returns {Promise<{status: boolean, result: Object|null, error: string|null}>}
     * created by: rogendher keith lachica
     * updated at: September 24 2025 10:20 pm  
     */
    static async insertLeaveCredit({
        employee_id,
        leave_transaction_id,
        attendance_id = null,
        leave_type_id = null,
        earned_credit,
        used_credit = 0,
        deducted_credit,
        current_credit,
        latest_credit = 0
    }) {
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

            if (!insert_employee_credit_result.insertId) {
                response_data.status = false;
                response_data.error = ERROR_IN_INSERT_CREDIT_MODEL;
            }
            else {
                response_data.status = true;
                response_data.result = { id: insert_employee_credit_result.insertId };
            }
        }
        catch (error) {
            response_data.status = false;
            response_data.error = error.message;
        }

        return response_data;
    }
    static async insertYearlyCredit(employee_id, leave_type_id, credit_value) {
        const response = { status: false, result: null, error: null };

        try {

            await db.execute(`
            INSERT INTO leave_credits (
              employee_id, leave_transaction_id, attendance_id, leave_type_id,
              earned_work_hour_credit, deducted_work_hour_credit, used_work_hour_credit,
              earned_credit, deducted_credit, used_credit, current_credit, latest_credit,
              created_at, updated_at
            ) VALUES (?, NULL, NULL, ?, 0.00, 0.00, 0.00, ?, 0.00, 0.00, ?, ?, NOW(), NOW())
          `, [employee_id, leave_type_id, credit_value, credit_value, credit_value]);

            response.status = true;
            response.result = `Inserted credit for employees`;
        }
        catch (error) {
            response.error = error.message;
        }

        return response;
    }
    /**
     * Retrieve summarized leave credit totals per employee.
     * Includes total earned, used, and latest credit values.
     * 
     * @returns {Promise<{status: boolean, result: Array<Object>|null, error: string|null}>}
     * created by: rogendher keith lachica
     * updated at: September 24 2025 1:25 pm  
     */
    static async getAllEmployeeCredits() {
        const response_data = { ...STATUS_QUERY };

        try {
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

            if (get_all_employee_credit_result.length === 0) {
                response_data.status = false;
                response_data.result = null;
                response_data.error = ERROR_IN_GET_ALL_CREDIT_MODEL;
            }
            else {
                response_data.status = true;
                response_data.result = get_all_employee_credit_result;
            }
        }
        catch (error) {
            response_data.error = error.message;
        }

        return response_data;
    }

    /**
     * Retrieves the latest leave credit record for the given employee.
     * 
     * @param {number} employee_id - ID of the employee
     * @returns {Promise<Object>} - Status, result, and error message if any.
     * created by: Rogendher Keith Lachica
     * updated at: September 25 2025 12:10 am
     */
    static async getLatestEmployeeLeaveCredit(employee_id) {
        const response_data = { ...STATUS_QUERY };

        try {
            const [get_all_latest_credit_result] = await db.execute(`
                    SELECT latest_credit 
                    FROM leave_credits 
                    WHERE employee_id = ? 
                    ORDER BY created_at DESC 
                    LIMIT 1
                `, [employee_id]);

            if (get_all_latest_credit_result.length > 0) {
                response_data.status = true;
                response_data.result = get_all_latest_credit_result[0];
            }
            else {
                response_data.status = false;
                response_data.result = null;
                response_data.error = ERROR_IN_GET_EMPLOYEE_CREDIT_MODEL;
            }
        }
        catch (error) {
            response_data.status = false;
            response_data.result = null;
            response_data.error = error.message;
        }

        return response_data;
    }

}

export default LeaveCreditModel;
