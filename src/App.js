import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Home } from "./pages/Home";
import { SubmitHealthData } from "./pages/SubmitHealthData";
import { ViewHealthData } from "./pages/ViewHealthData";
import "./App.css";


const MedicalLogo = () => (
  <svg
    className="app-logo"
    xmlns="http://www.w3.org/2000/svg"
    width="36"
    height="36"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#2563eb"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ verticalAlign: "middle", marginRight: "0.5rem" }}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v8M8 12h8" />
  </svg>
);


export default function App() {
  return (
     <Router>
      <div className="app-container">
        <MedicalLogo/>
        <h1 className="app-title">Health Monitoring System</h1>
        <nav className="app-nav">
          <Link to="/" className="app-link">Home</Link>
          <Link to="/submit" className="app-link">Submit Data</Link>
          <Link to="/view" className="app-link">View Data</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/submit" element={<SubmitHealthData />} />
          <Route path="/view" element={<ViewHealthData />} />
        </Routes>
      </div>
    </Router>
  );
}