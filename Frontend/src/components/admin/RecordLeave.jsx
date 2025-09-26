import React, { useEffect, useState } from "react";
import axios from "axios";

export default function RecordFile() {
    const [leaves, setLeaves] = useState([]);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const container_style = { maxWidth: "1000px", margin: "40px auto", padding: "20px", fontFamily: "Arial, sans-serif" };
    const heading_style = { textAlign: "center", marginBottom: "20px" };
    const table_styling = { width: "100%", borderCollapse: "collapse" };
    const table_header_thread = { border: "1px solid #ccc", padding: "12px", textAlign: "left" };
    const header_row = { backgroundColor: "#f0f0f0" };
    const link_style = { textDecoration: "none", color: "#007bff", fontSize: "16px", margin: "0 10px" };
    const button_style = { margin: "0 5px", padding: "5px 10px", cursor: "pointer" };

    const statusStyle = (status) => {
        switch (status) {
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
            const res = await axios.get("http://localhost:5000/api/admin/leave_transactions", { withCredentials: true });
            if (res.data.success) setLeaves(res.data.data || []);
            else setError(displayMessage(res.data.message));
        } catch (err) {
            setError(displayMessage(err.response?.data?.message || "Server error."));
        }
    };

    useEffect(() => { fetchLeaves(); }, []);

    // Numeric IDs directly sent to backend (2 = approved, 4 = rejected)
    const updateStatus = async (leave_id, status_id) => {
        try {
            const res = await axios.post(
                "http://localhost:5000/api/admin/update_leave_status",
                { leave_id, status_id },
                { withCredentials: true }
            );

            if (res.data.success) {
                setMessage("Leave updated successfully.");
                setError(null);
                fetchLeaves();
            } else {
                setError(displayMessage(res.data.message));
                setMessage(null);
            }
        } catch (err) {
            setError(displayMessage(err.response?.data?.message || "Server error."));
            setMessage(null);
        }
    };

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
                    <a href="/admin" style={link_style}>Employee Attendance</a>
                </div>
            </div>

            {error && <div style={{ color: "red", marginBottom: "15px" }}>{displayMessage(error)}</div>}
            {message && <div style={{ color: "green", marginBottom: "15px" }}>{displayMessage(message)}</div>}

            <h2 style={heading_style}>Leave Records</h2>
            <table style={table_styling}>
                <thead>
                    <tr style={header_row}>
                        <th style={table_header_thread}>Employee Name</th>
                        <th style={table_header_thread}>Leave Type</th>
                        <th style={table_header_thread}>Start Date</th>
                        <th style={table_header_thread}>End Date</th>
                        <th style={table_header_thread}>Reason</th>
                        <th style={table_header_thread}>Grant Type</th>
                        <th style={table_header_thread}>Status</th>
                        <th style={table_header_thread}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {leaves.length === 0 ? (
                        <tr>
                            <td colSpan="8" style={{ ...table_header_thread, textAlign: "center" }}>No leave records found.</td>
                        </tr>
                    ) : (
                        leaves.map((leave) => (
                            <tr key={leave.id}>
                                <td style={table_header_thread}>{leave.employee_name}</td>
                                <td style={table_header_thread}>{leave.leave_type}</td>
                                <td style={table_header_thread}>{formatDate(leave.start_date)}</td>
                                <td style={table_header_thread}>{formatDate(leave.end_date)}</td>
                                <td style={table_header_thread}>{leave.reason || "-"}</td>
                                <td style={table_header_thread}>{leave.grant_type_name || "-"}</td>
                                <td style={{ ...table_header_thread, ...statusStyle(leave.status) }}>{leave.status}</td>
                                <td style={table_header_thread}>
                                    {(leave.status === "pending" || leave.status === "requested") && (
                                        <>
                                            <button style={button_style} onClick={() => updateStatus(leave.id, 2)}>Approve</button>
                                            <button style={button_style} onClick={() => updateStatus(leave.id, 4)}>Reject</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
