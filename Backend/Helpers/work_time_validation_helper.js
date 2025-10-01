class WorkTimeValidationHelper{
    
    /**
     * Validates the required fields for employee time-out entry.
     *
     * Workflow:
     * 1. **Attendance ID Check**
     *    - Ensures `id` is provided.
     *    - If missing → sets error: `"Attendance ID is required."`.
     *
     * 2. **Time Out Check**
     *    - Ensures `time_out` value is provided.
     *    - If missing → sets error: `"Time out is required."`.
     *
     * 3. **Work Hour Check**
     *    - Ensures `work_hour` is not `undefined` or `null` and is a valid number.
     *    - If invalid → sets error: `"Work hour must be a valid number."`.
     *
     * 4. **Valid Case**
     *    - If all validations pass → sets `is_valid: true`.
     *
     * Example Success:
     * {
     *   is_valid: true,
     *   error: null
     * }
     *
     * Example Failure:
     * {
     *   is_valid: false,
     *   error: "Time out is required."
     * }
     *
     * @param {Object} param0 - Input data for validation.
     * @param {number|string} param0.id - Unique attendance ID.
     * @param {string|Date} param0.time_out - Time-out value (e.g., "18:00" or Date object).
     * @param {number} param0.work_hour - Total computed work hours (numeric).
     *
     * @returns {Object} Validation result.
     * @returns {boolean} return.is_valid - `true` if all validations pass, otherwise `false`.
     * @returns {string|null} return.error - Error message if invalid, otherwise `null`.
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 02:32 PM
     */
    static validateEmployeeTimeOut({ id, time_out, work_hour }){
        const result_validation = { is_valid: false, error: null };

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
            result_validation.is_valid = true;
        }

        return result_validation;
    }
}

export default WorkTimeValidationHelper;