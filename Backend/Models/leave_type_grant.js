import db from "../Configs/database.js";

class LeaveTypeGrantModel{

    /**
     * Retrieves the grant type record by its name.
     *
     * Workflow:
     * 1. Executes a SELECT query to find a grant type with the specified name.
     * 2. If found, returns status `true` along with the grant type record(s).
     * 3. If not found, returns status `false` with an error message.
     * 4. Catches and handles any database or execution errors.
     *
     * @param {string} name - The name of the grant type to retrieve.
     * @returns {Promise<{status: boolean, result: Array<Object>|null, error: string|null}>} Response object containing status, result array, or error message.
     *
     * created by: Rogendher Keith Lachica
     * updated at: September 25 2025 4:00 am
     */
    static async getGrantTypeName(name){
        const response_data = { status: false, result: null, error: null };

        try{
            const [get_grant_type] = await db.execute(`
                SELECT id, name 
                FROM leave_type_grant_types 
                WHERE name = ?
            `, [name]);

            if(get_grant_type.length){
                response_data.status = true;
                response_data.result = get_grant_type_name;
            } 
            else{
                response_data.error = "Grant type error";
            }
        } 
        catch(error){
            response_data.error = error.message;
        }
        return response_data;
    }

}

export default LeaveTypeGrantModel; 
