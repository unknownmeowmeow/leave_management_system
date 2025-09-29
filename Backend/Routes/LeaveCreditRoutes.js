import express from "express";
import CreditControllers from "../Controllers/Credit.js";

const router = express.Router();

router.post("/credits/yearly", CreditControllers.runYearlyCreditInsertion);

export default router;
