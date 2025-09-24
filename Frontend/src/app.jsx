import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/auth/Login.jsx";
import Register from "./components/auth/Register.jsx";
import Dashboard from "./components/employee/Dashboard.jsx";
import AdminDashboard from "./components/admin/Dashboard.jsx";
import LeaveFile from "./components/employee/LeaveFile.jsx";
import RecordFile from "./components/employee/RecordFile.jsx";
import PendingLeave from "./components/admin/PendingLeave.jsx";
import ApprovedLeave from "./components/admin/ApprovedLeave.jsx";
import CancelledLeave from "./components/admin/CancelledLeave.jsx";
import RecordLeave from "./components/admin/RecordLeave.jsx";
import RejectedLeave from "./components/admin/RejectedLeave.jsx";
import NotFound from "./components/NotFound.jsx";
import Footers from "./components/partial/Footer.jsx";
import Logout from "./components/auth/Login.jsx";
import InternDashboard from "./components/intern/Dashboard.jsx";
import Credit from "./components/admin/CreditEmployee.jsx";
function App() {
  const main_content_style = { padding: "20px", minHeight: "80vh" };

  return (

    <Router>

      <div style={main_content_style}>
        <Routes>
          <Route path="/employeecredit" element ={<Credit />}>  </Route>
          <Route path="/" element={<Login />} />
          <Route path="/" element={<Logout />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/application" element={<LeaveFile />} />
          <Route path="/recordfile" element={<RecordFile />} />
          <Route path="/pendingleave" element={<PendingLeave />} />
          <Route path="/approvedleave" element={<ApprovedLeave />} />
          <Route path="/cancelledleave" element={<CancelledLeave />} />
          <Route path="/recordleave" element={<RecordLeave />} />
          <Route path="/rejectedleave" element={<RejectedLeave />} />
          <Route path="/interndashboard" element={<InternDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      
      <Footers />
      
    </Router>
    
  );
}

export default App;
