import db from "../Configs/Database.js";
import {
     ROLE_TYPE_INTERN, ROLE_TYPE_EMPLOYEE, LIMIT
} from "../Constant/Constants.js";

class LeaveCreditModel{

   /**
     * Inserts a new leave credit record into the database.
     *
     * @param {Object} data Leave credit data to insert.
     * @param {number} data.employee_id
     * @param {number} data.leave_transaction_id
     * @param {number|null} data.attendance_id
     * @param {number} data.leave_type_id
     * @param {number} data.earned_credit
     * @param {number} data.used_credit
     * @param {number} data.deducted_credit
     * @param {number} data.current_credit
     * @param {number} data.latest_credit
     * @returns {Promise<{status: boolean, result: Object|null, error: string|null}>}
     * created by: Rogendher Keith Lachica
     * updated at: September 24 2025 10:20 pm
     */
    static async insertLeaveCredit({ employee_id, leave_transaction_id, attendance_id, leave_type_id,
        earned_credit, used_credit, deducted_credit, current_credit, latest_credit }){
        const response_data = { status: false, result: null, error: null };

        try{
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
                response_data.error = "Failed to insert leave credit in model";
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


    static async updateLeaveCreditFromWorkHour({ employee_id, attendance_id, current_credit }) {
        const response_data = { status: false, result: null, error: null };
    
        try {
            const [update_in_attendance_credit_result] = await db.execute(`
                UPDATE leave_credits
                SET earned_work_hour_credit = ?, 
                    deducted_work_hour_credit = ?, 
                    earned_credit = ?, 
                    deducted_credit = ?, 
                    current_credit = ?, 
                    latest_credit = ?, 
                    updated_at = NOW()
                WHERE employee_id = ? AND attendance_id = ?
                ORDER BY created_at DESC
                LIMIT ${LIMIT}
            `, [
                earned_credit,
                deducted_credit,
                earned_credit,
                deducted_credit,
                current_credit,
                latest_credit,
                employee_id,
                attendance_id
            ]);
    
            if(update_in_attendance_credit_result.affectedRows === 0){
                response_data.status = false;
                response_data.error = "No leave credit record found to update in model.";
            } 
            else{
                response_data.status = true;
                response_data.result = { employee_id, attendance_id, earned_credit, deducted_credit, latest_credit };
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
     *
     * @returns {Promise<{status: boolean, result: Array<Object>|null, error: string|null}>}
     * created by: Rogendher Keith Lachica
     * updated at: September 24 2025 1:25 pm
     */
    static async insertYearlyCredit(employee_id, leave_type_id, credit_value){
        const response = { status: false, result: null, error: null };

        try{

            const [insert_yearly_credit_result] = await db.execute(`
                INSERT INTO leave_credits (
                    employee_id, 
                    leave_transaction_id, 
                    attendance_id, 
                    leave_type_id,
                    earned_work_hour_credit, 
                    deducted_work_hour_credit, 
                    used_work_hour_credit,
                    earned_credit, 
                    deducted_credit, 
                    used_credit, 
                    current_credit, 
                    latest_credit,
                    created_at, 
                    updated_at
                 ) 
                    VALUES (?, NULL, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
            `, [employee_id, leave_type_id, 0.00, 0.00, 0.00, credit_value, 0.00, 0.00,
                credit_value, credit_value]);

            if(!insert_yearly_credit_result.insertId){
                response.status = false;
                response.error = "Failed to insert yearly leave credit in model.";
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
     * @returns {Promise<{status: boolean, result: Array<Object>|null, error: string|null}>}
     * created by: Rogendher Keith Lachica
     * updated at: September 24 2025 1:25 pm
     */
    static async getAllEmployeeCredits(){
        const response_data = { status: false, result: null, error: null };

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
    /**
     * Retrieves the latest leave credit record for the given employee.
     *
     * @param {number} employee_id
     * @returns {Promise<{status: boolean, result: Object|null, error: string|null}>}
     * created by: Rogendher Keith Lachica
     * updated at: September 25 2025 12:10 am
     */
    static async getLatestEmployeeLeaveCredited(employee_id ){
        const response_data = { status: false, result: null, error: null };

        try{
            const [get_all_latest_credit_result] = await db.execute(`
                SELECT *
                FROM leave_credits
                WHERE employee_id = ?
                ORDER BY id DESC
                LIMIT ${LIMIT}
            `, [employee_id]);

            if(!get_all_latest_credit_result.length){
                response_data.status = false;
                response_data.result = null;
                response_data.error = "No credit found in model";
            }
            else{
                response_data.status = true;
                response_data.result = get_all_latest_credit_result[0];
            }
        }
        catch(error){
            response_data.status = false;
            response_data.result = null;
            response_data.error = error.message;
        }

        return response_data;
    }
    
    /**
     * Updates the latest leave credit for an employee.
     *
     * @param {Object} data
     * @param {number} data.employee_id
     * @param {number} data.leave_transaction_id
     * @param {number} data.leave_type_id
     * @param {number} data.used_credit
     * @param {number} data.latest_credit
     * @param {number} data.current_credit
     * @param {number} data.deducted_credit
     * @returns {Promise<{status: boolean, result: Object|null, error: string|null}>}
     * created by: Rogendher Keith Lachica
     * updated at: September 25 2025 12:30 am
     */
    static async updateLatestCredit({ leave_credit_id, leave_transaction_id, leave_type_id, used_credit, latest_credit, current_credit, deducted_credit }) {
        const response_data = { status: false, result: null, error: null };
    
        try{
            const [update_latest_credit_result] = await db.execute(`
                UPDATE leave_credits
                SET used_credit = ?, deducted_credit = ?, current_credit = ?, latest_credit = ?, leave_transaction_id = ?, leave_type_id = ?, updated_at = NOW()
                WHERE id = ?
            `, [used_credit, deducted_credit, current_credit, latest_credit, leave_transaction_id, leave_type_id, leave_credit_id]);
    
            if(update_latest_credit_result.affectedRows === 0){
                response_data.status = false;
                response_data.error = "No leave credit record found to update in model.";
            } 
            else{
                response_data.status = true;
                response_data.result = { leave_credit_id, leave_transaction_id, leave_type_id, used_credit, deducted_credit, current_credit, latest_credit };
            }
        } 
        catch(error){
            response_data.status = false;
            response_data.error = error.message;
        }
    
        return response_data;
    }
    

}

export default LeaveCreditModel; 
