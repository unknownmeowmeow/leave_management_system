
import LeaveTypeModel from "../Models/LeaveType.js";

class TimeValidationHelper{

    /**
     * Returns current Philippines local datetime in YYYY-MM-DD HH:MM:SS format.
     *
     * @returns {string} Current datetime in Philippines timezone.
     * created by: Rogendher Keith Lachica
     * updated at: September 26 2025 9:40 am
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
     * Calculates worked hours for an employee given time in and out.
     *
     * @param {string|Date} time_in
     * @param {string|Date} time_out
     * @returns {number} Calculated work hours.
     * created by: Rogendher Keith Lachica
     * updated at: September 26 2025 9:45 am
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
        const hours_worked = milliseconds_worked / ( 1000 * 60 * 60);
        const default_day = 24;
        const default_hour_work = 8 / default_day;
        const default_day_converter = hours_worked / default_day;
        const difference_day_work = default_day_converter - default_hour_work;
        let calculated = Math.round(difference_day_work *  1000) /  1000;

        if(is_weekend && calculated <= 0){
            calculated = Math.abs(calculated) || 0.33;
        }

        return calculated;
    }

    /**
     * Calculates worked hours for an employee given time in and out.
     *
     * @param {string|Date} time_in
     * @param {string|Date} time_out
     * @returns {number} Calculated work hours.
     * created by: Rogendher Keith Lachica
     * updated at: September 26 2025 9:45 am
     */
    static computeLeaveCreditFromWorkHour(work_hour, current_credit){
        let earned_credit = 0;
        let deducted_credit = 0;
        let latest_credit = current_credit;

        if(work_hour > 0){
            earned_credit = work_hour * 1.50;
            latest_credit = current_credit + earned_credit;
        } 
        else if(work_hour < 0){
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
     * Validates a leave application for required fields, date logic, notice days, and leave limits.
     *
     * @param {Object} params
     * @param {number} params.employee_id
     * @param {number} params.leave_type
     * @param {string|Date} params.start_date
     * @param {string|Date} params.end_date
     * @param {string} params.reason
     * @returns {Object} is_valid, message, duration
     * created by: Rogendher Keith Lachica
     * updated at: September 26 2025 10:10 am
     */
    static async validateLeaveApplication({ employee_id, leave_type, start_date, end_date, reason }) {

        try{
    
            if(!employee_id || !leave_type || !start_date || !end_date || !reason){
                return { is_valid: false, message: { success: false, message: "All Fields are Required" } };
            }
            const start_date_day = new Date(start_date);
            const end_date_day = new Date(end_date);
    
            if(isNaN(start_date_day.getTime()) || isNaN(end_date_day.getTime())){
                return { is_valid: false, message: "Invalid date format." };
            }
    
            if([0, 6].includes(start_date_day.getDay()) || [0, 6].includes(end_date_day.getDay())){
                return { is_valid: false, message: "Leave cannot start or end on a weekend." };
            }
            const today_only = new Date();
            today_only.setHours(0, 0, 0, 0);
            let adjusted_end_date = end_date_day;
    
            if(start_date_day < today_only && end_date_day > today_only){
                adjusted_end_date = today_only;
            }
            const leave_type_response = await LeaveTypeModel.getLeaveTypeById(leave_type);
    
            if(!leave_type_response.status || !leave_type_response.result){
                return { is_valid: false, message: "This leave type is invalid or cannot be carried over." };
            }
            const leave_type_data = leave_type_response.result;
    
            if(leave_type_data.is_carried_over === 0){
                const now = new Date();
                const year = now.getFullYear();
                const january_start = new Date(year, 0, 1);
                const december_end = new Date(year, 11, 31, 23, 59, 59, 999);
    
                if(start_date_day < january_start || start_date_day > december_end || end_date_day < january_start || end_date_day > december_end){
                    return { is_valid: false, message: `The selected leave type "${leave_type_data.name}" can only be used within the current year (${year}).` };
                }
            }
            const notice_day = Number(leave_type_data.notice_day) || 0;
            const rule_id = leave_type_data.leave_type_rule_id;
            const start_only = new Date(start_date_day.getFullYear(), start_date_day.getMonth(), start_date_day.getDate());
            const end_only = new Date(end_date_day.getFullYear(), end_date_day.getMonth(), end_date_day.getDate());
            let total_leave_day = 0;

      
            for(let except = new Date(start_only); except <= end_only; except.setDate(except.getDate() + 1)) {
                const day = except.getDay();

                if(day !== 0 && day !== 6){ 
                    total_leave_day++;
                }
            }
            const different_days = Math.ceil((start_only.getTime() - today_only.getTime()) / (1000 * 60 * 60 * 24));
    
            if(notice_day === 0 && rule_id === 3 && (start_only.getTime() !== today_only.getTime() || end_only.getTime() !== today_only.getTime())){
                return { is_valid: false, message: `This leave type "${leave_type_data.name}" can only be used on the current date.` };
            }
    
            if(notice_day > 0 && different_days < notice_day){
                return { is_valid: false, message: `This leave type requires a notice period of at least ${notice_day} days.` };
            }
    
            if(notice_day < 0){
                const allowed_past_date = new Date(today_only);
                allowed_past_date.setDate(today_only.getDate() + notice_day);
                const valid_start = start_only >= allowed_past_date && start_only <= today_only;
                const valid_end = end_only >= allowed_past_date && end_only <= today_only;
    
                if(!valid_start || !valid_end){
                    return {
                        is_valid: false,
                        message: `This leave type allows past date leave only within ${Math.abs(notice_day)} days from today.`
                    };
                }
            }
    
            if(start_only.getTime() === end_only.getTime()){
                return { is_valid: false, message: "Start date and End date cannot be the same." };
            }
    
            if(notice_day === 0 && rule_id !== 3 && different_days < 0){
                return { is_valid: false, message: `This leave type cannot be applied for past dates.` };
            }
            const max_days_allowed = Number(leave_type_data.base_value);

            if(!isNaN(max_days_allowed) && max_days_allowed > 0 && total_leave_day > max_days_allowed){
                return { is_valid: false, message: `Leave exceeds max allowed (${max_days_allowed} days).` };
            }
    
            return{
                is_valid: true,
                message: null,
                duration: total_leave_day,
                adjusted_end_date
            };
    
        } 
        catch(error){
            return { is_valid: false, message: "Error validating leave application: " };
        }
    }
    

    
    
}

export default TimeValidationHelper;
