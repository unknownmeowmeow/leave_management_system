import db from "../config/database.js";
import {
<<<<<<< HEAD
    ROLE_TYPE_ID, NUMBER, LEAVE_TYPE_ID, DECIMAL_NUMBER,
    IS_CARRIED_OVER,
    DAY_COUNT
} from "../Constant/constants.js";
import leave_type from "./leave_type.js";

class LeaveCreditModel{
    constructor(connection = db){
        this.db = connection;
    }
    
    /**
     * @param {Object[]} employee_data 
     * @param {Object} [connection=db] 
     * @returns {Promise<Object>}
     * Last Updated At: September 24, 2025
     * @author Keith
     */
    async insertLeaveCredit( employee_data, connection = this.db ){
=======
    ROLE_TYPE_ID, NUMBER
} from "../constant/constants.js";

class LeaveCredit{

    /**
     * Inserts multiple leave credit records into the database.
     * @param {Object[]} employee_data - Array of leave credit records to insert.
     * @param {Object} [connection=db] - Database connection to use.
     * @returns {Promise<Object>} Response containing status, result, or error.
     * created by: Rogendher Keith Lachica
     * updated at: September 24 2025 10:20 pm
     */
    static async insertLeaveCredit({ employee_data, connection = db }) {
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
        const response_data = { status: false, result: null, error: null };
    
        try{
            if(!employee_data || !employee_data.length){
                throw new Error("No leave credit data provided");
            }
    
            const [insert_leave_credit] = await connection.query(`
                INSERT INTO leave_credits (
                    employee_id,
                    leave_transaction_id,
                    attendance_id,
                    leave_type_id,
                    earned_credit,
                    deducted_credit,
                    used_credit,
                    current_credit,
<<<<<<< HEAD
                    latest_credit
                ) 
                VALUES ?
            `, [employee_data]);            
    
            if(insert_leave_credit.insertId){
                response_data.status = true;
                response_data.result = { first_insert_id: insert_leave_credit.insertId, total_inserted: employee_data.length };
            }
            else{
                response_data.error = "Failed to Insert";
            }
    
        }
=======
                    latest_credit,
                    created_at
                ) VALUES ?
            `, [employee_data]);
    
            if(insert_leave_credit.insertId){
                response_data.status = true;
                response_data.result = { first_insert_id: insert_leave_credit.insertId };
            } 
            else{
                response_data.error = "Failed to insert in model";
            }
        } 
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
        catch(error){
            response_data.error = error.message;
        }
    
        return response_data;
    }
    
<<<<<<< HEAD
    /**
    * @param {Object} update_credit 
    * @param {number} update_credit.employee_id
    * @param {number} update_credit.earned_credit 
    * @param {number} update_credit.deducted_credit 
    * @param {number} update_credit.current_credit 
    * @param {Object} [connection=db]
    * @returns {Promise<Object>} 
    * Last Updated At: October 8, 2025
    * @author Keith
    */
    async updateEmployeeLeaveCredit(update_leave_credit, connection = this.db){
        const response_data = { status: false, result: null, error: null };
        
=======

    /**
     * Inserts a leave credit record earned from employee work hours.
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
     * created by: Rogendher Keith Lachica
     * updated at: September 30 2025 6:45 pm
     */
    static async insertEmployeeLeaveCreditFromWorkHour(insert_credit_data, connection = db){
        const response_data = { status: false, result: null, error: null };
        const { employee_id, attendance_id, earned_credit, deducted_credit, current_credit, latest_credit } = insert_credit_data;

>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
        try{
            const [update_credit_work_hour] = await connection.execute(`
                UPDATE leave_credits
                SET earned_credit = earned_credit + ?, 
                    deducted_credit = deducted_credit + ?, 
                    current_credit = ?, 
                    latest_credit = ?
                WHERE employee_id = ? AND leave_type_id = ?
            `, [ 
                update_leave_credit.earned_credit, 
                update_leave_credit.deducted_credit,
                update_leave_credit.current_credit, 
                update_leave_credit.latest_credit,
                update_leave_credit.employee_id, 
                LEAVE_TYPE_ID.compensatory_leave
            ]);
    
            if(update_credit_work_hour.affectedRows){
                response_data.status = true;
            } 
            else{
                response_data.error = "No existing leave credit record Found to Update.";
            }
        } 
        catch(error){
            response_data.error = error.message;
        }
    
        return response_data;
    }

    /**
<<<<<<< HEAD
     * @returns {Promise<Object>} 
     * Last Updated At: September 24, 2025
     * @author Keith
=======
     * Inserts yearly leave credit records in bulk.
     * @param {Object[]} employee_data - Array of yearly leave credit records.
     * @returns {Promise<Object>} Response with status, result, or error.
     * created by: Rogendher Keith Lachica
     * updated at: September 24 2025 1:25 pm
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
     */
    async getAllEmployeeCredit(){
        const response_data = { status: false, result: null, error: null };

        try{
<<<<<<< HEAD
            const [get_all_employee_credit] = await this.db.execute(`
=======
            const [insert_yearly_credit] = await db.query(`
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
                    created_at
                ) 
                VALUES ?
            `, [employee_data]);

