import db from "../Configs/database.js";
import {
    ROLE_TYPE_ID, NUMBER
} from "../Constant/constants.js";

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
    static async insertLeaveCredit({ employee_data, connection = db }){
        const response_data = { status: false, result: null, error: null };

        try{
            const [insert_employee_credit_result] = await connection.query(`
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
                    created_at
                ) 
                VALUES ?
            `, [employee_data]);            

            if(insert_employee_credit_result.affectedRows){
                response_data.status = true;
                response_data.result = { first_insert_id: insert_employee_credit_result.insertId, total_inserted: insert_employee_credit_result.affectedRows };
            }
            else{
                response_data.error = "failed to insert in model";
            }

        }
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }

    /**
     * Inserts a new leave credit record earned from employee work hours.
     * 
     * This function saves a leave credit transaction into the `leave_credits` table 
     * using attendance data. It records earned and deducted credits, updates the 
     * current and latest credit values, and stores the creation timestamp.
     * 
     * @param {Object} params - Parameters required to insert leave credit.
     * @param {number} params.employee_id - Employee identifier.
     * @param {number} params.attendance_id - Attendance record identifier linked to this credit.
     * @param {number} params.earned_credit - Credit earned based on work hours.
     * @param {number} params.deducted_credit - Credit deducted, if any.
     * @param {number} params.current_credit - Current credit after update.
     * @param {number} params.latest_credit - Latest cumulative leave credit.
     * @param {Object} [params.connection=db] - Database connection (default: db).
     * 
     * @returns {Object} Response object containing status, result, or error.
     * 
     * created by: Rogendher Keith Lachica
     * updated at: September 30 2025 6:45 pm
     */
    static async insertLeaveCreditFromWorkHour({ employee_id, attendance_id, earned_credit, deducted_credit, current_credit, latest_credit, connection = db }) {
        const response_data = { status: false, result: null, error: null };

        try{
            const [insert_work_hour_result] = await connection.execute(`
                INSERT INTO leave_credits (
                    employee_id,
                    attendance_id,
                    earned_credit,
                    deducted_credit,
                    current_credit,
                    latest_credit,
                    created_at
                ) 
                VALUES 
                    (?, ?, ?, ?, ?, ?, NOW())
            `, [employee_id, attendance_id, earned_credit, deducted_credit, current_credit, latest_credit]);

            if(insert_work_hour_result.insertId){
                response_data.status = true;
                response_data.result = { id: insert_work_hour_result.insertId };
            }
            else{
                response_data.error = "Failed to insert leave credit record in model.";   
            }
        }
        catch(error){
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
    static async insertYearlyCredit(employee_data) {
        const response_data = { status: false, result: null, error: null };

        try {
            const [insert_yearly_credit_result] = await db.query(`
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
                    created_at
                ) 
                VALUES ?
            `, [employee_data]);

            if(insert_yearly_credit_result.insertId){
                response_data.status = true;
                response_data.result = { id: insert_yearly_credit_result.insertId };
            }
            else{
                response_data.error = "Failed to insert yearly leave credit in model.";
            }

        }
        catch(error){
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
    static async getAllEmployeeCredits() {
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
                FROM 
                    leave_credits
                LEFT JOIN 
                    employees 
                ON 
                    leave_credits.employee_id = employees.id
                WHERE 
                    employees.employee_role_type_id 
                IN 
                    (?, ?)
                GROUP BY 
                    leave_credits.employee_id 
                ORDER BY 
                    leave_credits.employee_id DESC
            `, [ROLE_TYPE_ID.intern, ROLE_TYPE_ID.employee]);

            if(get_all_employee_credit_result.length){
                response_data.status = true;
                response_data.result = get_all_employee_credit_result;
            }
            else{
                response_data.error = "no leave credit records found";
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
    static async getLatestEmployeeLeaveCredited(employee_id){
        const response_data = { status: false, result: null, error: null };

        try{
            const [get_all_latest_credit_result] = await db.execute(`
                SELECT 
                    id
                FROM 
                    leave_credits
                WHERE 
                    employee_id = ?
                ORDER BY 
                    created_at DESC
                LIMIT 
                    ${NUMBER.one}
            `, [employee_id]);

            if(get_all_latest_credit_result.length){
                response_data.status = true;
                response_data.result = get_all_latest_credit_result;
            }
            else{
                response_data.error = "No credit found in model";
               
            }
        }
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }

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
                    FROM 
                        leave_credits
                    LEFT JOIN 
                        employees 
                    ON 
                        leave_credits.employee_id = employees.id
                    WHERE 
                        leave_credits.employee_id = ?
                    GROUP BY 
                        leave_credits.employee_id
                    ORDER BY 
                        leave_credits.employee_id DESC
                    `, [employee_id]);

            if(get_total_credit_result.length){
                response_data.status = true;
                response_data.result = get_total_credit_result;
            }
            else{
                response_data.error = "No leave credit found for employee in credit model .";
            }
        }
        catch(error){
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
    static async updateLatestCredit({ leave_credit_id, leave_transaction_id, leave_type_id, used_credit, latest_credit, current_credit, deducted_credit, connection = db }) {
        const response_data = { status: false, result: null, error: null };

        try {
            const [update_latest_credit_result] = await connection.execute(`
                UPDATE 
                    leave_credits
                SET 
                    used_credit = ?, 
                    deducted_credit = ?, 
                    current_credit = ?, 
                    latest_credit = ?, 
                    leave_transaction_id = ?, 
                    leave_type_id = ?, 
                    updated_at = CURRENT_TIMESTAMP
                WHERE 
                    id = ?
            `, [used_credit, deducted_credit, current_credit, latest_credit, leave_transaction_id, leave_type_id, leave_credit_id]);

            if(update_latest_credit_result.affectedRows){
                response_data.status = true;
                response_data.result = { leave_credit_id, leave_transaction_id, leave_type_id, used_credit, deducted_credit, current_credit, latest_credit };
            }
            else{
                response_data.error = "No leave credit record found to update in model.";
            }
        }
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }


}

export default LeaveCreditModel; 
