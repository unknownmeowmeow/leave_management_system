import db from "../Configs/database.js";
import {
    LEAVE_STATUS, IS_CARRIED_OVER, GRANT_TYPE_ID, LEAVE_TYPE_ID,
    NUMBER
} from "../Constant/constants.js";

class LeaveTypeModel{

     /**
     * Retrieves all leave types that can be carried over.
     *
     * Workflow:
     * 1. Executes a SELECT query to find leave types marked as carried over and active.
     * 2. Returns status `true` with the leave types if any are found.
     * 3. Returns status `false` with an error message if none are found.
     * 4. Handles any database or execution errors gracefully.
     *
     * @returns {Promise<{status: boolean, result: Array<Object>|null, error: string|null}>} Response containing leave types or error message.
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 2 2025 9:30 am
     */
    static async getAllCarryOverLeaveTypes(){
        const response_data =  { status: false, result: null, error: null };
    
        try{
            const [get_carry_over_leave] = await db.execute(`
                SELECT id, base_value 
                FROM leave_types 
                WHERE is_carried_over = ? 
                AND is_active = ? 
                AND id IN (?, ?)
            `, [IS_CARRIED_OVER.yes, LEAVE_STATUS.active, LEAVE_TYPE_ID.vacation_leave, LEAVE_TYPE_ID.sick_leave]);
    
            if(get_carry_over_leave.length){
                response_data.status = true;
                response_data.result = get_carry_over_leave;
            }
            else{
                response_data.error = "No carry over leave type found";
            }
        }
        catch(error){
            response_data.error = error.message;
        }
    
        return response_data;
    }
    

    /**
     * Retrieves yearly leave types for adding leave credits.
     *
     * Workflow:
     * 1. Executes a SELECT query to find yearly leave types by their IDs.
     * 2. Returns status `true` with the leave types if found.
     * 3. Returns status `false` with an error message if none are found.
     * 4. Handles any database or execution errors gracefully.
     *
     * @returns {Promise<{status: boolean, result: Array<Object>|null, error: string|null}>} Response containing yearly leave types or error message.
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 2 2025 9:30 am
     */
    static async GetYearlyLeaveTypeAdding(){
        const response_data =  { status: false, result: null, error: null };

        try{
            const [get_yearly_add_leavetype] = await db.execute(`
                SELECT * 
                FROM leave_types 
                WHERE id IN (?, ?, ?)
            `, [LEAVE_TYPE_ID.vacation_leave, LEAVE_TYPE_ID.sick_leave, LEAVE_TYPE_ID.vacation_leave]);

            if(get_yearly_add_leavetype.length){
                response_data.status = true;
                response_data.result = get_yearly_add_leavetype;
            }
            else{
                response_data.error = "No carry over leave type found";  
            }
        }
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }

    /**
     * Retrieves all default leave types.
     *
     * Workflow:
     * 1. Executes a SELECT query to find leave types with a default grant type and active status.
     * 2. Returns status `true` with the leave types if found.
     * 3. Returns status `false` with an error message if none are found.
     * 4. Handles any database or execution errors gracefully.
     *
     * @returns {Promise<{status: boolean, result: Array<Object>|null, error: string|null}>} Response containing default leave types or error message.
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 2 2025 9:30 am
     */
    static async getAllLeaveDefaultType(){
        const response_data =  { status: false, result: null, error: null };

        try{
            const [get_leave_default_type] = await db.execute(`
                SELECT 
                    leave_types.id, 
                    leave_types.name
                FROM leave_types
                LEFT JOIN leave_type_grant_types ON leave_types.leave_type_grant_type_id = leave_type_grant_types.id
                WHERE leave_types.leave_type_grant_type_id = ? AND leave_types.is_active = ?
            `, [GRANT_TYPE_ID.default, LEAVE_STATUS.active]);

            if(get_leave_default_type.length){
                response_data.status = true;
                response_data.result = get_leave_default_type;
            }
            else{
                response_data.error = "No active default leave types found.";
            }
        }
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }

    /**
     * Retrieves all special and rewarded leave types.
     *
     * Workflow:
     * 1. Executes a SELECT query to find leave types with special or rewarded grant types and active status.
     * 2. Returns status `true` with the leave types if found.
     * 3. Returns status `false` with an error message if none are found.
     * 4. Handles any database or execution errors gracefully.
     *
     * @returns {Promise<{status: boolean, result: Array<Object>|null, error: string|null}>} Response containing special and rewarded leave types or error message.
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 2 2025 9:30 am
     */
    static async getAllSpecialAndRewardedLeaveType(){
        const response_data =  { status: false, result: null, error: null };

        try{
            const [get_special_rewarded_type] = await db.execute(`
                SELECT 
                    leave_types.id, 
                    leave_types.name
                FROM leave_types
                LEFT JOIN leave_type_grant_types ON leave_types.leave_type_grant_type_id = leave_type_grant_types.id
                WHERE leave_types.is_active = ? AND leave_types.leave_type_grant_type_id IN (?, ?)
            `, [LEAVE_STATUS.active, GRANT_TYPE_ID.special, GRANT_TYPE_ID.rewarded]);

            if(get_special_rewarded_type.length){
                response_data.status = true;
                response_data.result = get_special_rewarded_type;
            }
            else{
                response_data.error = "No active special and rewarded leave types found."; 
            }
        }
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }
    