            if(insert_yearly_credit.insertId){
                response_data.status = true;
                response_data.result = { id: insert_yearly_credit.insertId };
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
     * @returns {Promise<Object>} Response with status, result array, or error.
     * created by: Rogendher Keith Lachica
     * updated at: September 24 2025 1:25 pm
     */
    static async getAllEmployeeCredit() {
        const response_data = { status: false, result: null, error: null };

        try{
            const [get_all_employee_credit] = await db.execute(`
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
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
                LEFT JOIN employees ON leave_credits.employee_id = employees.id
                WHERE employees.employee_role_type_id IN (?, ?) 
                GROUP BY leave_credits.employee_id 
                ORDER BY leave_credits.employee_id DESC
            `, [ROLE_TYPE_ID.intern, ROLE_TYPE_ID.employee]);

            if(get_all_employee_credit.length){
                response_data.status = true;
                response_data.result = get_all_employee_credit;
            }
            else{
                response_data.error = "No leave credit records Found";
            }
        }
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }

<<<<<<< HEAD
    /**
     * @param {Array<number>} leave_type_ids 
     * @param {Array<number>} gain_credits
     * @param {Array<number>} employee_ids
     * @returns {Promise<Object>} 
     * Last Updated At: October 14, 2025
     * @author Keith
=======
     /**
     * Retrieves the most recent leave credit record for a specific employee.
     * @param {number} employee_id - Employee identifier.
     * @returns {Promise<Object>} Response with status, record ID, or error.
     * created by: Rogendher Keith Lachica
     * updated at: September 25 2025 12:10 am
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
     */
    async latestCredit(employee_id, leave_type){
        const response_data = { status: false, result: null, error: null };
    
        try{
            const [all_leave_history] = await this.db.execute(`
                SELECT *,
                    employees.first_name,
                    employees.last_name
                FROM leave_credits
                LEFT JOIN employees ON leave_credits.employee_id = employees.id
                LEFT JOIN leave_types ON leave_credits.leave_type_id = leave_types.id
                ORDER BY leave_credits.id DESC
            `, [employee_id, leave_type]);
    
            if(all_leave_history.length){
                response_data.status = true;
                response_data.result = all_leave_history;
            } 
            else{
                response_data.error = "No leave credit data Found for any employee";
            }
        } 
        catch(error){
            response_data.error = error.message;
        }
    
        return response_data;
    }
    
    /**
     * Fetches all leave credits for a specific employee.
     * @param {number} employee_id - Employee ID to fetch credits for.
     * @returns {Promise<{status: boolean, result: Array<Object>|null, error: string|null}>} 
     * Last Updated At: October 8, 2025
     * @author Keith
     */
    async getCreditSummary(employee_id){
        const response_data = { status: false, result: null, error: null };
    
        try{
            const [get_all_leave_summary] = await this.db.execute(`
                SELECT *
                FROM leave_credits
                LEFT JOIN leave_types ON leave_credits.leave_type_id = leave_types.id
                WHERE leave_credits.employee_id = ?
                ORDER BY leave_credits.id DESC
            `, [employee_id]);
    
            if(get_all_leave_summary.length){
                response_data.status = true;
                response_data.result = get_all_leave_summary;
            } 
            else{
                response_data.error = "No leave credit data Found for this employee";
            }
        } 
        catch(error){
            response_data.error = error.message;
        }
    
        return response_data;
    }
    
    /**
     * Gets the latest compensatory leave credit for an employee.
     * @param {number} employee_id - Employee ID to fetch credit for.
     * @param {Object} [connection=db] - Optional database connection.
     * @returns {Promise<Object>} response_data - Object containing status, result, or error.
     * Last Updated At: September 25, 2025
     * @author Keith
     */
    async getLatestEmployeeCredit(employee_id){
        const response_data = { status: false, result: null, error: null };

        try{
            const [get_latest_employee_credit] = await this.db.execute(`
                SELECT SUM(latest_credit) AS latest_credit_sum
                FROM leave_credits
                WHERE employee_id = ? AND leave_type_id = ?
                LIMIT ${NUMBER.one}
            `, [employee_id, LEAVE_TYPE_ID.compensatory_leave]);

            if(get_latest_employee_credit.length){
                response_data.status = true;
                response_data.result = get_latest_employee_credit[NUMBER.zero].latest_credit_sum ;
            }
            else{
                response_data.error = "No credit Found";
               
            }
        }
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }

    /**
<<<<<<< HEAD
    * Calculates total leave credits for an employee.
    * @param {number} employee_id - Employee ID to fetch totals for.
    * @returns {Promise<Object>} response_data - Object containing status, result, or error.
    * Last Updated At: September 25, 2025
    * @author Keith
    */
    async getTotalCredit(employee_id){
=======
     * Retrieves total leave credits summary for a given employee.
     * @param {number} employee_id - Employee identifier.
     * @returns {Promise<Object>} Response with status, summarized credits, or error.
     * created by: Rogendher Keith Lachica
     * updated at: September 25 2025 12:10 am
     */
    static async getTotalCredit(employee_id){
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
        const response_data = { status: false, result: null, error: null };

        try{
            const [get_total_credit] = await this.db.execute(`
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
            LEFT JOIN employees ON leave_credits.employee_id = employees.id
            WHERE leave_credits.employee_id = ?
            GROUP BY leave_credits.employee_id
            ORDER BY leave_credits.employee_id DESC
            `, [employee_id]);

            if(get_total_credit.length){
                response_data.status = true;
                response_data.result = get_total_credit;
            }
            else{
                response_data.error = "No leave credit Found for employee in credit model.";
            }
        }
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }


    /**
     * Updates the latest credit for a specific leave credit record.
     * @param {Object} params - Object containing credit update information.
     * @param {Object} [connection=db] - Optional database connection.
     * @returns {Promise<Object>} response_data - Object containing status, result, or error.
     * Last Updated At: September 25, 2025
     * @author Keith
     */
    async updateLatestCredit({ update_credit, connection = this.db }){
        const response_data = { status: false, result: null, error: null };
        const {leave_credit_id, leave_transaction_id, leave_type_id, used_credit, latest_credit, current_credit, deducted_credit} = update_credit;
        
        try{
            const [update_latest_credit] = await connection.execute(`
                UPDATE leave_credits
                SET 
                    used_credit = ?, 
                    deducted_credit = ?, 
                    current_credit = ?, 
                    latest_credit = ?, 
                    leave_transaction_id = ?, 
                    leave_type_id = ?
                WHERE id = ?
            `, [used_credit, deducted_credit, current_credit, latest_credit, leave_transaction_id, leave_type_id, leave_credit_id]);

            if(update_latest_credit.affectedRows){
                response_data.status = true;
                response_data.result = { affectedRows: update_latest_credit.affectedRows };
            }
            else{
                response_data.error = "No leave credit record Found to update.";
            }
        }
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }

    /**
<<<<<<< HEAD
     * Updates an employee's leave credit.
     * @param {number} employee_id - Employee ID to update.
     * @param {number} leave_type_id - Leave type ID.
     * @param {number} earned_credit - Credits to add.
     * @param {number} current_credit - Updated current credit.
     * @param {number} latest_credit - Updated latest credit.
     * @param {Object} [connection=db] - Optional database connection.
     * @returns {Promise<Object>} response_data - Object containing status, result, or error.
     * Last Updated At: October 8, 2025
     * @author Keith
     */
    async updateEmployeeCredit(update_credit, connection = this.db) {
=======
     * Updates the latest leave credit record for an employee.
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
     * created by: Rogendher Keith Lachica
     * updated at: September 25 2025 12:30 am
     */
    static async updateLatestCredit(update_credit_data, connection = db){
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
        const response_data = { status: false, result: null, error: null };
        const { leave_credit_id, leave_transaction_id, leave_type_id, used_credit, latest_credit, current_credit, deducted_credit } = update_credit_data;

        try{
            const [update_credit_result] = await connection.execute(`
                UPDATE leave_credits
                SET 
                    earned_credit = ?, 
                    current_credit = ?, 
                    latest_credit = ?
                WHERE employee_id = ? AND leave_type_id = ?
            `, [ update_credit.earned_credit, update_credit.current_credit, update_credit.latest_credit, update_credit.employee_id,update_credit.leave_type_id]);

            if(update_credit_result.affectedRows){
                response_data.status = true;
                response_data.result = { affectedRows: update_credit_result.affectedRows };
            } 
            else {
                response_data.error = "Failed to update leave credit.";
            }

        } 
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }
    
    /**
    * Resets all leave credits to zero.
    * @returns {Promise<Object>} response_data - Object containing status, result, or error.
    * Last Updated At: October 8, 2025
    * @author Keith
    */
    async resetUpdateCredit(){
        const response_data = { status: false, result: null, error: null };
    
        try {
            const [reset_leave_credit] = await this.db.execute(`
                UPDATE leave_credits 
                INNER JOIN leave_types ON leave_types.id = leave_credits.leave_type_id
                SET 
                    leave_credits.earned_credit = ?,
                    leave_credits.current_credit = ?,
                    leave_credits.latest_credit = ?,
                    leave_credits.deducted_credit = ?,
                    leave_credits.used_credit = ?
                WHERE leave_types.is_carried_over = ?
            `, [DECIMAL_NUMBER.zero_point_zero_zero,DECIMAL_NUMBER.zero_point_zero_zero,DECIMAL_NUMBER.zero_point_zero_zero,DECIMAL_NUMBER.zero_point_zero_zero,DECIMAL_NUMBER.zero_point_zero_zero,IS_CARRIED_OVER.no]);
    
            if(reset_leave_credit.affectedRows){
                response_data.status = true;
                response_data.result = { affectedRows: reset_leave_credit.affectedRows };
            } 
            else{
                response_data.error = "No leave credits were reset.";
            }
    
        } 
        catch(error){
            response_data.error = error.message;
        }
    
        return response_data;
    }
    
    
    /**
    * Deducts leave credit for a specific leave credit record.
    * @param {number} credit_id - Leave credit record ID.
    * @param {number} total_leave - Total leave to deduct.
    * @param {Object} [connection=db] - Optional database connection.
    * @returns {Promise<Object>} response_data - Object containing status, result, or error.
    * Last Updated At: September 25, 2025
    * @author Keith
    */
    async leaveDeductedCredit(leave_deducted_credit, connection = this.db){
        const response_data = { status: false, result: null, error: null };
        const { credit_id, total_leave }= leave_deducted_credit;

        try{
            const [deduct_leave_credit] = await connection.execute(`
            UPDATE leave_credits
            SET 
                used_credit = used_credit + ?,
                deducted_credit = deducted_credit + ?,
                latest_credit = latest_credit - ?,
                earned_credit = earned_credit - ?
            WHERE id = ?
            `, [total_leave, total_leave, total_leave, total_leave, credit_id]);

            if(deduct_leave_credit.affectedRows){
                response_data.status = true;
                response_data.result = { credit_id, deducted: total_leave };
            }            
            else{
                response_data.error = "Leave credit record not Found or deduction Failed.";
            }
    
        } 
        catch(error){
            response_data.error = error.message;
        }
    
        return response_data;
    }

    /**
    * Fetches the latest employee credit with enough balance.
    * @param {number} employee_id - Employee ID.
    * @param {number} leave_type_id - Leave type ID.
    * @param {number} required_credit - Minimum required credit.
    * @returns {Promise<Object>} response_data - Object containing status, result, or error.
    * Last Updated At: September 25, 2025
    * @author Keith
    */
    async getEmployeeLatestCredit(latest_credit){
        const response_data = { status: false, result: null, error: null };
        const { employee_id, leave_type_id, required_credit } = latest_credit;
        
        try{
            const [get_latest_employee_credit] = await this.db.execute(`
                SELECT id, latest_credit, earned_credit
                FROM leave_credits
                WHERE employee_id = ?
                AND leave_type_id = ?
                AND latest_credit >= ?
                ORDER BY id DESC
                LIMIT ${NUMBER.one}
            `, [employee_id, leave_type_id, required_credit]);
    
            if(get_latest_employee_credit.length){
                response_data.status = true;
                response_data.result = get_latest_employee_credit[NUMBER.zero];
            } 
            else{
                response_data.error = "No latest credit record Found with enough balance.";
            }
        } 
        catch(error){
            response_data.error = error.message;
        }
    
        return response_data;
    }  

    /**
    * Fetches the latest credit record for a specific employee and leave type.
    * @param {number} employee_id - Employee ID.
    * @param {number} leave_type_id - Leave type ID.
    * @returns {Promise<Object>} response_data - Object containing status, result, or error.
    * Last Updated At: October 10, 2025
    * @author Keith
    */
    async getLatestCredit(latest_credit){
        const response_data = { status: false, result: null, error: null };
        const { employee_id, leave_type_id } = latest_credit;
        
        try{
            const [get_latest_record] = await this.db.execute(`
                SELECT * 
                FROM leave_credits 
                WHERE employee_id = ? AND leave_type_id = ?
                ORDER BY id DESC
                LIMIT ${NUMBER.one}
            `, [employee_id, leave_type_id]);

            if(get_latest_record.length){
                response_data.status = true;
                response_data.result = get_latest_record[NUMBER.zero];
            } 
            else {
                response_data.error = "No leave credit found for this employee and leave type.";
            }

        } 
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }  
 
    /**
    * Fetches employee leave credit summary for the current year.
    * @param {number} employee_id - Employee ID.
    * @param {number} leave_type_id - Leave type ID.
    * @returns {Promise<Object>} response_data - Object containing status, result, or error.
    * Last Updated At: September 25, 2025
    * @author Keith
    */
    async getEmployeeCredit(employee_id, leave_type_id){
        const response_data = { status: false, result: null, error: null };
        
        try{
            const [get_total_employee_credit] = await this.db.execute(`
                SELECT
                    leave_credits.employee_id,
                    employees.first_name,
                    employees.last_name,
                    employees.employee_role_type_id,
                    leave_credits.leave_type_id,
                    SUM(leave_credits.earned_credit) total_earned_credit,
                    SUM(leave_credits.used_credit) total_used_credit,
                    SUM(leave_credits.deducted_credit) total_deducted_credit,
                    SUM(leave_credits.latest_credit) total_latest_credit
                FROM leave_credits
                LEFT JOIN employees ON leave_credits.employee_id = employees.id
                WHERE leave_credits.employee_id = ?
                AND leave_credits.leave_type_id = ?
                AND YEAR(leave_credits.created_at) = YEAR(CURRENT_DATE())
                GROUP BY leave_credits.employee_id, leave_credits.leave_type_id
                ORDER BY leave_credits.employee_id DESC
            `, [employee_id, leave_type_id]);
            
            if(get_total_employee_credit.length){
                response_data.status = true;
                response_data.result = get_total_employee_credit[NUMBER.zero];
            } 
            else{
                response_data.error = "No leave credit found for this employee and leave type for the current year.";
            }        
        } 
        catch(error){
            response_data.error = error.message;
        }
    
        return response_data;
    }

    /**
     * Updates yearly leave credits for multiple employees.
     * @param {number} leave_type_id - Leave type ID.
     * @param {number} gain_credit - Credits to add.
     * @param {Array<number>} employee_ids - Array of employee IDs to update.
     * @returns {Promise<Object>} response_data - Object containing status, result, or error.
     * Last Updated At: October 14, 2025
     * @author Keith
     */
    async updateYearlyCreditBatch(update_yearly_credit, employee_id, leave_type_id){
        const response_data = { status: false, result: null, error: null };
        
        try {

            const [update_credit] = await this.db.execute(`
                UPDATE leave_credits
                SET 
                    earned_credit = ?, 
                    latest_credit = ?
                WHERE employee_id IN (?) 
                AND leave_type_id = ?
            `, [update_yearly_credit.earned_credit, , employee_id, leave_type_id]);
    
            if(update_credit.affectedRows){
                response_data.status = true;
                response_data.result = update_credit;
            } 
            else{
                response_data.error = "No leave credits were updated. Employees may have already received credit or do not exist.";
            }
    
        }
        catch(error){
            response_data.error = error.message;
        }
    
        return response_data;
    }
    
    /**
     * Gets employees who already received yearly leave credits.
     * @param {number} leave_type_id - Leave type ID.
     * @param {number} year - Year to filter by.
     * @returns {Promise<Object>} response_data - Object containing status, result, or error.
     * Last Updated At: October 14, 2025
     * @author Keith
     */
    async getEmployeeYearylyAddedCredit(yearly_added){
        const response_data = { status: false, result: null, error: null };

        try{
            const [get_employee_updated_credit] = await this.db.execute(`
                SELECT employee_id
                FROM leave_credits
                WHERE leave_type_id = ? 
                AND YEAR(updated_at) = ?
            `, [yearly_added.leave_type_id, yearly_added.year]);
    
            if(get_employee_updated_credit.length){
                response_data.status = true;
                response_data.result = get_employee_updated_credit[0];
            } 
            else{
                response_data.error = "No leave credit found for this leave type for the current year.";
            }
    
        } 
        catch(error){
            response_data.error = error.message;
        }
    
        return response_data;
    }

    /**
    * Gets employees who already received monthly leave credits.
    * @param {number} leave_type_id - Leave type ID.
    * @param {number} month - Month to filter by.
    * @param {number} year - Year to filter by.
    * @returns {Promise<Object>} response_data - Object containing status, result, or error.
    * Last Updated At: October 14, 2025
    * @author Keith
    */
    async getMonthlyCreditAdded(leave_type_id, month, year){
        const response_data = { status: false, result: null, error: null };
        
        try{
            const [get_employee_updated_credit] = await this.db.execute(`
                SELECT employee_id
                FROM leave_credits
                WHERE leave_type_id = ?
                AND MONTH(updated_at) = ?
                AND YEAR(updated_at) = ?
            `, [leave_type_id, month, year]);

            if(get_employee_updated_credit.length){
                response_data.status = true;
                response_data.result = get_employee_updated_credit;
            } 
            else{
                response_data.error = "No leave credit found for this leave type for the current month.";
            }
        } 
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }

    async updateMonthlyCredit(){
        const response_data = { status: false, result: null, error: null };
        
        try{
            const [monthly_earn] = await this.db.execute(`
                UPDATE leave_credits
                INNER JOIN leave_types ON leave_types.id = leave_credits.leave_type_id
                INNER JOIN(
                    SELECT employee_id
                    FROM attendances
                    GROUP BY employee_id
                    HAVING COUNT(time_out) = ? 
                ) 
                attendances ON attendances.employee_id = leave_credits.employee_id
                SET 
                    leave_credits.earned_credit = leave_credits.latest_credit + leave_types.gain_credit,
                    leave_credits.latest_credit = leave_credits.latest_credit + leave_types.gain_credit
                WHERE leave_types.is_carried_over = ?
                AND (leave_credits.updated_at IS NULL OR MONTH(leave_credits.updated_at) <> MONTH(NOW()) OR YEAR(leave_credits.updated_at) <> YEAR(NOW()))
            `, [ NUMBER.one, IS_CARRIED_OVER.yes ]);

            if(monthly_earn.affectedRows){
                response_data.status = true;
                response_data.result = monthly_earn;
            } 
            else{
                response_data.error = "No leave credits were updated. Employees may have already received credit or do not exist.";
            }
        } 
        catch(error){
            response_data.error = error.message;
        }
        return response_data;
    }

}

<<<<<<< HEAD
export default new LeaveCreditModel(); 
=======
export default LeaveCredit; 
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
