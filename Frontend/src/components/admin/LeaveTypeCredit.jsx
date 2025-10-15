import React, { useEffect, useState } from "react";
import axios from "axios";

export default function LeaveTypeCredit() {
    const [employees, setEmployees] = useState([]);
    const [employeeTotals, setEmployeeTotals] = useState({});
    const [selectedHistory, setSelectedHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [serverMessage, setServerMessage] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState("");

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/auth/employees", { withCredentials: true });
                if (res.data.status) {
                    setEmployees(res.data.result);

                    // fetch total latest credits per employee
                    const totals = {};
                    await Promise.all(
                        res.data.result.map(async emp => {
                            try {
                                const resSummary = await axios.get(`http://localhost:5000/api/credits/${emp.id}/summary`, { withCredentials: true });
                                if (resSummary.data.status) {
                                    totals[emp.id] = resSummary.data.result.reduce(
                                        (sum, r) => sum + Number(r.latest_credit || 0), 
                                        0
                                    );
                                } else {
                                    totals[emp.id] = 0;
                                }
                            } catch {
                                totals[emp.id] = 0;
                            }
                        })
                    );
                    setEmployeeTotals(totals);

                } else {
                    setServerMessage(res.data.message);
                }
            } catch (err) {
                setServerMessage(err.response?.data?.message || "Server error");
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, []);

    const viewHistory = async (employee_id, employee_name) => {
        if (!employee_id) {
            setServerMessage("Invalid employee selected");
            return;
        }

        try {
            const res = await axios.get(`http://localhost:5000/api/credits/${employee_id}/summary`, { withCredentials: true });
            if (res.data.status) {
                setSelectedHistory(res.data.result);
                setSelectedEmployee(employee_name);
                setModalOpen(true);
            } else {
                setServerMessage(res.data.message);
            }
        } catch (err) {
            setServerMessage(err.response?.data?.message || "Server error");
        }
    };

    // Styles
    const linkStyle = { textDecoration: "none", color: "#007bff", fontSize: "16px", margin: "0 10px" };
    const formWrapperStyle = { backgroundColor: "#f9f9f9", padding: "30px", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" };
    const formHeaderStyle = { marginBottom: "20px", borderBottom: "1px solid #ccc", paddingBottom: "10px" };
    const messageBoxStyle = { marginBottom: "20px", padding: "10px", borderRadius: "4px", backgroundColor: "#f0f0f0", color: "#333", fontWeight: "bold" };
    const tableStyle = { width: "100%", borderCollapse: "collapse", marginTop: "20px" };
    const thTdStyle = { border: "1px solid #ccc", padding: "8px", textAlign: "center" };
    const buttonStyle = { padding: "6px 12px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" };
    const modalStyle = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" };
    const modalContentStyle = { backgroundColor: "#fff", padding: "20px", borderRadius: "8px", width: "80%", maxHeight: "80%", overflowY: "auto" };
    const closeBtnStyle = { float: "right", padding: "4px 8px", cursor: "pointer", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px" };

    return (
        <div style={{ maxWidth: "900px", margin: "50px auto", fontFamily: "Segoe UI, Arial, sans-serif" }}>
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
                <h1>Admin - Employee Leave History</h1>
                <div>
                    <a href="/" style={linkStyle}>Logout</a>
                    <a href="/employeecredit" style={linkStyle}>Employee Credit</a>
                    <a href="/adminleavefile" style={linkStyle}>Leave File Application</a>
                    <a href="/adminrecordfile" style={linkStyle}>Employee Leave Record</a>
                    <a href="/adminleavetypehistoryperemployee" style={linkStyle}>Employee Leave Credit</a>
                    <a href="/allhistoryemployeeleavecredit" style={linkStyle}>Leave Employee History</a>
                    <a href="/adminrewardedfile" style={linkStyle}>Leave Rewarded Employee History</a>                     
                    <a href="/admin" style={linkStyle}>Employee Attendance</a>
                </div>
            </div>

            <div style={formWrapperStyle}>
                <h2 style={formHeaderStyle}>Employee Leave History</h2>

                {serverMessage && <div style={messageBoxStyle}>{serverMessage}</div>}

                {loading ? <div>Loading employees...</div> : (
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thTdStyle}>Employee</th>
                                <th style={thTdStyle}>Total Latest Credit</th>
                                <th style={thTdStyle}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(emp => (
                                <tr key={emp.id}>
                                    <td style={thTdStyle}>{emp.first_name} {emp.last_name}</td>
                                    <td style={thTdStyle}>{Number(employeeTotals[emp.id] ?? 0).toFixed(2)}</td>
                                    <td style={thTdStyle}>
                                        <button style={buttonStyle} onClick={() => viewHistory(emp.id, `${emp.first_name} ${emp.last_name}`)}>View Summary</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {modalOpen && (
                    <div style={modalStyle} onClick={() => setModalOpen(false)}>
                        <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
                            <button style={closeBtnStyle} onClick={() => setModalOpen(false)}>Close</button>
                            <h2>{selectedEmployee} - Leave History</h2>
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
                                    {selectedHistory.map((h, index) => (
                                        <tr key={index}>
                                            <td style={thTdStyle}>{h.name || "N/A"}</td>
                                            <td style={thTdStyle}>{h.earned_credit}</td>
                                            <td style={thTdStyle}>{h.used_credit}</td>
                                            <td style={thTdStyle}>{h.deducted_credit}</td>
                                            <td style={thTdStyle}>{h.latest_credit}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
