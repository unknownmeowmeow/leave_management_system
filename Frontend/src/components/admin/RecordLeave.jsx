import React from "react";

export default function RecordFile() {
  const containerStyle = {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  };

  const header_container_style = {
    textAlign: "center",
    marginTop: "30px",
    marginBottom: "30px",
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

  const headingStyle = {
    textAlign: "center",
    marginBottom: "20px",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const thTdStyle = {
    border: "1px solid #ccc",
    padding: "12px",
    textAlign: "left",
  };

  const headerRowStyle = {
    backgroundColor: "#f0f0f0",
  };

  return (
    <div style={containerStyle}>
      <div style={header_container_style}>
        <h1>Welcome Admin</h1>
        <div style={{ marginBottom: "20px" }}>
          <button style={button_style}>Time IN</button>
          <button style={button_style}>Time OUT</button>
        </div>
        <div>
          <a href="/" style={link_style}>
            Logout
          </a>
          <a href="/employeecredit" style={link_style}>
            Employee Credit
          </a>
          <a href="/application" style={link_style}>
            Leave File Application
          </a>
          <a href="/admin" style={link_style}>
            Employee Attendance
          </a>
          <a href="/recordleave" style={link_style}>
            Employee Leave Record
          </a>
        </div>
      </div>

      <h2 style={headingStyle}>Approved Leave Records</h2>
      <table style={tableStyle}>
        <thead>
          <tr style={headerRowStyle}>
            <th style={thTdStyle}>Employee Name</th>
            <th style={thTdStyle}>Leave Type</th>
            <th style={thTdStyle}>Start Date</th>
            <th style={thTdStyle}>End Date</th>
            <th style={thTdStyle}>Reason</th>
            <th style={thTdStyle}>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="6" style={{ ...thTdStyle, textAlign: "center" }}>
              No approved leaves found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
