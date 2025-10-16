
import cron from "node-cron";
import credit from "../controllers/credits.js";


/**
<<<<<<< HEAD
 * Executes the yearly leave credit insertion for all employees.
 * Schedule: "0 0 1 1 *" → Runs every January 1st at 12:00 AM.
 * Function: addYearlyCredit()
 * @returns {Promise<Object>} - JSON response from addYearlyCredit function
 * Last Updated At: October 2, 2025
 * @author Keith
=======
 * Schedules a cron job to run yearly credit insertion.
 * Schedule: "0 0 1 1 *" -> At 00:00 on day 1 of month 1 (January) every year.
 * created by: Rogendher Keith Lachica
 * updated at: October 2 2025 9:30 am
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
 */
cron.schedule("* * * * * *", async () => {
    const mock_request = {};
    const mock_response = {
        json: (data) => {
            return data;
        }
    };

<<<<<<< HEAD
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

=======
    return await credit.runYearlyCreditInsertion(mock_request, mock_response);
});
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
