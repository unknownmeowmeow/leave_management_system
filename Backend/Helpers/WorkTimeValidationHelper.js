import {VALIDATION_EMPLOYEE_TIMEOUT_ERROR, VALIDATION_EMPLOYEE_ID_ERROR,
    VALIDATION_EMPLOYEE_WORK_HOUR_ERROR
} from "../Constant/Constants.js";

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
            result_validation.error = VALIDATION_EMPLOYEE_ID_ERROR;
        }
        else if(!time_out){
            result_validation.error = VALIDATION_EMPLOYEE_TIMEOUT_ERROR;
        }
        else if(work_hour === undefined || work_hour === null || isNaN(work_hour)){
            result_validation.error = VALIDATION_EMPLOYEE_WORK_HOUR_ERROR;
        }
        else{
            result_validation.is_valid = true;
        }

        return result_validation;
    }
}

export default WorkTimeValidationHelper;