     /**
     * Retrieves leave type details by its ID.
     *
     * Workflow:
     * 1. Executes a SELECT query to find the leave type with the specified ID and active status.
     * 2. If found, returns status `true` with the leave type data.
     * 3. If not found, returns status `false` with an error message.
     * 4. Handles any database or execution errors gracefully.
     *
     * @param {number} leave_type_id - The ID of the leave type to retrieve.
     * @returns {Promise<{status: boolean, result: Object|null, error: string|null}>} Response containing leave type data or error message.
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 2 2025 9:30 am
     */
    static async getLeaveTypeById(leave_type_id) {
        const response_data =  { status: false, result: null, error: null };

        try {
            const [get_leave_type_id] = await db.execute(`
                SELECT 
                    id, 
                    name, 
                    is_carried_over, 
                    notice_day, 
                    leave_type_grant_type_id, 
                    leave_type_rule_id, 
                    base_value
                FROM leave_types
                WHERE id = ? AND is_active = ?
            `, [leave_type_id, LEAVE_STATUS.active]);

            if(get_leave_type_id.length){
                response_data.status = true;
                response_data.result = get_leave_type_id[NUMBER.zero];
            } 
            else{
                response_data.error = "error in get all leave type by id";
            }
        } 
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }

    /**
     * Retrieves all leave transactions from all employees.
     *
     * Workflow:
     * 1. Executes a SELECT query to get all leave transactions joined with employee, leave type, grant type, and status details.
     * 2. Returns status `true` with leave transaction records if found.
     * 3. Returns status `false` with an error message if none are found.
     * 4. Handles any database or execution errors gracefully.
     *
     * @returns {Promise<{status: boolean, result: Array<Object>|null, error: string|null}>} Response containing leave transactions or error message.
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 2 2025 9:30 am
     */
    static async getAllEmployeeLeaveTransaction(){
        const response_data = { status: false, result: null, error: null };
    
        try{
            const [get_all_employee_transaction] = await db.execute(`
                SELECT 
                    leave_transactions.id,
                    CONCAT(employees.first_name, ' ', employees.last_name) AS employee_name,
                    leave_types.name AS leave_type,
                    leave_type_grant_types.name AS grant_type_name, 
                    leave_transactions.start_date,
                    leave_transactions.end_date,
                    leave_transactions.reason,
                    leave_transaction_statuses.name AS status,
                    CONCAT(rewarder.first_name, ' ', rewarder.last_name) AS rewarded_by,
                    CONCAT(approver.first_name, ' ', approver.last_name) AS approved_by
                FROM leave_transactions
                INNER JOIN employees ON employees.id = leave_transactions.employee_id
                INNER JOIN leave_types ON leave_types.id = leave_transactions.leave_type_id
                INNER JOIN leave_type_grant_types ON leave_type_grant_types.id = leave_types.leave_type_grant_type_id
                LEFT JOIN leave_transaction_statuses ON leave_transaction_statuses.id = leave_transactions.leave_transaction_status_id
                LEFT JOIN employees AS rewarder ON rewarder.id = leave_transactions.rewarded_by_id
                LEFT JOIN employees AS approver ON approver.id = leave_transactions.approved_by_id
                ORDER BY leave_transactions.id DESC;
            `);
    
            if(get_all_employee_transaction.length){
                response_data.status = true;
                response_data.result = get_all_employee_transaction;
            } 
            else{
                response_data.error = "No leave transactions found.";
            }
        } 
        catch(error){
            response_data.error = error.message;
        }
    
        return response_data;
    }

