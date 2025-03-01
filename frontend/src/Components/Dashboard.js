import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get the JWT token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      // If no token is found, redirect to login page
      navigate("/login");
    } else {
      try {
        // Decode the JWT token (or send it to the backend to verify)
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT token to extract user info
        setUser(decodedToken); // Set the user data from the decoded token
      } catch (error) {
        setError("Invalid token or session expired.");
        navigate("/login"); // Redirect to login if token is invalid
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    navigate("/login"); // Redirect to login page
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center px-4 py-2" style={{ backgroundColor: "#222", color: "white" }}>
        <h2 className="m-0">Farmer Dashboard</h2>
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </div>

      <div className="container mt-4">
        <h2 className="text-center">Welcome, {user?.name || "Farmer"}!</h2>
        <p className="text-center">Here is your farm pond's water monitoring data:</p>

        <div className="d-flex justify-content-center gap-3">
          <div className="card p-3 text-center shadow" style={{ width: "200px" }}>
            <h4>Water Level</h4>
            <p>-- feet</p>
          </div>
          <div className="card p-3 text-center shadow" style={{ width: "200px" }}>
            <h4>Water pH</h4>
            <p>--</p>
          </div>
          <div className="card p-3 text-center shadow" style={{ width: "200px" }}>
            <h4>Contamination Level</h4>
            <p>--</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
