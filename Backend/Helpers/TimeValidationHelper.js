class TimeValidationHelper {

    /**
    * Gets the current date and time in the Asia/Manila timezone (Philippines),
    * formatted as a string in the format "YYYY-MM-DD HH:MM:SS".
    *
    * @returns {string} - The current local date and time in the Philippines.
    * created by: rogendher keith lachica
    * updated at: September 23 2025 9:55 am  
    */
    static checkEmployeeCurrentTime(){

        const philippines_local_datetime = new Date().toLocaleString("en-PH", {
            timeZone: "Asia/Manila",
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        const [date, time] = philippines_local_datetime.split(', ');
        const [month, day, year] = date.split('/');

        return `${year}-${month}-${day} ${time}`;
    }
    /**
     * Calculates the difference in hours worked compared to the default 8 hours.
     * Positive result = Overtime
     * Negative result = Undertime
     * 0.00 = Exactly 8 hours
     * 
     * @param {Date} start_time - The start time as a JavaScript Date object
     * @param {Date} end_time - The end time as a JavaScript Date object
     * @returns {number} - Difference from 8 hours, rounded to 2 decimal places
     * created by: rogendher keith lachica
     * updated at: September 23 2025 11:26 am  
     */
    static calculateEmployeeWorkHour(time_in, time_out) {
        const start_time = new Date(time_in);
        const end_time = new Date(time_out);

        if(isNaN(start_time.getTime()) || isNaN(end_time.getTime()) || end_time < start_time){
            return 0;
        }
        const day_of_week = start_time.getDay();
        const is_weekend = (day_of_week === 0 || day_of_week === 6);
    
        const milliseconds_worked = end_time - start_time;
        const hours_worked = milliseconds_worked / (1000 * 60 * 60);
    
        const default_day = 24;
        const default_hour_work = 8 / default_day;
        const default_day_converter = hours_worked / default_day;
        const difference_day_work = default_day_converter - default_hour_work;
    
        let calculated = Math.round(difference_day_work * 10000) / 10000;
    
        if(is_weekend && calculated <= 0) {
            calculated = Math.abs(calculated) || 0.33; 
        }
    
        return calculated;
    }
     /**
     * Computes the earned and deducted leave credits based on work hours.
     *
     * - Positive work hours: Earned credit = work_hour * 1.5
     * - Negative work hours: Deducted credit = absolute value of work_hour
     * - 0 hours: No changes
     *
     * @param {number} work_hour - The total hours worked difference from standard
     * @param {number} current_credit - The current/latest credit before this calculation
     * @returns {Object} - Object containing earned_credit, deducted_credit, latest_credit
     * created by: rogendher keith lachica
     * updated at: September 24 2025 11:10 pm  
     */
     static computeLeaveCreditFromWorkHour(work_hour, current_credit){
        let earned_credit = 0;
        let deducted_credit = 0;
        let latest_credit = current_credit;

        if(work_hour > 0){
            earned_credit = work_hour * 1.5;
            latest_credit = current_credit + earned_credit;
        }
        else if(work_hour < 0){
            deducted_credit = Math.abs(work_hour);
            latest_credit = current_credit - deducted_credit;
        }

        return {
            earned_credit,
            deducted_credit,
            latest_credit
        };
    }
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

export default TimeValidationHelper;
