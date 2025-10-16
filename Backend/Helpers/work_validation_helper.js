class WorkValidation{
    
    /**
     * Validates the required fields for employee time-out entry.
     * @param {Object} param0 - Input data for validation.
     * @param {number|string} param0.id - Unique attendance ID.
     * @param {string|Date} param0.time_out - Time-out value (e.g., "18:00" or Date object).
     * @param {number} param0.work_hour - Total computed work hours (numeric).
     * @returns {Object} Validation result.
<<<<<<< HEAD:Backend/Helpers/work_validation_helper.js
     * @returns {boolean} return.is_valid - `true` if all validations pass, otherwise `false`.
     * @returns {string|null} return.error - Error message if invalid, otherwise `null`.
     * Last Updated At: October 1, 2025
     * @author Keith
=======
     * @returns {boolean} return.is_valid 
     * @returns {string|null} return.error
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 02:32 PM
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06:Backend/Helpers/work_time_validation_helper.js
     */
    validateEmployeeTimeOut({ id, time_out, work_hour }){
        const result_validation = { status: false, error: null };

        if(!id){
            result_validation.error = "Attendance ID is required.";
        }
        else if(!time_out){
            result_validation.error = "Time out is required.";
        }
        else if(work_hour === undefined || work_hour === null || isNaN(work_hour)){
            result_validation.error = "Work hour must be a valid number.";
        }
        else{
            result_validation.status = true;
        }

        return result_validation;
    }
}

<<<<<<< HEAD:Backend/Helpers/work_validation_helper.js
export default new WorkTimeValidationHelper();
=======
export default WorkValidation;
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06:Backend/Helpers/work_time_validation_helper.js
