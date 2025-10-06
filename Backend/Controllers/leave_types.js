import leaveType from "../models/leave_type.js";

class LeaveType{

    /**
     * Retrieves all default leave types from the system.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response containing default leave types or an error message.
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 02:10 PM
     */
    static async getAllDefaultLeaveType(req, res){
        const get_all_default_leave_record = await leaveType.getAllLeaveDefaultType(); 
        return res.json({ success: true, data: get_all_default_leave_record.result });
    }

    /**
     * Retrieves all rewarded and special leave types from the system.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response containing rewarded & special leave types or an error message.
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 02:20 PM
     */
    static async getAllRewardedAndSpecialLeave(req, res){
        const get_all_rewarded_special_leave_record = await leaveType.getAllSpecialAndRewardedLeaveType();
        return res.json({ success: true, data: get_all_rewarded_special_leave_record.result });
    }
}

export default LeaveType;
