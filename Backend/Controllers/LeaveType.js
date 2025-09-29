import LeaveTypeModel from "../Models/LeaveType.js";

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
                return res.json({ success: false, message: "User session not found." }); 
            }
            const result = await LeaveTypeModel.getAllLeaveDefaultType(); 
    
            if(!result.status){
                return res.json({ success: false, message: result.error }); 
            }
    
            return res.json({ success: true, data: result.result });
        } 
        catch(error){ 
            return res.json({ success: false, message: "Error in default Leave type Controllers" });        
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
                return res.json({ success: false, message: "User session not found." });
            }
            const result = await LeaveTypeModel.getAllSpecialAndRewardedLeaveType();
    
            if(!result.status){
                return res.json({ success: false, message: result.error });
            }

            return res.json({ success: true, data: result.result });
        } 
        catch(error){
            return res.json({ success: false, message: "Error in special  and rewarded Leave type Controllers" });
        }
    }
}

export default LeaveTypeController;
