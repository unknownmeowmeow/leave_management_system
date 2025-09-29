class WorkTimeValidationHelper{
    
    /**
    * Validates the employee's time-out entry.
    *
    * Checks for the presence of required fields: `id`, `time_out`, and `work_hour`.
    * Ensures `work_hour` is a valid number.
    *
    * @param {Object} params - The input parameters.
    * @param {number|string} params.id - The attendance record ID.
    * @param {string} params.time_out - The time out string (usually in "YYYY-MM-DD HH:MM:SS" format).
    * @param {number} params.work_hour - The number of hours worked.
    *
    * @returns {Object} - An object containing:
    *                     - is_valid: Boolean indicating if validation passed.
    *                     - error: Error message if validation failed, otherwise null.
    * created by: rogendher keith lachica
    * updated at: September 23 2025 1:45 pm  
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