
import cron from "node-cron";
import CreditControllers from "../Controllers/credits.js";


/**
 * Executes the yearly leave credit insertion for all employees.
 * Schedule: "0 0 1 1 *" → Runs every January 1st at 12:00 AM.
 * Function: addYearlyCredit()
 * @returns {Promise<Object>} - JSON response from addYearlyCredit function
 * Last Updated At: October 2, 2025
 * @author Keith
 */
cron.schedule("* * * * * *", async () => {
    const mock_request = {};
    const mock_response = {
        json: (data) => {
            return data;
        }
    };

    return await CreditControllers.addYearlyCredit(mock_request, mock_response);
});

/**
 * Executes the monthly leave credit insertion for all employees.
 * Schedule: "0 0 0 1 * *" → Runs on the 1st day of every month at 12:00 AM.
 * Function: addMonthlyCredit()
 * @returns {Promise<Object>} - JSON response from addMonthlyCredit function
 * Last Updated At: October 2, 2025
 * @author Keith
 */
cron.schedule("* * * * * *", async () => {
    const mock_req = {};
    const mock_res = { json: (data) => console.log("Monthly:", data) };
    await CreditControllers.addMonthlyCredit(mock_req, mock_res);
});

/**
 * Resets all employee leave credits at year-end.
 * Schedule: "59 59 23 31 12 *" → Runs every December 31st at 11:59:59 PM.
 * Function: resetEmployeeCredit()
 * @returns {Promise<Object>} - JSON response from resetEmployeeCredit function
 * Last Updated At: October 2, 2025
 * @author Keith
 */
cron.schedule("59 59 23 31 12 *", async () => {
    const mock_request = {}; 
    const mock_response = {
        json: (data) => {
            return data;
        }
    };

    await CreditControllers.resetEmployeeCredit(mock_request, mock_response);
});

