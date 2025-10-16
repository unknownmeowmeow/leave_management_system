import leaveType from "../models/leave_type.js";

<<<<<<< HEAD
class LeaveTypeController{
    constructor(){
        this.leaveTypeModel = LeaveTypeModel;
    }
=======
class LeaveType{
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06

    /**
     * Retrieves all default leave types from the system.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response containing default leave types or an error message.
<<<<<<< HEAD
     * Last Updated At: October 1, 2025 
     * @author Keith
     */
    async allDefaultLeaveType(req, res){
        
        try{
            const get_all_default_leave_record = await this.leaveTypeModel.getDefaultLeave(); 
        
            if(!get_all_default_leave_record.status){
                throw new Error(get_all_default_leave_record.error);
            }

            return res.json({ status: true, result: get_all_default_leave_record.result });
        } 
        catch(error){
            return res.json({ status: false, result: error.message });
        }
=======
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 02:10 PM
     */
    static async getAllDefaultLeaveType(req, res){
        const get_all_default_leave_record = await leaveType.getAllLeaveDefaultType(); 
        return res.json({ success: true, data: get_all_default_leave_record.result });
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
    }

    /**
     * Retrieves all rewarded and special leave types from the system.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response containing rewarded & special leave types or an error message.
<<<<<<< HEAD
     * Last Updated At: October 1, 2025 
     * @author Keith
     */
    async allRewardedLeave(req, res){
        try{
            const get_all_rewarded_special_leave_record = await this.leaveTypeModel.getRewardedLeave(); 

            if(!get_all_rewarded_special_leave_record.status){
                throw new Error(get_all_rewarded_special_leave_record.error);
            }

            return res.json({ status: true, result: get_all_rewarded_special_leave_record.result });
        } 
        catch(error){
            return res.json({ status: false, result: error.message });
        }
    }
}

export default new LeaveTypeController();
=======
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 02:20 PM
     */
    static async getAllRewardedAndSpecialLeave(req, res){
        const get_all_rewarded_special_leave_record = await leaveType.getAllSpecialAndRewardedLeaveType();
        return res.json({ success: true, data: get_all_rewarded_special_leave_record.result });
    }
}

export default LeaveType;
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
