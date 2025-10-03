import db from "../Configs/database.js";

class EmployeeGenderModel{

    /**
     * Retrieves a gender record from the database by its ID.
     *
     * @param {number} id - The ID of the gender to retrieve.
     * @returns {Object} response_data - Object containing:
     *    - status: Boolean indicating success or failure.
     *    - result: Array with the gender record if successful.
     *    - error: Error message if not found or on failure.
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 03:18 PM
     */ 
    static async getGenderById(id){
        const response_data =  { status: false, result: null, error: null };

        try{
            const [get_gender_id] = await db.execute(`
                SELECT * 
                FROM employee_genders 
                WHERE id = ?
            `, [id]);

            if(get_gender_id.length){
                response_data.status = true;
                response_data.result = get_gender_id;
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
