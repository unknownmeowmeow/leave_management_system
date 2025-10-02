import db from "../Configs/database.js";

class EmployeeGenderModel{

    /**
     * Retrieves a gender record from the database by its ID.
     *
     * Workflow:
     * 1. **Execute Select Query**
     *    - Queries the `employee_genders` table filtering by the given `id`.
     *
     * 2. **Return Result**
     *    - If a record is found, returns status `true` with the gender data.
     *    - If no record is found, returns status `false` with an error message.
     *
     * 3. **Error Handling**
     *    - Catches and returns any database or execution errors.
     *
     * @param {number} id - The ID of the gender to retrieve.
     * @returns {Object} response_data - Object containing:
     *    - status: Boolean indicating success or failure.
     *    - result: Array with the gender record if successful.
     *    - error: Error message if not found or on failure.
     *
     * created by: [Your Name]
     * updated at: [Update Date & Time]
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
