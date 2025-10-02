import db from "../Configs/database.js";

class EmployeeGenderModel{

    /**
     * Get a gender record by ID.
     * @param {number} genderId - The ID of the gender to retrieve.
     * @returns {Promise<Object>} An object containing the query status, result, and error if any.
     * @property {boolean} status - Indicates success or failure of the query.
     * @property {Object|null} result - The retrieved gender record or null if not found.
     * @property {string|null} error - Error message if the query fails or data is not found.
     * created by: rogendher keith lachica
     * updated at: September 20 2025 4:18 pm  
     */
    static async getGenderById(id){
        const response_data =  { status: false, result: null, error: null };

        try{
            const [get_gender_by_id_result] = await db.execute(`
                SELECT 
                    * 
                FROM 
                    employee_genders 
                WHERE 
                    id = ?
            `, [id]);

            if(get_gender_by_id_result.length){
                response_data.status = true;
                response_data.result = get_gender_by_id_result;
            } 
            else{
                response_data.error = "gender record not found in model";
            }
        }
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }

}

export default EmployeeGenderModel;
