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
