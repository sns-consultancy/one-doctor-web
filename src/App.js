import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Home } from "./pages/Home";
import { SubmitHealthData } from "./pages/SubmitHealthData";
import { ViewHealthData } from "./pages/ViewHealthData";

export default function App() {
  return (
    <Router>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Health Monitoring System</h1>
        <nav className="mb-4 space-x-4">
          <Link to="/" className="text-blue-500 hover:underline">Home</Link>
          <Link to="/submit" className="text-blue-500 hover:underline">Submit Data</Link>
          <Link to="/view" className="text-blue-500 hover:underline">View Data</Link>
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
