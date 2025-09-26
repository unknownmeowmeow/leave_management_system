import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CreditEmployee() {
    const [creditsByEmployee, setCreditsByEmployee] = useState([]);

    const link_style = {
        margin: "0 10px",
        textDecoration: "none",
        color: "blue",
    };

    useEffect(() => {
        const fetchCredits = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/auth/credits", {
                    withCredentials: true,
                });

                if (response.data.success && Array.isArray(response.data.result)) {
                    setCreditsByEmployee(response.data.result);
                }
                else {
                    alert(response.data.error || "Failed to fetch credits");
                    setCreditsByEmployee([]);
                }
            }
            catch (error) {
                alert(error.response?.data?.error || "Server error while fetching credits");
                setCreditsByEmployee([]);
            }
        };

        fetchCredits();
    }, []);

    const formatNumber = (value) => {
        const num = Number(value);
        return isNaN(num) ? "0.00" : num.toFixed(2);
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>

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

            <h1>Employee Leave Credit Summary</h1>

            <table
                style={{
                    margin: "0 auto",
                    borderCollapse: "collapse",
                    width: "90%",
                }}
            >
                <thead>
                    <tr style={{ backgroundColor: "#e0e0e0" }}>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Full Name</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Total Earned Credit</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Total Deducted Credit</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Total Used Credit</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Total Latest Credit</th>
                    </tr>
                </thead>
                <tbody>
                    {creditsByEmployee.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{ textAlign: "center", padding: "10px" }}>
                                No credit records found.
                            </td>
                        </tr>
                    ) : (
                        creditsByEmployee.map((emp) => (
                            <tr key={emp.employee_id}>
                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                    {emp.first_name + " " + emp.last_name}
                                </td>
                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                    {formatNumber(emp.total_earned_credit)}
                                </td>
                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                    {formatNumber(emp.total_deducted_credit)}
                                </td>
                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                    {formatNumber(emp.total_used_credit)}
                                </td>
                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                    {formatNumber(emp.total_latest_credit)}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
