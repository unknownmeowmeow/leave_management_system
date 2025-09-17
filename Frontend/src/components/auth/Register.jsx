import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Register() {
    const [first_name, set_first_name] = useState("");
    const [last_name, set_last_name] = useState("");
    const [email, set_email] = useState("");
    const [password, set_password] = useState("");
    const [confirm_password, set_confirm_password] = useState("");
    const [role_id, set_role_id] = useState("");
    const [roles, set_roles] = useState([]);
    const [gender, set_gender] = useState("");
    const [address, set_address] = useState("");
    const [error, set_error] = useState("");
    const [success, set_success] = useState("");
    const [show_password, set_show_password] = useState(false);
    const [show_confirm_password, set_show_confirm_password] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetch_roles = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/roles");

                set_roles(response.data.roles || []);
            } 
            catch (err) {
                console.error("Failed to fetch roles:", err);
            }
        };
        fetch_roles();
    }, []);

    const handle_submit = async (e) => {
        e.preventDefault();
        set_error("");
        set_success("");

        try {
            const response = await axios.post("http://localhost:5000/api/auth/register", {
                first_name,
                last_name,
                email,
                password,
                confirm_password,
                gender,
                address,
                role_id: parseInt(role_id) || null,
                status_id: 1
            });

            if (response.data.success) {
                set_success(response.data.message || "Registration successful.");

            } 
            else {
                set_error(response.data.message || "Registration failed.");
            }
        } catch (err) {
            set_error(err.response?.data?.message || "Server error Register. Please try again.");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light" style={{ padding: "15px" }}>
            <div className="card shadow-sm p-4" style={{ maxWidth: "500px", width: "100%" }}>
                <h2 className="text-center mb-4">Register</h2>

                {error && <div className="alert alert-danger text-center">{error}</div>}
                {success && <div className="alert alert-success text-center">{success}</div>}

                <form onSubmit={handle_submit}>
                    <div className="row mb-3">
                        <div className="col">
                            <label className="form-label">First Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={first_name}
                                onChange={(e) => set_first_name(e.target.value)}
                            />
                        </div>
                        <div className="col">
                            <label className="form-label">Last Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={last_name}
                                onChange={(e) => set_last_name(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => set_email(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Role</label>
                        <select
                            className="form-select"
                            value={role_id}
                            onChange={(e) => set_role_id(e.target.value)}
                        >
                            <option value="">Select Role</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Gender</label>
                        <div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="gender"
                                    value="male"
                                    checked={gender === "male"}
                                    onChange={(e) => set_gender(e.target.value)}
                                />
                                <label className="form-check-label">Male</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    checked={gender === "female"}
                                    onChange={(e) => set_gender(e.target.value)}
                                />
                                <label className="form-check-label">Female</label>
                            </div>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Address</label>
                        <input
                            type="text"
                            className="form-control"
                            value={address}
                            onChange={(e) => set_address(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <div className="input-group">
                            <input
                                type={show_password ? "text" : "password"}
                                className="form-control"
                                value={password}
                                onChange={(e) => set_password(e.target.value)}
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => set_show_password(!show_password)}
                            >
                                <FontAwesomeIcon icon={show_password ? faEyeSlash : faEye} />
                            </button>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Confirm Password</label>
                        <div className="input-group">
                            <input
                                type={show_confirm_password ? "text" : "password"}
                                className="form-control"
                                value={confirm_password}
                                onChange={(e) => set_confirm_password(e.target.value)}
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => set_show_confirm_password(!show_confirm_password)}
                            >
                                <FontAwesomeIcon icon={show_confirm_password ? faEyeSlash : faEye} />
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        Register
                    </button>
                </form>

                <p className="text-center mt-3 mb-0">
                    Already have an account? <Link to="/">Login</Link>
                </p>
            </div>
        </div>
    );
}
