import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
    const [records, setRecords] = useState([]);

    // --- Styles ---
    const containerStyle = {
        maxWidth: "800px",
        margin: "40px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fafafa",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
    };

    const buttonStyle = {
        padding: "10px 20px",
        fontSize: "16px",
        margin: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        cursor: "pointer",
        backgroundColor: "#f0f0f0",
        transition: "background-color 0.3s",
    };

    const linkStyle = {
        textDecoration: "none",
        color: "#007bff",
        fontSize: "16px",
        margin: "0 10px",
    };

    const tableStyle = {
        margin: "30px auto",
        borderCollapse: "collapse",
        width: "100%",
    };

    const thTdStyle = {
        border: "1px solid #ccc",
        padding: "10px",
    };

    const headerRowStyle = {
        backgroundColor: "#e0e0e0",
    };

    const rowStyleAlt = {
        backgroundColor: "#f9f9f9",
    };

    // --- Fetch records ---
    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const response = await axios.post(
                    "http://localhost:5000/api/attendance/record",
                    {},
                    { withCredentials: true }
                );
                if (response.data.success) {
                    setRecords(response.data.records);
                }
            } catch (error) {
                alert(error.response?.data?.message || "Failed to fetch records.");
            }
        };

        fetchRecords();
    }, []);

    // --- Handlers ---
    const handleTimeIn = async () => {
        try {
            const response = await axios.post(
                "http://localhost:5000/api/attendance/timein",
                {},
                { withCredentials: true }
            );
            alert(response.data.message);
        } catch (error) {
            alert(error.response?.data?.message);
        }
    };

    const handleTimeOut = async () => {
        try {
            const response = await axios.post(
                "http://localhost:5000/api/attendance/timeout",
                {},
                { withCredentials: true }
            );
            alert(response.data.message);
        } catch (error) {
            alert(error.response?.data?.message);
        }
    };

    const handleLeave = async () => {
        try {
            const response = await axios.post(
                "http://localhost:5000/api/attendance/leave",
                {},
                { withCredentials: true }
            );
            alert(response.data.message);
        } catch (error) {
            alert(error.response?.data?.message);
        }
    };

    return (
        <div style={containerStyle}>
            <h1>Welcome Employee</h1>

            {/* Button Actions */}
            <div style={{ marginBottom: "20px" }}>
                <button style={buttonStyle} onClick={handleTimeIn}>Time IN</button>
                <button style={buttonStyle} onClick={handleTimeOut}>Time OUT</button>
                
            </div>

            {/* Navigation Links */}
            <div style={{ marginBottom: "30px" }}>
                <a href="/application" style={linkStyle}>Leave File</a>
                <a href="/dashboard" style={linkStyle}>Dashboard</a>
                <a href="/recordfile" style={linkStyle}>RecordFile</a>
                <a href="/" style={linkStyle}>Logout</a>
            </div>

            {/* Attendance Table */}
            <h2>Your Attendance Records</h2>
            <table style={tableStyle}>
                <thead>
                    <tr style={headerRowStyle}>
                        <th style={thTdStyle}>Date</th>
                        <th style={thTdStyle}>Time In</th>
                        <th style={thTdStyle}>Time Out</th>
                    </tr>
                </thead>
                <tbody>
                    {records.length === 0 ? (
                        <tr>
                            <td colSpan="3" style={{ ...thTdStyle, textAlign: "center" }}>
                                No records found.
                            </td>
                        </tr>
                    ) : (
                        records.map((record, index) => {
                            const timeInDisplay = record.time_in
                                ? new Date(record.time_in).toLocaleTimeString()
                                : "N/A";
                            const timeOutDisplay = record.time_out
                                ? new Date(record.time_out).toLocaleTimeString()
                                : "N/A";
                            const dateDisplay = record.time_in
                                ? new Date(record.time_in).toLocaleDateString()
                                : "N/A";

                            return (
                                <tr key={index} style={index % 2 ? rowStyleAlt : {}}>
                                    <td style={thTdStyle}>{dateDisplay}</td>
                                    <td style={thTdStyle}>{timeInDisplay}</td>
                                    <td style={thTdStyle}>{timeOutDisplay}</td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}
