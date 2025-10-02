import { NUMBER } from "../Constant/constants.js";

class TimeValidationHelper{

    /**
     * Gets the current date and time in the Philippines (Asia/Manila timezone).
     *
     * - Uses `toLocaleString` with the `"Asia/Manila"` timezone to ensure 
     *   the time is always localized to Philippine Standard Time (PST).
     * - Formats the output as `YYYY-MM-DD HH:mm:ss`.
     * - Ensures 24-hour format (`hour12: false`).
     *
     * Example Output:
     * "2025-10-01 15:45:30"
     *
     * Workflow:
     * 1. Generate localized datetime string → `"MM/DD/YYYY, HH:MM:SS"`.
     * 2. Split into `date` and `time` parts.
     * 3. Reorder `date` from `MM/DD/YYYY` → `YYYY-MM-DD`.
     * 4. Return final formatted datetime string.
     *
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
    *
    * Workflow:
    * 1. Converts the worked time into a fraction of a day (24 hours).
    * 2. Compares the actual fraction against the "default" fraction for 8 hours (1/3 of a day).
    * 3. Rounds the result to 3 decimal places.
    * 4. Handles weekends with special rules.
    *
    * Rules:
    *  - If invalid dates or negative time range → returns 0.
    *  - If working on a weekday:
    *      > Example: 8 hrs → 0.333, 12 hrs → 0.5, etc.
    *  - If working on a weekend:
    *      > If `calculated <= 0` → returns absolute value or defaults to `0.33`.
    *
    * Formula:
    *   worked_hours = (end_time - start_time) / (1000 * 60 * 60)
    *   normalized   = (worked_hours / 24) - (8 / 24)
    *   final        = round(normalized, 3)
    *
    * @param {string|Date} time_in - Start time (ISO string or Date object).
    * @param {string|Date} time_out - End time (ISO string or Date object).
    * @returns {number} Normalized work hours (fraction of a day).
    *
    * created by: Rogendher Keith Lachica
    * updated at: October 1, 2025 04:05 PM
    */
    static calculateEmployeeWorkHour(time_in, time_out) {
        const start_time = new Date(time_in);
        const end_time = new Date(time_out);

        if(isNaN(start_time.getTime()) || isNaN(end_time.getTime()) || end_time < start_time){
            return NUMBER.zero;
        }
        const day_of_week = start_time.getDay();
        const is_weekend = (day_of_week === NUMBER.zero || day_of_week === NUMBER.six);
        const milliseconds_worked = end_time - start_time;
        const hours_worked = milliseconds_worked / ( NUMBER.one_thousand * NUMBER.sixty * NUMBER.sixty);
        const default_day = NUMBER.twenty_four;
        const default_hour_work = NUMBER.eight / default_day;
        const default_day_converter = hours_worked / default_day;
        const difference_day_work = default_day_converter - default_hour_work;
        let calculated = Math.round(difference_day_work *  NUMBER.one_thousand) /  NUMBER.one_thousand;

        if(is_weekend && calculated <= NUMBER.zero){
            calculated = Math.abs(calculated) || NUMBER.zero_point_thirty_three;
        }

        return calculated;
    }

