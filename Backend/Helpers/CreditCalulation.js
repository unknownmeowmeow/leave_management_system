class CreditCalculationHelper {

    /**
     * Calculate the total of all earned credits from an array of [employee_id, leave_type_id, earned_credit]
     * @param {Array} insert_all_base_value - array of arrays
     * @returns {number} total_base_value
     */
    static getTotalBaseValue(insert_all_base_value) {
        let total = 0;
        for (let i = 0; i < insert_all_base_value.length; i++) {
            total += insert_all_base_value[i][2];
        }
        return total;
    }

    /**
     * Calculate the total base value from an array of leave type objects
     * @param {Array} leave_types - array of objects with a base_value property
     * @returns {number} total_base_value
     */
    static getTotalBaseValueFromLeaveTypes(leave_types) {
        if (!leave_types || !leave_types.length) return 0;
        return leave_types.reduce((total, leave_type) => total + parseFloat(leave_type.base_value || 0), 0);
    }
    /**
    * Calculates the total base value from a list of leave types.
    * @param {Array} leaveTypes - Array of leave type objects with base_value
    * @returns {number} Total base value
    */
    static getTotalBaseValue(leaveTypes) {
        return leaveTypes.reduce((sum, leave) => {
            return sum + (parseFloat(leave.base_value) || 0);
        }, 0);
    }
}

export default CreditCalculationHelper;
