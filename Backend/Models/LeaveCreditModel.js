import db from "../Configs/Database.js";
import { STATUS_QUERY } from "../Constant/Constants.js";

class LeaveCreditModel{
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
            `, [ employee_id, leave_transaction_id, attendance_id, leave_type_id, earned_credit, deducted_credit, used_credit, current_credit, latest_credit]);

            if(!insert_employee_credit_result.insertId){
                response_data.status = false;
                response_data.error = "Failed to insert leave credit";
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
     * Retrieve summarized leave credit totals per employee.
     * Includes total earned, used, and latest credit values.
     * 
     * @returns {Promise<{status: boolean, result: Array<Object>|null, error: string|null}>}
     * created by: rogendher keith lachica
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
                WHERE employees.employee_role_type_id IN (2, 3)
                GROUP BY leave_credits.employee_id 
                ORDER BY leave_credits.employee_id DESC
            `);
    
            if(get_all_employee_credit_result.length === 0){
                response_data.status = false;
                response_data.result = null;
                response_data.error = "no leave credit records found";
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
    
}

export default LeaveCreditModel;
