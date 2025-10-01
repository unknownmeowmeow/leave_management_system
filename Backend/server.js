import express from "express";
import session from "express-session";
import cors from "cors";
import path from "path";
import EmployeeRoutes from "./Routes/EmployeeRoutes.js";
import TimeRoutes from "./Routes/TimeRoutes.js";
import adminRoutes from "./Routes/AdminRoutes.js";
import { MY_SECRET_SERVER_SESSION } from "./Constant/constants.js";
import LeaveTypeRoutes from "./Routes/LeaveFile.js";
import "./Scheduler/yearly_add_credit_helper.js";
import CreditRoutes from "./Routes/leaveCreditRoutes.js";
import leaveFileRoutes from "./Routes/LeaveFile.js";
const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json({ origin: "http://localhost:5173", credentials: true }));
app.use(express.urlencoded( { extended: true }));
app.use(session({ secret: MY_SECRET_SERVER_SESSION, resave: false, saveUninitialized: false }));

app.use("/api/admin", adminRoutes);
app.use("/api/auth", EmployeeRoutes); 
app.use("/api/attendance", TimeRoutes)    
app.use("/", LeaveTypeRoutes);
app.use("/api/leave", adminRoutes);
app.use("/api", CreditRoutes);
app.use("/api", leaveFileRoutes);
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
