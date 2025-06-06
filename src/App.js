import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { Home } from "./pages/Home";
import { SubmitHealthData } from "./pages/SubmitHealthData";
import { ViewHealthData } from "./pages/ViewHealthData";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./App.css";

// ProtectedRoute component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/submit"
            element={
              <ProtectedRoute>
                <SubmitHealthData />
              </ProtectedRoute>
            }
          />
          <Route
            path="/view"
            element={
              <ProtectedRoute>
                <ViewHealthData />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}