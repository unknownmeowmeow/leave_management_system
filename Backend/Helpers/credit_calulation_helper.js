import { NUMBER, DECIMAL_NUMBER } from "../Constant/constants.js";

class CreditCalculationHelper{
    constructor(){

    }

    /**
     * Calculates the total base value from a collection of leave type records (2D Array format).
     * @param {Array} leave_types - Array of leave type records, each containing a base_value.
     * @returns {number} Total sum of all base_value fields.
     * Last Updated At: October 1, 2025 02:35 PM
     * @author Keith
     */
    getTotalBaseValue(leave_types){
        return leave_types.reduce((total, leave_type) => { return total + (Number(leave_type.base_value) || DECIMAL_NUMBER.zero_point_zero_zero); }, DECIMAL_NUMBER.zero_point_zero_zero);
    }
    

    /**
     * Calculates the total base value from an array of leave type objects.
     * @param {Array} leave_types - Array of leave type objects, each containing a base_value.
     * @returns {number} Total sum of all base_value fields.
     * Last Updated At: October 1, 2025 02:45 PM
     * @author Keith
     */
    getLeaveTypeBaseValue(leave_types){

        if(!leave_types || !leave_types.length){
            return NUMBER.zero;
        }
        
        return leave_types.reduce((total, leave_type) => total + (parseFloat(leave_type.base_value) || NUMBER.zero), NUMBER.zero);
    }
    
    /**
     * Calculates the total base leave credits from an array of leave type objects.
     * Functionally identical to `getTotalBaseValue` but with a reusable method name.
     * @param {Array<Object>} leave_type - Array of leave type objects, each with a base_value.
     * @returns {number} Total sum of all base_value fields.
     * Last Updated At: October 2, 2025 03:30 PM
     * @author Keith
     */
    calculateBaseValueCredit(leave_type){

        if(!leave_type || !leave_type.length){
            return NUMBER.zero;
        }

        return leave_type.reduce((sum, leave) => { const base_value = parseFloat(leave.base_value) || NUMBER.zero; return sum + base_value; }, NUMBER.zero);
    }
}

export default new CreditCalculationHelper();