    /**
     * Computes leave credit adjustments based on employee work hours.
     *
     * Workflow:
     * 1. If work hour is positive, employee earns credit:
     *      > earned_credit = work_hour * 1.5
     * 2. If work hour is negative, employee's credit is deducted:
     *      > deducted_credit = absolute value of work_hour
     * 3. Zero work hour means no change.
     *
     * Returns an object containing:
     *  - earned_credit: number
     *  - deducted_credit: number
     *  - latest_credit: number (updated leave credit balance)
     *
     * Example:
     *   computeLeaveCreditFromWorkHour(2, 10)
     *   → { earned_credit: 3, deducted_credit: 0, latest_credit: 13 }
     *
     *   computeLeaveCreditFromWorkHour(-1, 10)
     *   → { earned_credit: 0, deducted_credit: 1, latest_credit: 9 }
     *
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

        if(work_hour > NUMBER.zero){
            earned_credit = work_hour * NUMBER.one_point_fifty;
            latest_credit = current_credit + earned_credit;
        } 
        else if(work_hour < NUMBER.zero){
            deducted_credit = Math.abs(work_hour);
            latest_credit = current_credit - deducted_credit;
        }

        return{
            earned_credit,
            deducted_credit,
            latest_credit
        };
    }

    /**
     * Validates an employee's leave application based on company policies, leave type rules, and date restrictions.
     *
     * Workflow:
     * 1. **Required Fields**
     *    - Ensures `employee_id`, `leave_type_data`, `start_date`, `end_date`, and `reason` are provided.
     *    - Returns: `{ is_valid: false, message: "All fields are required." }`.
     *
     * 2. **Date Validation**
     *    - Checks if `start_date` and `end_date` are valid dates.
     *    - Ensures `end_date` is not earlier than `start_date`.
     *
     * 3. **Weekend Restrictions**
     *    - Start and end dates cannot fall on a Saturday or Sunday.
     *    - Leave period cannot include weekends in between.
     *
     * 4. **Leave Type Rules**
     *    - If `is_carried_over === 0` → leave must be within the current year only.
     *    - If `notice_day > 0` → future leave requires notice days in advance.
     *    - If `notice_day < 0` → allows backdated leave within limited days.
     *    - If `rule_id === 3` and `notice_day === 0` → leave can only be filed on the same day.
     *
     * 5. **Duration Calculation**
     *    - Counts total working days (weekdays only) between `start_date` and `end_date`.
     *    - If leave exceeds `base_value` → reject with message.
     *
     * 6. **Error Handling**
     *    - Returns consistent JSON: `{ is_valid: false, message: "<error reason>" }`.
     *
     * Example Success:
     * {
     *   is_valid: true,
     *   message: null,
     *   duration: 3,
     *   adjusted_end_date: "2025-10-05"
     * }
     *
     * Example Failure (invalid notice period):
     * {
     *   is_valid: false,
     *   message: "This leave type requires at least 3 days' notice."
     * }
     *
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
    static async validateLeaveApplication({ employee_id, leave_type_data, start_date, end_date, reason }) {
    
        try{
            if(!employee_id || !leave_type_data || !start_date || !end_date || !reason){
                return { is_valid: false, message: { success: false, message: "All Fields are Required" } };
            }
    
            const start_date_day = new Date(start_date);
            let end_date_day = new Date(end_date);
    
            if(isNaN(start_date_day.getTime()) || isNaN(end_date_day.getTime())){
                return { is_valid: false, message: "Invalid date format." };
            }
    
            if([NUMBER.zero, NUMBER.six].includes(start_date_day.getDay()) || [NUMBER.zero, NUMBER.six].includes(end_date_day.getDay())){
                return { is_valid: false, message: "Leave cannot start or end on a weekend." };
            }
    
            const today_only = new Date();
            today_only.setHours(NUMBER.zero, NUMBER.zero, NUMBER.zero, NUMBER.zero);
            let adjusted_end_date = end_date_day;
    
            if(start_date_day < today_only && end_date_day > today_only){
                adjusted_end_date = today_only;
            }
    
            if(leave_type_data.is_carried_over === NUMBER.zero){
                const now = new Date();
                const year = now.getFullYear();
                const january_start = new Date(year, NUMBER.zero, NUMBER.one);
                const december_end = new Date(year, NUMBER.eleven, NUMBER.thirty_one, NUMBER.twenty_three, NUMBER.fifty_nine, NUMBER.fifty_nine, NUMBER.nine_houndred_nine);
    
                if(start_date_day < january_start || start_date_day > december_end || end_date_day < january_start || end_date_day > december_end){
                    return { is_valid: false, message: `The selected leave type "${leave_type_data.name}" can only be used within the current year (${year}).` };
                }
            }
    
            const notice_day = Number(leave_type_data.notice_day) || NUMBER.zero;
            const rule_id = leave_type_data.leave_type_rule_id;
            const start_only = new Date(start_date_day.getFullYear(), start_date_day.getMonth(), start_date_day.getDate());
            const end_only = new Date(end_date_day.getFullYear(), end_date_day.getMonth(), end_date_day.getDate());
            let total_leave_day = NUMBER.zero;
    
            for(let except = new Date(start_only); except <= end_only; except.setDate(except.getDate() + NUMBER.one)){
                const day = except.getDay();

                if(day !== NUMBER.zero && day !== NUMBER.six){ 
                    total_leave_day++;
                }
            }
    
            const different_days = Math.ceil((start_only.getTime() - today_only.getTime()) / (NUMBER.one_thousand * NUMBER.sixty * NUMBER.sixty * NUMBER.twenty_four));
    
            if(notice_day > NUMBER.zero){
                if(different_days < notice_day){
                    return { is_valid: false, message: `This leave type requires a notice period of at least ${notice_day} days.` };
                }
            } 
            else if(notice_day === NUMBER.zero){
                if(rule_id === NUMBER.three){
                    if(start_only.getTime() !== today_only.getTime() || end_only.getTime() !== today_only.getTime()){
                        return { is_valid: false, message: `This leave type "${leave_type_data.name}" can only be used on the current date.` };
                    }
                } 
                else if(different_days < NUMBER.zero){
                    return { is_valid: false, message: `This leave type cannot be applied for past dates.` };
                }
            }
            else if(notice_day < NUMBER.zero){
                const allowed_past_date = new Date(today_only);
                allowed_past_date.setDate(today_only.getDate() + notice_day);
                const valid_start = start_only >= allowed_past_date && start_only <= today_only;
                const valid_end = end_only >= allowed_past_date && end_only <= today_only;
                
                if(!valid_start || !valid_end){
                    return { is_valid: false, message: `This leave type allows past date leave only within ${Math.abs(notice_day)} days from today.` };
                }
                
                if(end_only > today_only){
                    adjusted_end_date = today_only;
                }
            }
    
            if(start_only.getTime() === end_only.getTime()){
                return { is_valid: false, message: "Start date and End date cannot be the same." };
            }
    
            const max_days_allowed = Number(leave_type_data.base_value);

            if(!isNaN(max_days_allowed) && max_days_allowed > NUMBER.zero && total_leave_day > max_days_allowed){
                return { is_valid: false, message: `Leave exceeds max allowed (${max_days_allowed} days).` };
            }
    
            return {is_valid: true,message: null, duration: total_leave_day, adjusted_end_date};
    
        } 
        catch(error){
            return { is_valid: false, message: "Error validating leave application." };
        }
    }
    
}

export default TimeValidationHelper;
