// src/components/employee/LeaveFile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const LeaveFile = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [latestCredit, setLatestCredit] = useState(null);
  const [form, setForm] = useState({
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: "",
  });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Fetch leave types and latest credit on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resTypes = await axios.get("http://localhost:5000/api/leave_types", {
          withCredentials: true,
        });

        if (resTypes.data.success && Array.isArray(resTypes.data.data)) {
          setLeaveTypes(resTypes.data.data);
        }

        const resCredit = await axios.get("http://localhost:5000/api/leave/latest_credit", {
          withCredentials: true,
        });

        if (resCredit.data.success) setLatestCredit(resCredit.data.latest_credit);
      } catch (err) {
        setError("Failed to load data.");
      }
    };

    fetchData();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle leave submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/leave/apply",
        form,
        { withCredentials: true }
      );

      if (res.data.success) {
        // Safe rendering: convert object messages to string
        const msg = typeof res.data.message === "string"
          ? res.data.message
          : JSON.stringify(res.data.message);

        setMessage(msg);
        setForm({ leave_type: "", start_date: "", end_date: "", reason: "" });

        // Refresh latest leave credit
        const resCredit = await axios.get("http://localhost:5000/api/leave/latest_credit", {
          withCredentials: true,
        });

        if (resCredit.data.success) setLatestCredit(resCredit.data.latest_credit);
      } else {
        const errMsg = typeof res.data.message === "string"
          ? res.data.message
          : JSON.stringify(res.data.message);

        setError(errMsg || "Failed to file leave.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error.");
    }
  };

  // Optional: Time IN / OUT
  const handleTimeInOut = async (type) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/employee/time_${type.toLowerCase()}`,
        {},
        { withCredentials: true }
      );

      if (!res.data.success) setError(res.data.message || `Failed to log Time ${type}`);
    } catch (err) {
      setError(err.response?.data?.message || "Error logging time.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Welcome Employee</h1>

      {/* Messages */}
      {error && <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>}
      {message && <div style={{ color: "green", marginBottom: "15px" }}>{message}</div>}

      {/* Latest leave credit */}
      {latestCredit !== null && (
        <div style={{ marginBottom: "15px", color: "blue" }}>
          Available Leave Credit: {latestCredit} days
        </div>
      )}

      {/* Time IN / OUT buttons */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <button style={{ marginRight: "10px" }} onClick={() => handleTimeInOut("IN")}>
          Time IN
        </button>
        <button onClick={() => handleTimeInOut("OUT")}>Time OUT</button>
      </div>

      {/* Navigation */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <a href="/application" style={{ marginRight: "10px" }}>Leave File</a>
        <a href="/dashboard" style={{ marginRight: "10px" }}>Dashboard</a>
        <a href="/recordfile" style={{ marginRight: "10px" }}>RecordFile</a>
        <a href="/">Logout</a>
      </div>

      {/* Leave form */}
      <h2 style={{ marginBottom: "20px" }}>Leave Application Form</h2>
      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginBottom: "10px" }}>
          Leave Type:
          <select
            name="leave_type"
            value={form.leave_type}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="">Select Leave Type</option>
            {leaveTypes.map(
              (type) =>
                type && type.name && (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                )
            )}
          </select>
        </label>

        <label style={{ display: "block", marginBottom: "10px" }}>
          Start Date:
          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          />
        </label>

        <label style={{ display: "block", marginBottom: "10px" }}>
          End Date:
          <input
            type="date"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          />
        </label>

        <label style={{ display: "block", marginBottom: "20px" }}>
          Reason:
          <input
            type="text"
            name="reason"
            value={form.reason}
            onChange={handleChange}
            placeholder="Enter your reason"
            style={{ width: "100%", padding: "8px" }}
          />
        </label>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default LeaveFile;
