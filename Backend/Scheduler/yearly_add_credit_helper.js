
import cron from "node-cron";
import CreditControllers from "../Controllers/credits.js";

/**
 * Schedules a cron job to run yearly credit insertion.
 *
 * Workflow:
 * 1. Runs at midnight (00:00) on January 1st every year.
 * 2. Creates mock request and response objects to simulate an API call.
 * 3. Invokes the `runYearlyCreditInsertion` method from CreditControllers.
 * 4. Returns the result from the controller method.
 * 5. Handles the scheduled task asynchronously.
 *
 * Schedule: "0 0 1 1 *" -> At 00:00 on day 1 of month 1 (January) every year.
 *
 * created by: Rogendher Keith Lachica
 * updated at: October 2 2025 9:30 am
 */
cron.schedule("0 0 1 1 *", async () => {
    const mock_request = {};
    const mock_response = {
        json: (data) => {
            return data;
        }
    };

    return await CreditControllers.runYearlyCreditInsertion(mock_request, mock_response);
});