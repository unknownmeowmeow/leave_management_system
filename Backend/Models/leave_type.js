import db from "../Configs/database.js";
import {
    LEAVE_STATUS, IS_CARRIED_OVER, GRANT_TYPE_ID, LEAVE_TYPE_ID,
    NUMBER,
    IS_ACTIVE
} from "../Constant/constants.js";

class LeaveTypeModel{
    constructor(connection = db){
        this.db = connection;
    }

    /**
     * Retrieves all leave types that can be carried over.
     * @returns {Promise<Object>} response_data - Contains status, result array of leave types, or error.
     * Last Updated At: October 2, 2025
     * @author Keith
     */
    async getAllLeaveTypes() {
        const response_data = { status: false, result: null, error: null };
    
        try {
            const leave_type_id = Object.values(LEAVE_TYPE_ID);
            const employee_id = leave_type_id.map(() => "?").join(",");
            
            const [get_all_leave_type_credit_value] = await this.db.execute(`
                SELECT id, base_value 
                FROM leave_types 
                WHERE is_active = ?
                AND id IN (${employee_id})
            `, [IS_ACTIVE.yes, ...leave_type_id]);
            
    
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
                WHERE is_active = ?
                AND id = ?;
            `, [LEAVE_STATUS.active, LEAVE_TYPE_ID.special_privilege_leave]);
    
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
     * Retrieves active monthly leave types such as vacation and sick leave.
     * Used for monthly leave credit insertion and carry-over computations.
     * @returns {Promise<Object>} response_data - Contains status, result array, or error.
     * Last Updated At: October 8, 2025
     */
    async getMonthlyEarnLeaveType() {
        const response_data = { status: false, result: null, error: null };
    
        try {
            const leave_type_id = [LEAVE_TYPE_ID.vacation_leave,LEAVE_TYPE_ID.sick_leave];
    
            const employee_id = leave_type_id.map(() => "?").join(",");
    
            const [monthly_earn_leave] = await this.db.execute(`
                SELECT id, gain_credit 
                FROM leave_types 
                WHERE is_active = ?
                AND id IN (${employee_id})
            `, [LEAVE_STATUS.active, ...leave_type_id]);
    
            if(monthly_earn_leave.length > NUMBER.zero){
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
     * Retrieves yearly leave types for adding leave credits.
     * @returns {Promise<Object>} response_data - Contains status, result array, or error.
     * Last Updated At: October 2, 2025
     */
    async yearlyEarnLeaveType(){
        const response_data =  { status: false, result: null, error: null };

        try{
            const [get_yearly_add_leavetype] = await this.db.execute(`
                SELECT * 
                FROM leave_types 
                WHERE id IN (?, ?)
            `, [LEAVE_TYPE_ID.sick_leave, LEAVE_TYPE_ID.vacation_leave]);

            if(get_yearly_add_leavetype.length){
                response_data.status = true;
                response_data.result = get_yearly_add_leavetype;
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
     * Retrieves all default leave types.
     * @returns {Promise<Object>} response_data - Contains status, result array, or error.
     * Last Updated At: October 2, 2025
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
     * @returns {Promise<Object>} response_data - Contains status, result array, or error.
     * Last Updated At: October 2, 2025
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
     * @returns {Promise<Object>} response_data - Contains status, result object, or error.
     * Last Updated At: October 2, 2025
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
     * Updates the status of a leave transaction.
     * @param {number} leave_id - The ID of the leave transaction to update.
     * @param {number} status_id - The new status ID to set.
     * @returns {Promise<Object>} response_data - Contains status, result object, or error.
     * Last Updated At: October 2, 2025
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
     * Retrieves all leave types that are active and do not carry over to the next period.
     * Used for resetting employee leave credits at the end of a leave cycle.
     * @returns {Promise<Object>} response_data - Contains status, result array, or error.
     * Last Updated At: October 8, 2025
     */
    async getNotCarryOverLeave(){
        const response_data = { status: false, result: null, error: null };
    
        try{
            const [leave_types] = await this.db.execute(`
                SELECT *
                FROM leave_types
                WHERE is_active = ? AND is_carried_over = ?
            `, [LEAVE_STATUS.active, IS_CARRIED_OVER.no]);
            
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

export default new LeaveTypeModel();
