import express from "express";
import CreditControllers from "../Controllers/CreditControllers.js";

const router = express.Router();

router.post("/credits/yearly", CreditControllers.runYearlyCreditInsertion);

export default router;
