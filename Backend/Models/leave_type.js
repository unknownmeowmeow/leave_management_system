import db from "../config/database.js";
import {
    LEAVE_STATUS, IS_CARRIED_OVER, GRANT_TYPE_ID, LEAVE_TYPE_ID,
<<<<<<< HEAD
    NUMBER,
    IS_ACTIVE
} from "../Constant/constants.js";

class LeaveTypeModel{
    constructor(connection = db){
        this.db = connection;
    }
=======
    NUMBER
} from "../constant/constants.js";

class LeaveType{
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06

    /**
     * Retrieves all leave types that can be carried over.
<<<<<<< HEAD
     * @returns {Promise<Object>} response_data - Contains status, result array of leave types, or error.
     * Last Updated At: October 2, 2025
     * @author Keith
=======
     * @returns {Promise<{status: boolean, result: Array<Object>|null, error: string|null}>} Response containing leave types or error message.
     * created by: Rogendher Keith Lachica
     * updated at: October 2 2025 9:30 am
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
     */
    async getAllLeaveTypes(){
        const response_data = { status: false, result: null, error: null };
    
        try{
            const [get_all_leave_type_credit_value] = await this.db.execute(`
                SELECT id, base_value
                FROM leave_types
                WHERE is_active = ?
            `, [IS_ACTIVE.yes]);
            
    
            if(get_all_leave_type_credit_value.length){
                response_data.status = true;
                response_data.result = get_all_leave_type_credit_value;
            } 
            else{
                response_data.error = "No leave type found";
            }
        } 
        catch(error){
            response_data.error = error.message;
        }
    
        return response_data;
    }
    
    
    /**
     * Retrieves active yearly leave types such as special privilege leave.
     * Used for yearly leave credit insertion and carry-over processing.
     * @returns {Promise<Object>} response_data - Contains status, result array, or error.
     * Last Updated At: October 8, 2025
     */
    async getYearlyLeaveType(){
        const response_data =  { status: false, result: null, error: null };
    
        try{
            const [get_carry_over_leave] = await this.db.execute(`
                SELECT id AS leave_type_id, gain_credit 
                FROM leave_types 
<<<<<<< HEAD
                WHERE is_active = ?
                AND id = ?;
            `, [LEAVE_STATUS.active, LEAVE_TYPE_ID.special_privilege_leave]);
=======
                WHERE is_carried_over = ? 
                AND is_active = ? AND id IN (?, ?)
            `, [IS_CARRIED_OVER.yes, LEAVE_STATUS.active, LEAVE_TYPE_ID.vacation_leave, LEAVE_TYPE_ID.sick_leave]);
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
    
            if(get_carry_over_leave.length){
                response_data.status = true;
                response_data.result = get_carry_over_leave;
            }
            else{
                response_data.error = "No carry over leave type Found";
            }
        } 
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }

    /**
<<<<<<< HEAD
     * Retrieves active monthly leave types such as vacation and sick leave.
     * Used for monthly leave credit insertion and carry-over computations.
     * @returns {Promise<Object>} response_data - Contains status, result array, or error.
     * Last Updated At: October 8, 2025
=======
     * Retrieves yearly leave types for adding leave credits.
     * @returns {Promise<{status: boolean, result: Array<Object>|null, error: string|null}>} Response containing yearly leave types or error message.
     * created by: Rogendher Keith Lachica
     * updated at: October 2 2025 9:30 am
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
     */
    async getMonthlyEarnLeaveType() {
        const response_data = { status: false, result: null, error: null };
    
        try {
            const leave_type_id = [LEAVE_TYPE_ID.vacation_leave,LEAVE_TYPE_ID.sick_leave].join(',');
    
            const [monthly_earn_leave] = await this.db.execute(`
                SELECT id, gain_credit 
                FROM leave_types 
                WHERE is_active = ?
                AND FIND_IN_SET(id, ?)
            `, [LEAVE_STATUS.active, leave_type_id]);
    
            if(monthly_earn_leave.length){
                response_data.status = true;
                response_data.result = monthly_earn_leave;
            } 
            else{
                response_data.error = "No active monthly leave types found.";
            }
        } 
        catch(error){
            response_data.error = error.message || "Database query failed.";
        }
    
        return response_data;
    }
    
    /**
     * Retrieves all default leave types.
<<<<<<< HEAD
     * @returns {Promise<Object>} response_data - Contains status, result array, or error.
     * Last Updated At: October 2, 2025
=======
     * @returns {Promise<{status: boolean, result: Array<Object>|null, error: string|null}>} Response containing default leave types or error message.
     * created by: Rogendher Keith Lachica
     * updated at: October 2 2025 9:30 am
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
     */
    async getDefaultLeave(){
        const response_data =  { status: false, result: null, error: null };

        try{
            const [get_leave_default_type] = await this.db.execute(`
                SELECT *
                FROM leave_types
            `);

            if(get_leave_default_type.length){
                response_data.status = true;
                response_data.result = get_leave_default_type;
            }
            else{
                response_data.error = "No active default leave types Found.";
            }
        }
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }

    /**
     * Retrieves all special and rewarded leave types.
<<<<<<< HEAD
     * @returns {Promise<Object>} response_data - Contains status, result array, or error.
     * Last Updated At: October 2, 2025
=======
     * @returns {Promise<{status: boolean, result: Array<Object>|null, error: string|null}>} Response containing special and rewarded leave types or error message.
     * created by: Rogendher Keith Lachica
     * updated at: October 2 2025 9:30 am
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
     */
    async getRewardedLeave(){
        const response_data =  { status: false, result: null, error: null };

        try{
            const [get_special_rewarded_type] = await this.db.execute(`
                SELECT 
                    leave_types.id, 
                    leave_types.name
                FROM leave_types
                LEFT JOIN leave_type_grant_types ON leave_types.leave_type_grant_type_id = leave_type_grant_types.id
                WHERE leave_types.is_active = ? 
                AND leave_types.leave_type_grant_type_id IN (?, ?)
            `, [LEAVE_STATUS.active, GRANT_TYPE_ID.special, GRANT_TYPE_ID.rewarded]);

            if(get_special_rewarded_type.length){
                response_data.status = true;
                response_data.result = get_special_rewarded_type;
            }
            else{
                response_data.error = "No active special and rewarded leave types Found."; 
            }
        }
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }
    
    /**
     * Retrieves leave type details by its ID.
     * @param {number} leave_type_id - The ID of the leave type to retrieve.
<<<<<<< HEAD
     * @returns {Promise<Object>} response_data - Contains status, result object, or error.
     * Last Updated At: October 2, 2025
=======
     * @returns {Promise<{status: boolean, result: Object|null, error: string|null}>} Response containing leave type data or error message.
     * created by: Rogendher Keith Lachica
     * updated at: October 2 2025 9:30 am
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
     */
    async getAllLeaveId(leave_type_id){
        const response_data =  { status: false, result: null, error: null };

        try{
            const [get_leave_type_id] = await this.db.execute(`
                SELECT *
                FROM leave_types
                WHERE id = ? AND is_active = ?
            `, [leave_type_id, LEAVE_STATUS.active]);

            if(get_leave_type_id.length){
                response_data.status = true;
                response_data.result = get_leave_type_id[NUMBER.zero];
            } 
            else{
                response_data.error = "Error in get all leave type by ID.";
            }
        } 
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }

    /**
<<<<<<< HEAD
     * Updates the status of a leave transaction.
     * @param {number} leave_id - The ID of the leave transaction to update.
     * @param {number} status_id - The new status ID to set.
     * @returns {Promise<Object>} response_data - Contains status, result object, or error.
     * Last Updated At: October 2, 2025
=======
     * Retrieves all leave transactions from all employees.
     * @returns {Promise<{status: boolean, result: Array<Object>|null, error: string|null}>} Response containing leave transactions or error message.
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
     * @param {number} employee_id - The ID of the employee to filter leave transactions.
     * @returns {Promise<{status: boolean, result: Array<Object>|null, error: string|null}>} Response containing leave transactions or error message.
     * created by: Rogendher Keith Lachica
     * updated at: October 2 2025 9:30 am
     */
    static async getAllLeaveTransactionByEmployeeId(employee_id){
        const response_data = { status: false, result: null, error: null };
    
        try{
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
     * @param {number} leave_id - The ID of the leave transaction to update.
     * @param {number} status_id - The new status ID to set.
     * @returns {Promise<{status: boolean, result: Object|null, error: string|null}>} Response indicating success or failure.
     * created by: Rogendher Keith Lachica
     * updated at: October 2 2025 9:30 am
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
     */
    async updateLeaveStatus(update_leave_status){
        const response_data =  { status: false, result: null, error: null };
        const { leave_id, status_id } = update_leave_status;

        try{
            const [update_leave_status] = await this.db.execute(`
                UPDATE leave_transactions
                SET 
                    leave_transaction_status_id = ?
                WHERE id = ?
            `, [status_id, leave_id]);
    
            if(update_leave_status.affectedRows){
                response_data.status = true;
                response_data.result = { LeaveId: leave_id, StatusId: status_id };
            } 
            else{
                response_data.error = "Leave transaction update Failed.";
            }
        } 
        catch(error){
            response_data.error = error.message;
        }
    
        return response_data;
    }
    


    /**
<<<<<<< HEAD
     * Retrieves all leave types that are active and do not carry over to the next period.
     * Used for resetting employee leave credits at the end of a leave cycle.
     * @returns {Promise<Object>} response_data - Contains status, result array, or error.
     * Last Updated At: October 8, 2025
=======
     * Retrieves all leave transactions for a specific employee filtered by status.
     * @param {number} employee_id - The ID of the employee to filter leaves.
     * @param {number} [status=2] - The status ID to filter leave transactions (default is 2).
     * @returns {Promise<{status: boolean, result: Array<Object>|null, error: string|null}>} Response containing leave transactions or error message.
     * created by: Rogendher Keith Lachica
     * updated at: October 2 2025 9:30 am
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
     */
    async getNotCarryOverLeave(){
        const response_data = { status: false, result: null, error: null };
    
        try{
            const [leave_types] = await this.db.execute(`
                SELECT *
                FROM leave_types
                WHERE is_carried_over = ?
            `, [ IS_CARRIED_OVER.no]);
            
            if(leave_types.length){
                response_data.status = true;
                response_data.result = leave_types;
            } 
            else{
                response_data.error = "No leave types Found that do not carry over.";
            }
        } 
        catch(error){
            response_data.error = error.message;
        }
    
        return response_data;
    }
    
}

<<<<<<< HEAD
export default new LeaveTypeModel();
=======
export default LeaveType; 
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
