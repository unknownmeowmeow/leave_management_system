import { NUMBER } from "../Constant/constants.js";

class CreditCalculationHelper {

    /**
     * Calculates the total base value from a collection of leave type records.
     *
     * Workflow:
     * 1. Initialize `total` to 0.
     * 2. Iterate through the `insert_all_base_value` array.
     *    - Each element is expected to be an array (row-like structure).
     *    - The base value is stored at index `NUMBER.two` (index 2).
     * 3. Accumulate the base values into `total`.
     * 4. Return the computed total.
     *
     * Example Input:
     * [
     *   [1, "Vacation Leave", 5],
     *   [2, "Sick Leave", 7]
     * ]
     *
     * Example Output:
     * 13  // (5 + 7 + 1)
     *
     * @param {Array<Array>} insert_all_base_value - 
     *        A 2D array of leave type records, where each record contains a base value at index `2`.
     * @returns {number} Total sum of all base values.
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 02:35 PM
     */
    static getTotalBaseValue(insert_all_base_value){
        let total = NUMBER.zero;

        for(let i = NUMBER.zero; i < insert_all_base_value.length; i++){
            total += insert_all_base_value[i][NUMBER.two];
        }
        return total;
    }

    /**
     * Calculates the total base leave credits from a list of leave types.
     *
     * Workflow:
     * 1. Validate input:
     *    - If `leave_types` is null/undefined or empty → return 0.
     * 2. Use `Array.reduce()` to accumulate the `base_value` of each leave type.
     *    - `parseFloat()` ensures proper numeric conversion.
     *    - Falls back to `NUMBER.zero` if `base_value` is missing or invalid.
     * 3. Return the computed total as a number.
     *
     * Example Input:
     * [
     *   { id: 1, name: "Vacation Leave", base_value: "5.00" },
     *   { id: 2, name: "Sick Leave", base_value: "7.00" },
     * ]
     *
     * Example Output:
     * 13  // (5 + 7 + 1)
     *
     * @param {Array<Object>} leave_types - 
     *        Array of leave type objects, each containing a `base_value` property.
     * @returns {number} The total base value of all leave types combined.
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 02:45 PM
     */
    static getTotalBaseValueFromLeaveTypes(leave_types) {
        if (!leave_types || !leave_types.length) {
            return NUMBER.zero;
        }
        return leave_types.reduce(
            (total, leave_type) => total + parseFloat(leave_type.base_value || NUMBER.zero), 
            NUMBER.zero
        );
    }
    
    /**
     * Calculates the total base leave credits from an array of leave type objects.
     *
     * - Iterates through the array using `Array.reduce()`.
     * - Converts each `leave.base_value` to a number with `parseFloat()`.
     * - Falls back to `NUMBER.zero` if `base_value` is missing or not numeric.
     * - Starts summation from `NUMBER.zero` to ensure a numeric result.
     *
     * Example:
     * Input:
     * [
     *   { id: 1, name: "Vacation Leave", base_value: "5" },
     *   { id: 2, name: "Sick Leave", base_value: "7" }
     * ]
     *
     * Output:
     * 13
     *
     * @param {Array<Object>} leaveTypes - Array of leave type objects, each containing `base_value`.
     * @returns {number} The total sum of all `base_value` fields.
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 03:18 PM
     */
    static getTotalBaseValue(leaveTypes) {
        return leaveTypes.reduce((sum, leave) => {
            return sum + (parseFloat(leave.base_value) || NUMBER.zero);
        }, NUMBER.zero);
    }
}

export default CreditCalculationHelper;
