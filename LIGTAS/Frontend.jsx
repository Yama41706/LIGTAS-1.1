import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  const handleLogin = (t, r) => {
    setToken(t);
    setRole(r);
    localStorage.setItem("token", t);
    localStorage.setItem("role", r);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? (role === "admin" ? <Navigate to="/admin" /> : <Navigate to="/user" />) : <Login onLogin={handleLogin} />} />
        <Route path="/admin" element={role === "admin" ? <AdminDashboard token={token} /> : <Navigate to="/" />} />
        <Route path="/user" element={role === "user" ? <UserDashboard token={token} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;