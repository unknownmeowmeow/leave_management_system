
import cron from "node-cron";
import credit from "../controllers/credits.js";

/**
 * Schedules a cron job to run yearly credit insertion.
 * Schedule: "0 0 1 1 *" -> At 00:00 on day 1 of month 1 (January) every year.
 * created by: Rogendher Keith Lachica
 * updated at: October 2 2025 9:30 am
 */
cron.schedule("0 0 0 1 1 *", async () => {
    const mock_request = {};
    const mock_response = {
        json: (data) => {
            return data;
        }
    };

    return await credit.runYearlyCreditInsertion(mock_request, mock_response);
});