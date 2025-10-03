import { DAY_COUNT, NUMBER, DAY_TIME, WORK_HOUR_MULTIPLIER, DAY_MONTH, ROLE_TYPE_ID } from "../Constant/constants.js";

class TimeValidationHelper{

    /**
     * Gets the current date and time in the Philippines (Asia/Manila timezone).
     *
     * - Uses `toLocaleString` with the `"Asia/Manila"` timezone to ensure 
     *   the time is always localized to Philippine Standard Time (PST).
     * - Formats the output as `YYYY-MM-DD HH:mm:ss`.
     * - Ensures 24-hour format (`hour12: false`).
     * @returns {string} Current Philippines local datetime in `YYYY-MM-DD HH:mm:ss` format.
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 03:35 PM
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
    * Calculates the normalized work hours for an employee between `time_in` and `time_out`.
    * @param {string|Date} time_in - Start time (ISO string or Date object).
    * @param {string|Date} time_out - End time (ISO string or Date object).
    * @returns {number} Normalized work hours (fraction of a day).
    *
    * created by: Rogendher Keith Lachica
    * updated at: October 1, 2025 04:05 PM
    */
    static calculateEmployeeWorkHour(time_in, time_out){
        const start_time = new Date(time_in);
        const end_time = new Date(time_out);
    
        // Validate the dates: check if either date is invalid or end_time is before start_time
        if(isNaN(start_time.getTime()) || isNaN(end_time.getTime()) || end_time < start_time){
            return NUMBER.zero;
        }
    
        // Ensure constants are valid numbers
        const ms_one_thousand = DAY_TIME.ms_one_thousand || DAY_TIME.ms_one_thousand;
        const ms_sixty = DAY_TIME.ms_sixty || DAY_TIME.sixty_hour;
        const whole_day = DAY_TIME.whole_day || DAY_TIME.whole_day;
        const default_work = DAY_TIME.default_work || DAY_TIME.default_work; 
        const default_work_convertion = DAY_TIME.default_work_convertion || NUMBER.zero_point_zero_zero; 
    
        // Get the day of the week (0 = Sunday, 6 = Saturday)
        const day_of_week = start_time.getDay();
        const is_weekend = (day_of_week === DAY_COUNT.sunday || day_of_week === DAY_COUNT.saturday);
    
        // Calculate the total time worked in milliseconds
        const milliseconds_worked = end_time - start_time;
    
        // Convert milliseconds to hours safely
        const hours_worked = milliseconds_worked / (ms_one_thousand * ms_sixty * ms_sixty);
    
        // Convert default work hours to fraction of a day
        const default_hour_work = default_work / whole_day;
    
        // Convert worked hours to fraction of a day
        const default_day_converter = hours_worked / whole_day;
    
        // Calculate the difference between worked hours and default work hours
        let difference_day_work = default_day_converter - default_hour_work;
    
        // Round the difference to the nearest thousandth
        let calculated = Math.round(difference_day_work * ms_one_thousand) / ms_one_thousand;
    
        // Handle weekend calculation: if worked hours are less than or equal to 0, convert to positive value or default weekend work
        if(is_weekend && calculated <= NUMBER.zero){
            calculated = Math.abs(calculated) || default_work_convertion;
        }
    
        // Fallback: ensure calculated is a valid number
        if(isNaN(calculated)){
            calculated = NUMBER.zero;
        }
    
        return calculated;
    }


    /** 
     * Computes leave credit adjustments based on employee work hours.
     * @param {number} work_hour - The normalized work hours (positive or negative).
     * @param {number} current_credit - The employee’s current leave credit balance.
     * @returns {object} Object containing earned, deducted, and latest credit values.
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 04:30 PM
     */
    static computeLeaveCreditFromWorkHour(work_hour, current_credit){
        let earned_credit = NUMBER.zero;  
        let deducted_credit = NUMBER.zero; 
        let latest_credit = current_credit; 
    
            //  Employee worked extra hours (positive work_hour)
        if(work_hour > NUMBER.zero){
            // Calculate earned leave credit using predefined multiplier
            earned_credit = work_hour * WORK_HOUR_MULTIPLIER;
    
            // Update latest credit by adding earned credit
            latest_credit = current_credit + earned_credit;
        } 
            // Employee worked less than expected (negative work_hour)
        else if(work_hour < NUMBER.zero){
            // Convert negative work hours to positive for deduction
            deducted_credit = Math.abs(work_hour);
    
            // Update latest credit by subtracting the deducted amount
            latest_credit = current_credit - deducted_credit;
        }
    
        return { earned_credit, deducted_credit, latest_credit};
    }
    

