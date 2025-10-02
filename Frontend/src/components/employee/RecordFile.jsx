import React, { useEffect, useState } from "react";
import axios from "axios";

export default function RecordFile() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:5000/api/leave/leave_transaction", { withCredentials: true });
            if (res.data.success) setLeaves(res.data.data);
            else setError(res.data.message);
        } catch {
            setError("Failed to fetch leave records.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

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
                fetchLeaves(); // refresh table
            } else {
                setError(res.data.message || "Failed to update leave.");
                setMessage(null);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Server error.");
            setMessage(null);
        }
    };

    const containerStyle = { maxWidth: "900px", margin: "50px auto", padding: "20px", fontFamily: "Arial, sans-serif", backgroundColor: "#fafafa", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" };
    const navLinkStyle = { marginRight: "15px", textDecoration: "none", color: "#007bff", fontWeight: 500 };
    const cellStyle = { padding: "12px", border: "1px solid #ccc", textAlign: "left" };
    const headerStyle = { ...cellStyle, backgroundColor: "#f0f0f0" };
    const buttonStyle = { padding: "6px 12px", margin: "0 2px", border: "none", borderRadius: "4px", cursor: "pointer", backgroundColor: "#dc3545", color: "#fff" };

    const renderRows = () => {
        if (loading) return <tr><td colSpan="10" style={{ textAlign: "center", padding: "12px" }}>Loading...</td></tr>;
        if (error || leaves.length === 0) return <tr><td colSpan="10" style={{ textAlign: "center", padding: "12px" }}>{error || "No approved leaves found."}</td></tr>;

        return leaves.map((leave, i) => {
            const startDateISO = leave.start_date ? new Date(leave.start_date).toISOString().split("T")[0] : "";
            const endDateISO = leave.end_date ? new Date(leave.end_date).toISOString().split("T")[0] : "";

            return (
                <tr key={leave.id} style={{ backgroundColor: i % 2 ? "#f9f9f9" : "transparent" }}>
                    <td style={cellStyle}>{leave.employee_name}</td>
                    <td style={cellStyle}>{leave.leave_type}</td>
                    <td style={cellStyle}>{leave.grant_type_name}</td>
                    <td style={cellStyle}>{startDateISO}</td>
                    <td style={cellStyle}>{endDateISO}</td>
                    <td style={cellStyle}>{leave.reason}</td>
                    <td style={cellStyle}>{leave.rewarded_by || "Self Apply"}</td>
                    <td style={cellStyle}>{leave.approved_by}</td>
                    <td style={cellStyle}>{leave.status}</td>
                    <td style={cellStyle}>
                        {(leave.status?.toLowerCase() === "pending" || leave.status?.toLowerCase() === "requested") && (
                            <button style={buttonStyle} onClick={() => updateStatus(leave.id, 3)}>Cancel</button>
                        )}
                    </td>
                </tr>
            );
        });
    };

    return (
        <div style={containerStyle}>
            <div style={{ marginBottom: "30px", textAlign: "center" }}>
                <a href="/application" style={navLinkStyle}>Leave File</a>
                <a href="/dashboard" style={navLinkStyle}>Dashboard</a>
                <a href="/recordfile" style={navLinkStyle}>RecordFile</a>
                <a href="/" style={navLinkStyle}>Logout</a>
            </div>

            {message && <p style={{ color: "green", textAlign: "center" }}>{message}</p>}
            {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Welcome Employee</h1>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th style={headerStyle}>Employee Name</th>
                        <th style={headerStyle}>Leave Type</th>
                        <th style={headerStyle}>Grant Type</th>
                        <th style={headerStyle}>Start Date</th>
                        <th style={headerStyle}>End Date</th>
                        <th style={headerStyle}>Reason</th>
                        <th style={headerStyle}>Rewarded By</th>
                        <th style={headerStyle}>Decision By</th>
                        <th style={headerStyle}>Status</th>
                        <th style={headerStyle}>Action</th>
                    </tr>
                </thead>
                <tbody>{renderRows()}</tbody>
            </table>
        </div>
    );
}
