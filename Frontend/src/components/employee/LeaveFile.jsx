import React, { useEffect, useState } from "react";
import axios from "axios";

const LeaveFile = () => {
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaveTypes = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/leave_types", {
                    withCredentials: true,
                });

                console.log("API Response:", res.data);

                if (res.data.success) {
                    setLeaveTypes(res.data.data);
                    setError(null);
                } else {
                    setError(res.data.message || "Unable to load leave types.");
                    setLeaveTypes([]);
                }
            } catch (err) {
                setError("Error fetching leave types.");
                setLeaveTypes([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaveTypes();
    }, []);

    if (loading) return <div>Loading leave types...</div>;

    return (
        <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px" }}>
            <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Welcome Employee</h1>

            <div style={{ marginBottom: "20px", textAlign: "center" }}>
                <button style={{ marginRight: "10px" }}>Time IN</button>
                <button>Time OUT</button>
            </div>

            <div style={{ marginBottom: "20px", textAlign: "center" }}>
                <a href="/application" style={{ marginRight: "10px" }}>Leave File</a>
                <a href="/dashboard" style={{ marginRight: "10px" }}>Dashboard</a>
                <a href="/recordfile" style={{ marginRight: "10px" }}>RecordFile</a>
                <a href="/">Logout</a>
            </div>

            {error && <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>}

            <h2 style={{ marginBottom: "20px" }}>Leave Application Form</h2>

            <form>
                <label style={{ display: "block", marginBottom: "10px" }}>
                    Leave Type:
                    <select name="leaveType" style={{ width: "100%", padding: "8px" }}>
                        <option value="">Select Leave Type</option>
                        {leaveTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label style={{ display: "block", marginBottom: "10px" }}>
                    Start Date:
                    <input type="date" name="startDate" style={{ width: "100%", padding: "8px" }} />
                </label>

                <label style={{ display: "block", marginBottom: "10px" }}>
                    End Date:
                    <input type="date" name="endDate" style={{ width: "100%", padding: "8px" }} />
                </label>

                <label style={{ display: "block", marginBottom: "20px" }}>
                    Reason:
                    <input
                        type="text"
                        name="reason"
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