     /**
     * Retrieves all leave transactions for a specific employee.
     *
     * Workflow:
     * 1. Executes a SELECT query to get leave transactions filtered by employee ID.
     * 2. Returns status `true` with leave transaction records if found.
     * 3. Returns status `false` with an error message if none are found.
     * 4. Handles any database or execution errors gracefully.
     *
     * @param {number} employee_id - The ID of the employee to filter leave transactions.
     * @returns {Promise<{status: boolean, result: Array<Object>|null, error: string|null}>} Response containing leave transactions or error message.
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 2 2025 9:30 am
     */
    static async getAllLeaveTransactionByEmployeeId(employee_id) {
        const response_data = { status: false, result: null, error: null };
    
        try {
            const [get_transaction_by_id] = await db.execute(`
                SELECT 
                    leave_transactions.id,
                    CONCAT(employees.first_name, ' ', employees.last_name) AS employee_name,
                    leave_types.name AS leave_type,
                    leave_type_grant_types.name AS grant_type_name, 
                    leave_transactions.start_date,
                    leave_transactions.end_date,
                    leave_transactions.reason,
                    leave_transaction_statuses.name AS status,
                    CONCAT(rewarder.first_name, ' ', rewarder.last_name) AS rewarded_by,
                    CONCAT(approver.first_name, ' ', approver.last_name) AS approved_by
                FROM leave_transactions
                INNER JOIN employees ON employees.id = leave_transactions.employee_id
                INNER JOIN leave_types ON leave_types.id = leave_transactions.leave_type_id
                INNER JOIN leave_type_grant_types ON leave_type_grant_types.id = leave_types.leave_type_grant_type_id
                LEFT JOIN leave_transaction_statuses ON leave_transaction_statuses.id = leave_transactions.leave_transaction_status_id
                LEFT JOIN employees AS rewarder ON rewarder.id = leave_transactions.rewarded_by_id
                LEFT JOIN employees AS approver ON approver.id = leave_transactions.approved_by_id
                WHERE leave_transactions.employee_id = ?
                ORDER BY leave_transactions.id DESC;
            `, [employee_id]);
    
            if(get_transaction_by_id.length){
                response_data.status = true;
                response_data.result = get_transaction_by_id; 
            } 
            else{
                response_data.error = "No leave transactions found.";
            }
        } 
        catch(error){
            response_data.error = error.message;
        }
    
        return response_data;
    }

    /**
     * Updates the status of a leave transaction.
     *
     * Workflow:
     * 1. Executes an UPDATE query to change the leave transaction status for a given leave ID.
     * 2. Returns status `true` with updated leave ID and status if the update is successful.
     * 3. Returns status `false` with an error message if no rows were affected or status unchanged.
     * 4. Handles any database or execution errors gracefully.
     *
     * @param {number} leave_id - The ID of the leave transaction to update.
     * @param {number} status_id - The new status ID to set.
     * @returns {Promise<{status: boolean, result: Object|null, error: string|null}>} Response indicating success or failure.
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 2 2025 9:30 am
     */
    static async updateLeaveStatus(leave_id, status_id){
        const response_data =  { status: false, result: null, error: null };
    
        try{
            const [update_leave_status] = await db.execute(`
                UPDATE leave_transactions
                SET 
                    leave_transaction_status_id = ?, 
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `, [status_id, leave_id]);
    
            if(update_leave_status.affectedRows){
                response_data.error = "Leave transaction not found or status unchanged.";
            } 
            else{
                response_data.status = true;
                response_data.result = { leave_id, status_id };
            }
        } 
        catch(error){
            response_data.error = error.message;
        }
    
        return response_data;
    }
    
    /**
     * Retrieves all leave transactions for a specific employee filtered by status.
     * @param {number} employee_id - The ID of the employee to filter leaves.
     * @param {number} [status=2] - The status ID to filter leave transactions (default is 2).
     * @returns {Promise<{status: boolean, result: Array<Object>|null, error: string|null}>} Response containing leave transactions or error message.
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 2 2025 9:30 am
     */
    static async getAllByEmployeeRecordLeaves(){
        const response_data =  { status: false, result: null, error: null };
    
        try{
            const [get_all_employee_record] = await db.execute(`
                SELECT 
                    leave_transactions.id,
                    CONCAT(employees.first_name, ' ', employees.last_name) employee_name,
                    leave_types.name leave_type,
                    leave_type_grant_types.name grant_type_name,
                    leave_transactions.start_date,
                    leave_transactions.end_date,
                    leave_transactions.reason,
                    leave_transaction_statuses.name status,
                    CONCAT(rewarded.first_name, ' ', rewarded.last_name) rewarded_by,
                    CONCAT(approved.first_name, ' ', approved.last_name) approved_by
                FROM leave_transactions
                INNER JOIN employees ON employees.id = leave_transactions.employee_id
                INNER JOIN leave_types ON leave_types.id = leave_transactions.leave_type_id
                INNER JOIN leave_type_grant_types ON leave_type_grant_types.id = leave_types.leave_type_grant_type_id
                LEFT JOIN leave_transaction_statuses ON leave_transaction_statuses.id = leave_transactions.leave_transaction_status_id
                LEFT JOIN employees rewarded ON rewarded.id = leave_transactions.rewarded_by_id
                LEFT JOIN employees approved ON approved.id = leave_transactions.approved_by_id
                ORDER BY leave_transactions.id DESC;
            `);
    
            if(get_all_employee_record.length){
                response_data.status = true;
                response_data.result = get_all_employee_record;
            } 
            else{
                response_data.error = "No leave transactions found.";
            }
        } 
        catch(error){
            response_data.error = error.message;
        }
    
        return response_data;
    }
    
}

export default LeaveTypeModel; 
