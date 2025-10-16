import React, { useEffect, useState } from "react";
import axios from "axios";

export default function RecordFile() {
    const [leaves, setLeaves] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const containerStyle = {
        maxWidth: "900px",
        margin: "50px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#fafafa",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    };
    const navLinkStyle = { marginRight: "15px", textDecoration: "none", color: "#007bff", fontWeight: 500 };
    const cellStyle = { padding: "12px", border: "1px solid #ccc", textAlign: "left" };
    const headerStyle = { ...cellStyle, backgroundColor: "#f0f0f0" };
    const buttonStyle = { padding: "6px 12px", margin: "0 2px", border: "none", borderRadius: "4px", cursor: "pointer", backgroundColor: "#dc3545", color: "#fff" };

    // Format date properly without UTC shift
    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" });
    };

    // Fetch leave records
    const fetchLeaves = async () => {
        setLoading(true);
        try {
<<<<<<< HEAD
            const res = await axios.get("http://localhost:5000/api/transaction/leave_transaction", { withCredentials: true });
            if (res.data.status) setLeaves(res.data.result || []);
            else setError(res.data.result || "Failed to fetch leave records.");
        } catch (err) {
            const errMsg = err.response?.data?.result
                ? typeof err.response.data.result === "string"
                    ? err.response.data.result
                    : JSON.stringify(err.response.data.result)
                : "Server error.";
            setError(errMsg);
=======
            const res = await axios.get("http://localhost:5000/api/leave/leave_transaction", { withCredentials: true });
            if (res.data.success) {
                setLeaves(res.data.data || []);
                setError(null);
            } else {
                setError(res.data.message || "Failed to fetch leave records.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Server error.");
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
        } finally {
            setLoading(false); 
        }
    };
    

    useEffect(() => { fetchLeaves(); }, []);

    // Update leave status (Cancel for employee)
    const updateStatus = async (leave_id, status_id) => {
        try {
            const res = await axios.post(
                "http://localhost:5000/api/transaction/update_leave_status",
                { leave_id, status_id },
                { withCredentials: true }
            );

            if (res.data.status) {
                setMessage("Leave updated successfully.");
                setError(null);
<<<<<<< HEAD
                fetchLeaves(); // Refresh table
=======
                fetchLeaves(); 
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
            } else {
                const errorMsg = typeof res.data.result === "string"
                    ? res.data.result
                    : JSON.stringify(res.data.result);
                setError(errorMsg);
                setMessage(null);
            }
        } catch (err) {
            const errMsg = err.response?.data?.result
                ? typeof err.response.data.result === "string"
                    ? err.response.data.result
                    : JSON.stringify(err.response.data.result)
                : "Server error.";
            setError(errMsg);
            setMessage(null);
        }
    };

    // Render table rows
    const renderRows = () => {
<<<<<<< HEAD
        if (loading) return <tr><td colSpan="11" style={{ textAlign: "center", padding: "12px" }}>Loading...</td></tr>;
        if (error || leaves.length === 0) return <tr><td colSpan="11" style={{ textAlign: "center", padding: "12px" }}>{error || "No leave records found."}</td></tr>;
=======
        if (loading) {
            return (
                <tr>
                    <td colSpan="10" style={{ textAlign: "center", padding: "12px" }}>Loading...</td>
                </tr>
            );
        }

        if (!leaves || leaves.length === 0) {
            return (
                <tr>
                    <td colSpan="10" style={{ textAlign: "center", padding: "12px" }}>
                        {error || "No leave records found."}
                    </td>
                </tr>
            );
        }
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06

        return leaves.map((leave, i) => {
            const startDate = formatDate(leave.start_date);
            const endDate = formatDate(leave.end_date);

            const totalLeaveDays = Math.floor(leave.total_leave || 0);
            const totalLeaveHours = Math.round(((leave.total_leave || 0) - totalLeaveDays) * 24);
            const totalLeaveDisplay = totalLeaveHours > 0
                ? `${totalLeaveDays} day(s) ${totalLeaveHours} hour(s)`
                : `${totalLeaveDays} day(s)`;

            return (
                <tr key={leave.id} style={{ backgroundColor: i % 2 ? "#f9f9f9" : "transparent" }}>
                    <td style={cellStyle}>{leave.employee_name}</td>
                    <td style={cellStyle}>{leave.leave_type}</td>
                    <td style={cellStyle}>{leave.grant_type_name || "-"}</td>
                    <td style={cellStyle}>{startDate}</td>
                    <td style={cellStyle}>{endDate}</td>
                    <td style={cellStyle}>{totalLeaveDisplay}</td>
                    <td style={cellStyle}>{leave.reason || "-"}</td>
                    <td style={cellStyle}>{leave.rewarded_by || "Self Apply"}</td>
                    <td style={cellStyle}>{leave.approved_by || "-"}</td>
                    <td style={cellStyle}>{leave.status || "-"}</td>
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
            {/* Navigation */}
            <div style={{ marginBottom: "30px", textAlign: "center" }}>
                <a href="/application" style={navLinkStyle}>Leave File</a>
                <a href="/dashboard" style={navLinkStyle}>Dashboard</a>
                <a href="/recordfile" style={navLinkStyle}>RecordFile</a>
                <a href="/leavetypecredit" style={navLinkStyle}>Leave Credit Balances</a>
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
                        <th style={headerStyle}>Total Leave</th>
                        <th style={headerStyle}>Reason</th>
                        <th style={headerStyle}>Rewarded By</th>
                        <th style={headerStyle}>Decision By</th>
                        <th style={headerStyle}>Status</th>
                        <th style={headerStyle}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {renderRows()}
                </tbody>
            </table>
        </div>
    );
}
