import React, { useEffect, useState } from "react";
import axios from "axios";

export default function RecordFile() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const table_style = {
    margin: "40px auto",
    borderCollapse: "collapse",
    width: "80%",
  };

  const th_td_style = {
    border: "1px solid #ccc",
    padding: "8px",
    textAlign: "left",
  };

  const header_th_style = {
    ...th_td_style,
    backgroundColor: "#e0e0e0",
  };

  useEffect(() => {
    axios.get("http://localhost:5000/api/leave/leave_transaction", { withCredentials: true })
      .then(res => {
        if (res.data.success) setLeaves(res.data.data);
        else setError(res.data.message);
      })
      .catch(() => setError("Failed to fetch leave records."))
      .finally(() => setLoading(false));
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

  return (
    <div style={header_container_style}>
      <h1>Welcome Intern</h1>
      <button style={button_style} onClick={handleTimeIn}>
        Time IN
      </button>
      <button style={button_style} onClick={handleTimeOut}>
        Time Out
      </button>
      <a href="/" style={link_style}>
        Logout
      </a>
      <a href="/interndashboard" style={link_style}>
        Intern Dashboard
      </a>
      <a href="/InternRecord" style={link_style}>
        Leave Records
      </a>

      <h2 style={{ marginTop: "40px" }}>Approved Leave Records</h2>
      <table style={table_style}>
        <thead>
          <tr>
            <th style={header_th_style}>Employee Name</th>
            <th style={header_th_style}>Leave Type</th>
            <th style={header_th_style}>Grant Type</th>
            <th style={header_th_style}>Start Date</th>
            <th style={header_th_style}>End Date</th>
            <th style={header_th_style}>Reason</th>
            <th style={header_th_style}>Status</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: "10px" }}>
                Loading...
              </td>
            </tr>
          )}
          {!loading && (error || leaves.length === 0) && (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: "10px" }}>
                {error || "No approved leaves found."}
              </td>
            </tr>
          )}
          {!loading &&
            leaves.length > 0 &&
            leaves.map((leave) => (
              <tr key={leave.id}>
                <td style={th_td_style}>{leave.employee_name}</td>
                <td style={th_td_style}>{leave.leave_type}</td>
                <td style={th_td_style}>{leave.grant_type_name}</td>
                <td style={th_td_style}>{leave.start_date}</td>
                <td style={th_td_style}>{leave.end_date}</td>
                <td style={th_td_style}>{leave.reason}</td>
                <td style={th_td_style}>{leave.status}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
