import React, { useEffect, useState } from "react";
import axios from "axios";

export default function RecordFile() {
    const [leaves, setLeaves] = useState([]);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const container_style = { maxWidth: "1000px", margin: "40px auto", padding: "20px", fontFamily: "Arial, sans-serif" };
    const heading_style = { textAlign: "center", marginBottom: "20px" };
    const table_styling = { width: "100%", borderCollapse: "collapse" };
    const table_cell = { border: "1px solid #ccc", padding: "12px", textAlign: "left" };
    const header_row = { backgroundColor: "#f0f0f0" };
    const link_style = { textDecoration: "none", color: "#007bff", fontSize: "16px", margin: "0 10px" };

    const statusStyle = (status) => {
        switch ((status || "").toLowerCase()) {
            case "approved": return { color: "green", fontWeight: "bold" };
            case "rejected": return { color: "red", fontWeight: "bold" };
            case "pending":
            case "requested": return { color: "orange", fontWeight: "bold" };
            case "cancelled": return { color: "gray", fontWeight: "bold" };
            default: return {};
        }
    };

    const displayMessage = (msg) => (typeof msg === "string" ? msg : JSON.stringify(msg, null, 2));

    const fetchLeaves = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/transaction/rewarded_transactions", { withCredentials: true });
            if (res.data.status) setLeaves(res.data.result || []);
            else setError(displayMessage(res.data.message || "Failed to fetch leave records."));
        } catch (err) {
            setError(displayMessage(err.response?.data?.message || "Server error."));
        }
    };

    useEffect(() => { fetchLeaves(); }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        const d = new Date(dateStr);
        return d.toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' });
    };

    return (
        <div style={container_style}>
            <div style={{ textAlign: "center", marginTop: "30px", marginBottom: "30px" }}>
                <h1>Welcome Admin</h1>
                <div>
                    <a href="/" style={link_style}>Logout</a>
                    <a href="/employeecredit" style={link_style}>Employee Credit</a>
                    <a href="/adminleavefile" style={link_style}>Leave File Application</a>
                    <a href="/adminrecordfile" style={link_style}>Employee Leave Record</a>
                    <a href="/adminleavetypehistoryperemployee" style={link_style}>Employee Leave History</a>
                    <a href="/allhistoryemployeeleavecredit" style={link_style}>Leave Employee History</a>
                    <a href="/adminrewardedfile" style={link_style}>Leave Rewarded Employee History</a>                     
                    <a href="/admin" style={link_style}>Employee Attendance</a>
                </div>
            </div>

            {error && <div style={{ color: "red", marginBottom: "15px" }}>{displayMessage(error)}</div>}
            {message && <div style={{ color: "green", marginBottom: "15px" }}>{displayMessage(message)}</div>}

            <h2 style={heading_style}>Leave Records</h2>
            <table style={table_styling}>
                <thead>
                    <tr style={header_row}>
                        <th style={table_cell}>Employee Name</th>
                        <th style={table_cell}>Leave Type</th>
                        <th style={table_cell}>Grant Type</th>
                        <th style={table_cell}>Total Credit</th>
                        <th style={table_cell}>Rewarded By</th>
                        <th style={table_cell}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {leaves.length === 0 ? (
                        <tr>
                            <td colSpan="10" style={{ ...table_cell, textAlign: "center" }}>No leave records found.</td>
                        </tr>
                    ) : (
                        leaves.map((leave) => (
                            <tr key={leave.id}>
                                <td style={table_cell}>{leave.employee_name}</td>
                                <td style={table_cell}>{leave.leave_type}</td>
                                <td style={table_cell}>{leave.grant_type_name || "-"}</td>
                                <td style={table_cell}>{Math.floor(leave.total_leave) || 0}</td>
                                <td style={table_cell}>{leave.rewarded_by || "-"}</td>
                                <td style={{ ...table_cell, ...statusStyle(leave.status) }}>{leave.status || "-"}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
