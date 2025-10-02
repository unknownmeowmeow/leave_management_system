import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Register() {
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm_password, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [role, setRole] = useState("");
    const [gender, setGender] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await axios.post("http://localhost:5000/api/auth/register", {
                first_name,
                last_name,
                email,
                password,
                confirm_password,
                gender,
                role,
            });

            if (response.data.success) {
                setSuccess(response.data.message);
                setError("");
            }
            else {
                if (response.data.errors) {

                    setError(response.data.errors);
                }
                else if (response.data.message) {
                    setError(response.data.message);
                }
                else {
                    setError("An unknown error occurred.");
                }
            }
        }
        catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            }
            else {
                setError("Server Error in the Registration Frontend");
            }
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light" style={{ padding: "15px" }}>
            <div className="card shadow-sm p-4" style={{ maxWidth: "500px", width: "100%" }}>
                <h2 className="text-center mb-4">Register</h2>

                {error && <div className="alert alert-danger text-center">{error}</div>}
                {success && <div className="alert alert-success text-center">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        <div className="col">
                            <label className="form-label">First Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={first_name}
                                onChange={(e) => setFirstName(e.target.value)}

                            />
                        </div>
                        <div className="col">
                            <label className="form-label">Last Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={last_name}
                                onChange={(e) => setLastName(e.target.value)}

                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="text"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}

                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Gender</label>
                        <select
                            className="form-select"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}

                        >
                            <option value="">Select Gender</option>
                            <option value="1">Male</option>
                            <option value="2">Female</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Role</label>
                        <select
                            className="form-select"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}

                        >
                            <option value="">Select role</option>
                            <option value="1">Admin</option>
                            <option value="2">Intern</option>
                            <option value="3">Employee</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={8}

                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Confirm Password</label>
                        <div className="input-group">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="form-control"
                                value={confirm_password}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                minLength={8}

                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                tabIndex={-1}
                            >
                                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
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