    /**
     * Validates an employee's leave application based on company policies, leave type rules, and date restrictions.
     * @param {Object} params - Validation parameters.
     * @param {number} params.employee_id - ID of the employee applying.
     * @param {Object} params.leave_type_data - Leave type details including rules.
     * @param {string|Date} params.start_date - Leave start date.
     * @param {string|Date} params.end_date - Leave end date.
     * @param {string} params.reason - Reason for leave.
     *
     * @returns {Object} Result object with:
     * - `is_valid` {boolean} → Whether the leave is valid.
     * - `message` {string|null} → Error message if invalid.
     * - `duration` {number} → Number of leave days (if valid).
     * - `adjusted_end_date` {Date} → Corrected end date if adjusted.
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 01:55 PM
     */
    static async validateLeaveApplication({ employee_id, leave_type_data, start_date, end_date, reason }){
        const response = { is_valid: true, message: { success: false, message: null}, duration: NUMBER.zero, adjusted_end_date: end_date }; 
    
        try{
            if(!employee_id || !leave_type_data || !start_date || !end_date || !reason){
                response.is_valid = false;
                response.message = "All Fields are Required";
            }
    
            const start_date_day = new Date(start_date);
            let end_date_day = new Date(end_date);
    
            // Check if the dates are valid
            if(isNaN(start_date_day.getTime()) || isNaN(end_date_day.getTime())){
                response.is_valid = false;
                response.message = "Invalid date format.";
            }
    
            // Prevent leave from starting or ending on weekends
            if([DAY_COUNT.sunday, DAY_COUNT.saturday].includes(start_date_day.getDay()) || [DAY_COUNT.sunday, DAY_COUNT.saturday].includes(end_date_day.getDay())){
                response.is_valid = false;
                response.message = "Leave cannot start or end on a weekend.";
            }
    
            // Normalize today's date to midnight for accurate comparisons
            const today_only = new Date();
            today_only.setHours(NUMBER.zero, NUMBER.zero, NUMBER.zero, NUMBER.zero);
    
            // Adjust end date if leave started in the past but extends beyond today
            let adjusted_end_date = end_date_day;

            if(start_date_day < today_only && end_date_day > today_only){
                adjusted_end_date = today_only;
            }

            response.adjusted_end_date = adjusted_end_date;
    
            // Check if leave type is not carried over; restrict usage to current year
            if(leave_type_data.is_carried_over === NUMBER.zero){
                const today_day = new Date();
                const year = today_day.getFullYear(); 
    
                if(start_date_day < new Date(year, DAY_MONTH.january, DAY_MONTH.january_first) || start_date_day > new Date(year, DAY_MONTH.december_eleven, DAY_MONTH.december_thirty_one, DAY_TIME.twenty_three_hour, DAY_TIME.fifty_nine_minutes, DAY_TIME.fifty_nine_minutes, DAY_TIME.ms_nine_houndred_ninety_nine) ||end_date_day < new Date(year, DAY_MONTH.january, DAY_MONTH.january_first) || end_date_day > new Date(year, DAY_MONTH.december_eleven, DAY_MONTH.december_thirty_one, DAY_TIME.twenty_three_hour, DAY_TIME.fifty_nine_minutes, DAY_TIME.fifty_nine_minutes, DAY_TIME.ms_nine_houndred_ninety_nine)){
                    response.is_valid = false;
                    response.message = `The selected leave type "${leave_type_data.name}" can only be used within the current year (${year}).`;
                }
            }
    
            // Extract notice day and leave type rule from leave_type_data
            const notice_day = Number(leave_type_data.notice_day) || NUMBER.zero; 
            const rule_id = leave_type_data.leave_type_rule_id;
    
            // Normalize start and end dates to midnight (ignore time component)
            const start_only = new Date(start_date_day.getFullYear(), start_date_day.getMonth(), start_date_day.getDate());
            const end_only = new Date(end_date_day.getFullYear(), end_date_day.getMonth(), end_date_day.getDate());
    
            // Count total leave days excluding weekends
            let total_leave_day = NUMBER.zero; 

            for(let except = new Date(start_only); except <= end_only; except.setDate(except.getDate() + NUMBER.one)){
                const day = except.getDay(); 

                if(day !== DAY_COUNT.sunday && day !== DAY_COUNT.saturday){ 
                    total_leave_day++;
                }
            }

            response.duration = total_leave_day;
    
            // Calculate difference in days between start date and today
            const different_days = Math.ceil((start_only.getTime() - today_only.getTime()) / (DAY_TIME.ms_one_thousand * DAY_TIME.sixty_hour * DAY_TIME.sixty_hour * DAY_TIME.whole_day));
    
            // Validate leave notice period
            if(notice_day > NUMBER.one){
                // Leave requires advance notice
                if(different_days < notice_day){
                    response.is_valid = false;
                    response.message = `This leave type requires a notice period of at least ${notice_day} days.`;
                }
    
                // End date cannot be before start date for future notice leave
                if(end_only < start_only){ 
                    response.is_valid = false; 
                    response.message = `End date cannot be before start date for this leave type with future notice.`;
                }
            } 
            else if(notice_day === NUMBER.zero){
                // Leave cannot be applied for past dates
                if(rule_id === ROLE_TYPE_ID.employee && different_days < NUMBER.zero){
                    response.is_valid = false;
                    response.message = "This leave type cannot be applied for past dates.";
                }   
            }
            else if(notice_day < NUMBER.zero){
                // Allow past date leave within allowed negative notice period
                const allowed_past_date = new Date(today_only);
                allowed_past_date.setDate(today_only.getDate() + notice_day); 
                const valid_start = start_only >= allowed_past_date && start_only <= today_only;
                const valid_end = end_only >= allowed_past_date && end_only <= today_only;
    
                if(!valid_start || !valid_end){
                   response.is_valid = false;
                   response.message  = `This leave type allows past date leave only within ${Math.abs(notice_day)} days from today.`;
                }
    
                // Adjust end date if it exceeds today
                if(end_only > today_only){
                    adjusted_end_date = today_only;
                }
                response.adjusted_end_date = adjusted_end_date;
            }
    
            // Ensure start and end dates are not the same
            if(start_only.getTime() === end_only.getTime()){
                response.is_valid = false;
                response.message = "Start date and End date cannot be the same.";
            }
    
            // Check if total leave exceeds maximum allowed days for the leave type
            const max_days_allowed = Number(leave_type_data.base_value);

            if(!isNaN(max_days_allowed) && max_days_allowed > NUMBER.zero && total_leave_day > max_days_allowed){
                response.is_valid = false;
                response.message = `Leave exceeds max allowed ${max_days_allowed} days).`;
            }
        }
        catch(error){
            response.is_valid = false;
            response.message =  "Error validating leave application.";
        }

        return response;
    }
}



export default TimeValidationHelper;
