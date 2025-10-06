import express from "express";
import session from "express-session";
import cors from "cors";
import path from "path";

import employeeRoutes from "./routes/employee_routes.js";
import attendanceRoutes from "./routes/time_routes.js";
import adminRoutes from "./routes/admin_routes.js";
import leaveRoutes from "./routes/leave_file.js";
import creditRoutes from "./routes/leave_credit_routes.js";

import { MY_SECRET_SERVER_SESSION } from "./constant/constants.js";
import "./scheduler/yearly_add_credit_helper.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: MY_SECRET_SERVER_SESSION,
    resave: false,
    saveUninitialized: false
}));

app.use("/api/auth", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/credit", creditRoutes);


app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

app.listen(5000, () => console.log(" Server running on http://localhost:5000"));
