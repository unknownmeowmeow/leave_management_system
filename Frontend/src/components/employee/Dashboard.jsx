import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
    const [records, setRecords] = useState([]);

    const header_container_style = {
        textAlign: "center",
        marginTop: "50px",
    };

    const button_style = {
        padding: "10px 20px",
        fontSize: "16px",
        margin: "0 10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        cursor: "pointer",
        backgroundColor: "#f0f0f0",
        transition: "background-color 0.3s",
    };

    const link_style = {
        textDecoration: "none",
        color: "#007bff",
        fontSize: "16px",
        margin: "0 10px",
    };

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const response = await axios.post(
                    "http://localhost:5000/api/attendance/record",
                    {},
                    { withCredentials: true }
                );
                console.log("Attendance Records:", response.data.records);
                if (response.data.success) {
                    setRecords(response.data.records);
                } else {
                    alert(response.data.message);
                }
            } catch (error) {
                alert(error.response?.data?.message || "Failed to fetch attendance records.");
            }
        };

        fetchRecords();
    }, []);

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
        <div style={header_container_style}>
            <h1>Welcome Employee</h1>
            <button style={button_style} onClick={handleTimeIn}>
                Time IN
            </button>
            <button style={button_style} onClick={handleTimeOut}>
                Time Out
            </button>
            <button style={button_style} onClick={handleLeave}>
                File Leave
            </button>
            <a href="/" style={link_style}>
                Logout
            </a>

            <h2 style={{ marginTop: "40px" }}>Your Attendance Records</h2>
            <table
                style={{
                    margin: "0 auto",
                    borderCollapse: "collapse",
                    width: "80%",
                }}
            >
                <thead>
                    <tr style={{ backgroundColor: "#e0e0e0" }}>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Date</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Time In</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Time Out</th>
                    </tr>
                </thead>
                <tbody>
                    {records.length === 0 && (
                        <tr>
                            <td colSpan="3" style={{ textAlign: "center", padding: "10px" }}>
                                No records found.
                            </td>
                        </tr>
                    )}

                    {records.length > 0 &&
                        records.map((record, index) => {
                            let timeInDisplay = "N/A";
                            let timeOutDisplay = "N/A";

                            if (record.time_in) {
                                timeInDisplay = new Date(record.time_in).toLocaleTimeString();
                            }

                            if (record.time_out) {
                                timeOutDisplay = new Date(record.time_out).toLocaleTimeString();
                            }

                            return (
                                <tr key={index}>
                                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                        {new Date(record.time_in).toLocaleDateString()}
                                    </td>
                                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                        {timeInDisplay}
                                    </td>
                                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                        {timeOutDisplay}
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
}
