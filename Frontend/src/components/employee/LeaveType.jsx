import React, { useEffect, useState } from "react";
import axios from "axios";

export default function LeaveHistory() {
    const [history, setHistory] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/credits/history", { withCredentials: true });
                if (res.data.status) {
                    setHistory(res.data.result);
                } else {
                    setError(res.data.message);
                }
            } catch (err) {
                setError(err.response?.data?.message || "Server error.");
            }
        };
        fetchHistory();
    }, []);

    const containerStyle = {
        maxWidth: "900px",
        margin: "50px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#fafafa",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    };
    const navLinkStyle = { marginRight: "15px", textDecoration: "none", color: "#007bff", fontWeight: 500 };
    const tableStyle = { width: "100%", borderCollapse: "collapse", marginTop: "20px" };
    const thTdStyle = { border: "1px solid #ccc", padding: "8px", textAlign: "center" };
    const totalRowStyle = { fontWeight: "bold", backgroundColor: "#e6f7ff" };

    // Compute total of latest_credit
    const totalLatestCredit = history.reduce((sum, record) => sum + Number(record.latest_credit || 0), 0);

    return (
        <div style={containerStyle}>
            {/* Navigation */}
            <div style={{ marginBottom: "30px", textAlign: "center" }}>
                <a href="/application" style={navLinkStyle}>Leave File</a>
                <a href="/dashboard" style={navLinkStyle}>Dashboard</a>
                <a href="/recordfile" style={navLinkStyle}>RecordFile</a>
                <a href="/leavetypecredit" style={navLinkStyle}>Leave Credit Balance</a>
                <a href="/" style={navLinkStyle}>Logout</a>
            </div>

            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Leave Credit Balance</h1>

            {error && <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>}

            {history.length > 0 ? (
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thTdStyle}>Leave Type</th>
                            <th style={thTdStyle}>Earned</th>
                            <th style={thTdStyle}>Used</th>
                            <th style={thTdStyle}>Deducted</th>
                            <th style={thTdStyle}>Latest Credit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map(record => (
                            <tr key={record.id}>
                                <td style={thTdStyle}>{record.name}</td>
                                <td style={thTdStyle}>{record.earned_credit}</td>
                                <td style={thTdStyle}>{record.used_credit}</td>
                                <td style={thTdStyle}>{record.deducted_credit}</td>
                                <td style={thTdStyle}>{record.latest_credit}</td>
                            </tr>
                        ))}

                        <tr style={totalRowStyle}>
                            <td style={thTdStyle} colSpan={4}>Total Latest Credit</td>
                            <td style={thTdStyle}>{totalLatestCredit.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            ) : (
                <div>No leave credit records found.</div>
            )}
        </div>
    );
}
