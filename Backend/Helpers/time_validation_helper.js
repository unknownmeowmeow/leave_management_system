<<<<<<< HEAD
import { DAY_COUNT, NUMBER, TIME_HOUR, WORK_HOUR_MULTIPLIER, DAY_MONTH, ROLE_TYPE_ID, 
    DEFAULT_HOURS, TIME_MILISECOND, DECIMAL_NUMBER, TIME_MINUTES
} from "../Constant/constants.js";
=======
import { DAY_COUNT, NUMBER,  DAY_MONTH, ROLE_TYPE_ID, TIME_HOUR, TIME_MILISECOND,
    DEFAULT_TIME_CONVERSION,DECIMAL_NUMBER, FIFTY_NINE_MINUTE, MONTH
} from "../constant/constants.js";
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06

class TimeValidation{

    /**
     * Gets the current date and time in the Philippines (Asia/Manila timezone).
     * @returns {string} Current Philippines local datetime in `YYYY-MM-DD HH:mm:ss` format.
     * Last Updated At: October 1, 2025
     * @author Keith
     */
    checkEmployeeCurrentTime(){
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

<<<<<<< HEAD
    /** 
     * Calculates normalized work hours for an employee between time_in and time_out.
     * Positive value = overtime, Negative value = undertime
     * @param {string|Date} time_in - Start time
     * @param {string|Date} time_out - End time
     * @returns {number} Normalized work hours (fraction of a day)
     * Last Updated At: October 1, 2025
     * @author Keith
     */
    calculateEmployeeWorkHour(time_in, time_out){
        /* Convert input times to Date objects */
=======
    /**
    * Calculates the normalized work hours for an employee between `time_in` and `time_out`.
    * @param {string|Date} time_in - Start time (ISO string or Date object).
    * @param {string|Date} time_out - End time (ISO string or Date object).
    * @returns {number} Normalized work hours (fraction of a day).
    * created by: Rogendher Keith Lachica
    * updated at: October 1, 2025 04:05 PM
    */
    static calculateEmployeeWorkHour(time_in, time_out){
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
        const start_time = new Date(time_in);
        const end_time = new Date(time_out);
    
        /* Validate dates: return 0 if invalid or if time_out is before time_in */
        if(isNaN(start_time.getTime()) || isNaN(end_time.getTime()) || end_time < start_time){
            return NUMBER.zero;
        }
    
<<<<<<< HEAD
        /* Determine day of week: 0 = Sunday, 6 = Saturday */
        const day_of_week = start_time.getDay(); 
    
        /* Calculate total milliseconds worked */
        const milliseconds_worked = end_time - start_time;
    
        /* Convert milliseconds to decimal hours */
        let hours_worked = milliseconds_worked / 
            (TIME_MILISECOND.milisecond_one_thousand * TIME_MILISECOND.milisecond_sixty * TIME_MILISECOND.milisecond_sixty); 
        hours_worked = Math.round(hours_worked * NUMBER.one_hundred) / NUMBER.one_hundred;
    
        /* Count all hours worked on weekends as overtime */
        if(day_of_week === DAY_COUNT.zero || day_of_week === DAY_COUNT.six){
            return Math.round(hours_worked * NUMBER.one_hundred) / NUMBER.one_hundred; 
=======
        // Get the day of the week (0 = Sunday, 6 = Saturday)
        const day_of_week = start_time.getDay();
        const is_weekend = (day_of_week === DAY_COUNT.sunday || day_of_week === DAY_COUNT.saturday);
    
        // Calculate the total time worked in milliseconds
        const milisecond_work = end_time - start_time;
    
        // Convert milliseconds to hours safely
        const work_hour_conversion = milisecond_work / (TIME_MILISECOND.milisecond_one_thousand * TIME_MILISECOND.milisecond_sixty * TIME_MILISECOND.milisecond_sixty);
    
        // Convert default work hours to fraction of a day
        const default_work_hour = TIME_HOUR.default_work / TIME_HOUR.twenty_four_hour;
    
        // Convert worked hours to fraction of a day
        const default_day_converter = work_hour_conversion / TIME_HOUR.twenty_four_hour;
    
        // Calculate the difference between worked hours and default work hours
        let difference_work_hour = default_day_converter - default_work_hour;
    
        // Round the difference to the nearest thousandth
        let calculated = Math.round(difference_work_hour * TIME_MILISECOND.milisecond_one_thousand) / TIME_MILISECOND.milisecond_one_thousand;
    
        // Handle weekend calculation: if worked hours are less than or equal to 0, convert to positive value or default weekend work
        if(calculated < NUMBER.Z && !is_weekend){
            // Apply minimum undertime if negative
            calculated = Math.max(calculated, -DEFAULT_TIME_CONVERSION); 
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
        }
    
        /* Compare worked hours with default work hours */
        if(hours_worked > DEFAULT_HOURS){
            /* Overtime: apply multiplier to extra hours */
            hours_worked = Math.round((hours_worked - DEFAULT_HOURS) * WORK_HOUR_MULTIPLIER * NUMBER.one_hundred) / NUMBER.one_hundred;
        } 
        else if(hours_worked < DEFAULT_HOURS){
            /* Undertime: return negative value */
            hours_worked = -(Math.round((DEFAULT_HOURS - hours_worked) * NUMBER.one_hundred) / NUMBER.one_hundred);
        } 
        else {
            /* Exactly default hours: 0 deviation */
            hours_worked = DECIMAL_NUMBER.zero_point_zero_zero;
        }
    
        /* Return calculated work hours (positive for overtime, negative for undertime) */
        return hours_worked;
    }
    
    
    

     /** 
     * Computes leave credit adjustments based on employee work hours.
<<<<<<< HEAD
     * @param {number} work_hour - Normalized work hours (positive/negative)
     * @param {number} current_credit - Employee’s current leave credit
     * @returns {object} Object with earned, deducted, and latest credit values
     * Last Updated At: October 7, 2025
     * @author Keith
=======
     * @param {number} work_hour - The normalized work hours (positive or negative).
     * @param {number} current_credit - The employee’s current leave credit balance.
     * @returns {object} Object containing earned, deducted, and latest credit values.
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 04:30 PM
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
     */
    computeLeaveCredit(work_hour, current_credit){
        /* Initialize earned, deducted, and latest leave credit */
        let earned_credit = NUMBER.zero;
        let deducted_credit = NUMBER.zero;
        let latest_credit = current_credit;
    
        /* If work hour is positive → overtime, add earned credit */
        if(work_hour > NUMBER.zero){
<<<<<<< HEAD
            /* Convert overtime hours to leave days */
            earned_credit = work_hour / DEFAULT_HOURS; 
=======
            // Calculate earned leave credit using predefined multiplier
            earned_credit = work_hour * DECIMAL_NUMBER.one_point_fifty;
    
            // Update latest credit by adding earned credit
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
            latest_credit = current_credit + earned_credit;
        } 
        /* If work hour is negative → undertime, deduct credit */
        else if(work_hour < NUMBER.zero){
            /* Convert undertime hours to leave days */
            deducted_credit = Math.abs(work_hour) / DEFAULT_HOURS; 
            latest_credit = current_credit - deducted_credit;
        }
    
        /* Return object containing earned, deducted, and updated latest credit */
        return { earned_credit, deducted_credit, latest_credit };
    }
    

    /**
<<<<<<< HEAD
     * Validates an employee's leave application based on company policies and leave type rules.
     * @param {Object} params - Validation parameters
     * @param {number} params.employee_id - ID of the employee
     * @param {Object} params.leave_type_data - Leave type details
     * @param {string|Date} params.start_date - Leave start date
     * @param {string|Date} params.end_date - Leave end date
     * @param {string} params.reason - Reason for leave
     * @returns {Object} status object with is_valid, message, duration, adjusted_end_date
     * Last Updated At: October 1, 2025
     * @author Keith
=======
     * Validates an employee's leave application based on company policies, leave type rules, and date restrictions.
     * @param {Object} params - Validation parameters.
     * @param {number} params.employee_id - ID of the employee applying.
     * @param {Object} params.leave_type_data - Leave type details including rules.
     * @param {string|Date} params.start_date - Leave start date.
     * @param {string|Date} params.end_date - Leave end date.
     * @param {string} params.reason - Reason for leave.
     *
     * @returns {Object} Result object with:
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 01:55 PM
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
     */
    async validateLeaveApplication({ employee_id, leave_type_data, start_date, end_date, reason }){
        /* Initialize response object */
        const response = { status: true, result: { duration: NUMBER.zero, adjusted_end_date: end_date || start_date }, error: null };
    
        try{
<<<<<<< HEAD
            /* Check for required fields */
            if(!employee_id || !leave_type_data || !start_date || !end_date || !reason){
                response.status = false;
                response.error = "All Fields are Required";
                return response;
            }
    
            /* Convert input dates to Date objects */
=======
            if(!employee_id || !leave_type_data || !start_date || !end_date || !reason.trim()){
                console.log("Validating leave application with values:", {
                    employee_id,
                    leave_type_data,
                    start_date,
                    end_date,
                    reason
                });
                
                response.is_valid = false;
                response.message = "All Fields are Required";
            }
            
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
            const start_date_day = new Date(start_date);
            const end_date_day = new Date(end_date);
    
            /* Validate date objects */
            if(isNaN(start_date_day.getTime()) || isNaN(end_date_day.getTime())){
                response.status = false;
                response.error = "Invalid date format.";
                return response;
            }
    
            /* Prevent leave from starting or ending on weekends */
            if([DAY_COUNT.sunday, DAY_COUNT.saturday].includes(start_date_day.getDay()) || 
               [DAY_COUNT.sunday, DAY_COUNT.saturday].includes(end_date_day.getDay())){
                response.status = false;
                response.error = "Leave cannot start or end on a weekend.";
                return response;
            }
    
            /* Normalize today's date to midnight */
            const today_only = new Date();
            today_only.setHours(NUMBER.zero, NUMBER.zero, NUMBER.zero, NUMBER.zero);
    
            /* Adjust end date if leave started in the past but extends beyond today */
            let adjusted_end_date = end_date_day;
<<<<<<< HEAD
            if(start_date_day < today_only && end_date_day > today_only){
                adjusted_end_date = today_only;
            }
            response.result.adjusted_end_date = adjusted_end_date;
=======
    
            if(start_date_day < today_only && end_date_day > today_only){
                adjusted_end_date = today_only;
            }
    
            response.adjusted_end_date = adjusted_end_date;
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
    
            /* Check leave type year restriction if not carried over */
            if(leave_type_data.is_carried_over === NUMBER.zero){
                const year = today_only.getFullYear();
                const year_start = new Date(year, DAY_MONTH.january, DAY_MONTH.january_first);
                const year_end = new Date(year, DAY_MONTH.december_eleven, DAY_MONTH.december_thirty_one, TIME_HOUR.twenty_three_hour, TIME_MINUTES, NUMBER.fifty_nine, TIME_MILISECOND.milisecond_nine_houndred_ninety_nine);
    
<<<<<<< HEAD
                if(start_date_day < year_start || start_date_day > year_end || end_date_day < year_start || end_date_day > year_end){
                    response.status = false;
                    response.error = `The selected leave type "${leave_type_data.name}" can only be used within the current year (${year}).`;
                    return response;
=======
                if(start_date_day < new Date(year, DAY_MONTH.january, DAY_MONTH.january_first) || start_date_day > new Date(year, DAY_MONTH.december, DAY_MONTH.december_thirty_one, TIME_HOUR.twenty_three_hour, FIFTY_NINE_MINUTE, FIFTY_NINE_MINUTE, TIME_MILISECOND.milisecond_nine_houndred_ninety_nine) ||end_date_day < new Date(year, MONTH.january, DAY_MONTH.january_first) || end_date_day > new Date(year, MONTH.december, DAY_MONTH.december_thirty_one, TIME_HOUR.twenty_three_hour, FIFTY_NINE_MINUTE, FIFTY_NINE_MINUTE, TIME_MILISECOND.milisecond_nine_houndred_ninety_nine)){
                    response.is_valid = false;
                    response.message = `The selected leave type "${leave_type_data.name}" can only be used within the current year (${year}).`;
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
                }
            }
    
            /* Notice day rules */
            const notice_day = Number(leave_type_data.notice_day) || NUMBER.zero;
            const rule_id = leave_type_data.leave_type_rule_id;
    
            /* Normalize start and end dates to midnight */
            const start_only = new Date(start_date_day.getFullYear(), start_date_day.getMonth(), start_date_day.getDate());
            const end_only = new Date(end_date_day.getFullYear(), end_date_day.getMonth(), end_date_day.getDate());
    
<<<<<<< HEAD
            /* Handle positive notice_day rules (future leave requirement) */
            if(notice_day > NUMBER.one){
                const different_days = Math.ceil((start_only.getTime() - today_only.getTime()) / (TIME_MILISECOND.milisecond_one_thousand * TIME_HOUR.sixty_hour * TIME_HOUR.sixty_hour * TIME_HOUR.twenty_four_hour));
    
                if(different_days < notice_day){
                    response.status = false;
                    response.error = `This leave type requires a notice period of at least ${notice_day} days.`;
                    return response;
                }
    
                if(end_only < start_only){
                    response.status = false;
                    response.error = "End date cannot be before start date for this leave type with future notice.";
                    return response;
                }
            }
            else if(notice_day === NUMBER.zero){
                const different_days = Math.ceil((start_only.getTime() - today_only.getTime()) / (TIME_MILISECOND.milisecond_one_thousand * TIME_HOUR.sixty_hour * TIME_HOUR.sixty_hour * TIME_HOUR.twenty_four_hour));
                
                if(rule_id === ROLE_TYPE_ID.employee && different_days < NUMBER.zero){
                    response.status = false;
                    response.error = "This leave type cannot be applied for past dates.";
                    return response;
                }
            }
            else if(notice_day < NUMBER.zero){
                const allowed_past_date = new Date(today_only);
                allowed_past_date.setDate(today_only.getDate() + notice_day);
    
                if(start_only < allowed_past_date || start_only > today_only){
                    response.status = false;
                    response.error = `This leave type allows past date leave only within ${Math.abs(notice_day)} days from today.`;
                    return response;
                }
    
                if(end_only < start_only){
                    response.status = false;
                    response.error = "End date cannot be before start date.";
                    return response;
                }
    
                /* Adjust end date if it exceeds today */
                adjusted_end_date = end_only > today_only ? today_only : end_only;
                response.result.adjusted_end_date = adjusted_end_date;
            }
    
            /* Count total leave days excluding weekends using adjusted_end_date */
            const adjusted_end_only = new Date(adjusted_end_date.getFullYear(), adjusted_end_date.getMonth(), adjusted_end_date.getDate());
            let total_leave_day = NUMBER.zero;
    
            for(let except = new Date(start_only); except <= adjusted_end_only; except.setDate(except.getDate() + NUMBER.one)){
                const day = except.getDay();
                if(day !== DAY_COUNT.sunday && day !== DAY_COUNT.saturday){
                    total_leave_day++;
                }
            }
    
            /* Assign calculated duration */
            response.result.duration = total_leave_day;
    
        } 
=======
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
            const different_days = Math.ceil((start_only.getTime() - today_only.getTime()) / (TIME_MILISECOND.milisecond_one_thousand * TIME_HOUR.sixty_hour * TIME_HOUR.sixty_hour * TIME_HOUR.twenty_four_hour));
    
            // Validate leave notice period
            if(notice_day > NUMBER.one){
                if(different_days < notice_day){
                    response.is_valid = false;
                    response.message = `This leave type requires a notice period of at least ${notice_day} days.`;
                }
                if(end_only < start_only){ 
                    response.is_valid = false; 
                    response.message = `End date cannot be before start date for this leave type with future notice.`;
                }
            } 
            else if(notice_day === NUMBER.zero){
                if(rule_id === ROLE_TYPE_ID.employee && different_days < NUMBER.zero){
                    response.is_valid = false;
                    response.message = "This leave type cannot be applied for past dates.";
                }   
            }
            else if(notice_day < NUMBER.zero){
                const allowed_past_date = new Date(today_only);
                allowed_past_date.setDate(today_only.getDate() + notice_day); 
                const valid_start = start_only >= allowed_past_date && start_only <= today_only;
                const valid_end = end_only >= allowed_past_date && end_only <= today_only;
    
                if(!valid_start || !valid_end){
                   response.is_valid = false;
                   response.message  = `This leave type allows past date leave only within ${Math.abs(notice_day)} days from today.`;
                }
    
                if(end_only > today_only){
                    adjusted_end_date = today_only;
                }
                response.adjusted_end_date = adjusted_end_date;
            }
    
            if(start_only.getTime() === end_only.getTime()){
                response.is_valid = false;
                response.message = "Start date and End date cannot be the same.";
            }
    
            const max_days_allowed = Number(leave_type_data.base_value);
    
            if(!isNaN(max_days_allowed) && max_days_allowed > NUMBER.zero && total_leave_day > max_days_allowed){
                response.is_valid = false;
                response.message = `Leave exceeds max allowed ${max_days_allowed} days).`;
            }
        }
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
        catch(error){
            /* Handle unexpected errors */
            response.status = false;
            response.error = "Error validating leave application.";
        }
    
        return response;
    }
    
}



<<<<<<< HEAD
export default new TimeValidationHelper();
=======
export default TimeValidation;
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
