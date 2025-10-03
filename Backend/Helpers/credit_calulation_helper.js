import { NUMBER } from "../Constant/constants.js";

class CreditCalculationHelper{
    
    /**
     * Calculates the total base value from a collection of leave type records (2D Array format).
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 02:35 PM
     */
    static getTotalBaseValue(leave_types){
        return leave_types.reduce((total, leave_type) => { return total + (Number(leave_type.base_value) || NUMBER.zero_point_zero_zero); }, NUMBER.zero_point_zero_zero);
    }
    

    /**
     * Calculates the total base value from an array of leave type objects.
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 02:45 PM
     */
    static getTotalBaseValueFromLeaveTypes(leave_types){

        if(!leave_types || !leave_types.length){
            return NUMBER.zero;
        }
        
        return leave_types.reduce((total, leave_type) => total + (parseFloat(leave_type.base_value) || NUMBER.zero), NUMBER.zero);
    }
    
    /**
     * Calculates the total base leave credits from an array of leave type objects.
     * This is functionally identical to `getTotalBaseValueFromLeaveTypes` but ensures a safe, reusable name.
     * @param {Array<Object>} leaveTypes - Array of leave type objects, each containing a `base_value` property (string or number).
     * @returns {number} The total sum of all `base_value` fields.
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 2, 2025 03:30 PM
     */
    static calculateTotalBaseLeaveCredits(leave_type){

        if(!leave_type || !leave_type.length){
            return NUMBER.zero;
        }

        return leave_type.reduce((sum, leave) => { const base_value = parseFloat(leave.base_value) || NUMBER.zero; return sum + base_value; }, NUMBER.zero);
    }
}

export default CreditCalculationHelper;
