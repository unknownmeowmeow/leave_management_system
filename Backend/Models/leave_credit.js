import db from "../Configs/database.js";
import {
    ROLE_TYPE_ID, NUMBER
} from "../Constant/constants.js";

class LeaveCreditModel{

    /**
     * Inserts multiple leave credit records into the database.
     *
     * Workflow:
     * 1. Executes a bulk INSERT query using provided employee leave credit data.
     * 2. Returns success status with inserted row count and first insert ID if successful.
     * 3. Returns an error message if insertion fails.
     * 4. Catches and handles any database or execution errors.
     *
     * @param {Object[]} employee_data - Array of leave credit records to insert.
     * @param {Object} [connection=db] - Database connection to use.
     * @returns {Promise<Object>} Response containing status, result, or error.
     *
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
     * Inserts a leave credit record earned from employee work hours.
     *
     * Workflow:
     * 1. Inserts a single leave credit using attendance data and credits.
     * 2. Returns the inserted record ID on success.
     * 3. Returns error message if insertion fails.
     * 4. Handles any exceptions during execution.
     *
     * @param {Object} params - Parameters required for insertion.
     * @param {number} params.employee_id - Employee identifier.
     * @param {number} params.attendance_id - Linked attendance record ID.
     * @param {number} params.earned_credit - Earned leave credit.
     * @param {number} params.deducted_credit - Deducted leave credit.
     * @param {number} params.current_credit - Current leave credit.
     * @param {number} params.latest_credit - Latest cumulative leave credit.
     * @param {Object} [params.connection=db] - Database connection to use.
     * @returns {Promise<Object>} Response with status, result, or error.
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
     * Inserts yearly leave credit records in bulk.
     *
     * Workflow:
     * 1. Performs bulk insert of yearly leave credits.
     * 2. Returns success status with inserted record ID.
     * 3. Returns error message if insertion fails.
     * 4. Handles exceptions during query execution.
     *
     * @param {Object[]} employee_data - Array of yearly leave credit records.
     * @returns {Promise<Object>} Response with status, result, or error.
     *
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
     * Retrieves summarized leave credit totals for all employees with specific roles.
     *
     * Workflow:
     * 1. Queries leave credit sums grouped by employee.
     * 2. Filters employees by role (intern and employee).
     * 3. Returns array of leave credit summaries on success.
     * 4. Returns error if no records found or query fails.
     *
     * @returns {Promise<Object>} Response with status, result array, or error.
     *
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
     * Retrieves the most recent leave credit record for a specific employee.
     *
     * Workflow:
     * 1. Selects leave credit record with latest creation date for given employee ID.
     * 2. Returns the record ID if found.
     * 3. Returns an error message if no records exist.
     * 4. Handles any database errors.
     *
     * @param {number} employee_id - Employee identifier.
     * @returns {Promise<Object>} Response with status, record ID, or error.
     *
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

    /**
     * Retrieves total leave credits summary for a given employee.
     *
     * Workflow:
     * 1. Aggregates earned, used, deducted, and latest leave credits by employee.
     * 2. Returns the summarized credit data if found.
     * 3. Returns an error if no records are found or on failure.
     *
     * @param {number} employee_id - Employee identifier.
     * @returns {Promise<Object>} Response with status, summarized credits, or error.
     *
     * created by: Rogendher Keith Lachica
     * updated at: September 25 2025 12:10 am
     */
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
     * Updates the latest leave credit record for an employee.
     *
     * Workflow:
     * 1. Updates leave credit fields by leave_credit_id.
     * 2. Returns updated credit details on success.
     * 3. Returns error if no matching record found or update fails.
     * 4. Handles exceptions during update.
     *
     * @param {Object} data - Data fields for update.
     * @param {number} data.leave_credit_id - ID of leave credit record to update.
     * @param {number} data.leave_transaction_id - Leave transaction reference.
     * @param {number} data.leave_type_id - Type of leave.
     * @param {number} data.used_credit - Used leave credits.
     * @param {number} data.latest_credit - Latest leave credit total.
     * @param {number} data.current_credit - Current leave credit.
     * @param {number} data.deducted_credit - Deducted leave credits.
     * @param {Object} [connection=db] - Database connection to use.
     * @returns {Promise<Object>} Response with status, updated data, or error.
     *
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
