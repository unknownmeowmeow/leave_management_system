import LeaveTypeModel from "../Models/LeaveTypeModel.js";
import { SESSION_USER_NOT_FOUND, ERROR_IN_LEAVE_TYPE_CATCH } from "../Constant/Constants.js";

class LeaveTypeController{
    /**
     * Retrieves all default leave types.
     *
     * - Checks if the user session exists.
     * - Fetches all default leave types from the LeaveTypeModel.
     * - Returns JSON response with success status and data or error message.
     *
     * @param {Object} req The Express request object.
     * @param {Object} res The Express response object.
     * @returns {Promise<void>} Sends JSON response with leave type data or error.
     * created by: Rogendher Keith Lachica
     * updated at: September 20 2025
     */
    static async getAllDefaultLeaveType(req, res){
        try{
            const user = req.session?.user;
    
            if(!user){
                return res.json(SESSION_USER_NOT_FOUND); 
            }
            const result = await LeaveTypeModel.getAllLeaveDefaultType(); 
    
            if(!result.status){
                return res.json({ success: false, message: result.error }); 
            }
    
            return res.json({ success: true, data: result.result });
        } 
        catch(error){ 
            return res.json(ERROR_IN_LEAVE_TYPE_CATCH);        
        }
    }
    /**
     * Retrieves all rewarded and special leave types.
     *
     * - Verifies if the user session exists.
     * - Fetches all special and rewarded leave types from the LeaveTypeModel.
     * - Returns JSON response with success status and data or error message.
     *
     * @param {Object} req The Express request object.
     * @param {Object} res The Express response object.
     * @returns {Promise<void>} Sends JSON response with leave type data or error.
     * created by: Rogendher Keith Lachica
     * updated at: September 20 2025
     */
    static async getAllRewardedAndSpecialLeave(req, res){
        
        try{
            const user = req.session?.user;
    
            if(!user){
                return res.json(SESSION_USER_NOT_FOUND);
            }
            const result = await LeaveTypeModel.getAllSpecialAndRewardedLeaveType();
    
            if(!result.status){
                return res.json({ success: false, message: result.error });
            }

            return res.json({ success: true, data: result.result });
        } 
        catch(error){
            return res.json(ERROR_IN_LEAVE_TYPE_CATCH);
        }
    }
}

export default LeaveTypeController;
