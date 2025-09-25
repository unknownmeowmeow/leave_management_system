/**
 * Schedule a yearly cron job to insert leave credits.
 * Runs at midnight on January 1st every year.
 * Calls the runYearlyCreditInsertion controller to process credits.
 * 
 * - Logs start of the job.
 * - Uses mock request and response objects.
 * - Logs success or error based on controller response.
 * created by: rogendher keith lachica
 * updated at: September 25 2025 3:45 pm
 */
import cron from "node-cron";
import CreditControllers from "../Controllers/CreditControllers.js";

cron.schedule("0 0 1 1 *", async () => {
    console.log("Yearly leave credit job started...");

    const mock_request = {};
    const mock_response = {
        json: (data) => {
            if(data.success){
                console.log(" Success:", data.result);
            } 
            else{
                console.error(" Error:", data.error);
            }
        }
    };

    await CreditControllers.runYearlyCreditInsertion(mock_request, mock_response);
});
