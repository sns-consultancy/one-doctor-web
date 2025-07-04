import React, { useState } from "react";
export default function SymptomChecker() {
  const [symptom, setSymptom] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleCheck = async () => {
    setLoading(true);
    setError("");
    setResult("");
    try {
      const response = await fetch("http://localhost:5000/check-symptom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptom }),
      });
      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Server error: ${err}`);
      }
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        // If your backend returns { possible_causes: "..." }
        setResult(data.possible_causes || "No details available.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ padding: 20 }}>
      <h2>Symptom Checker</h2>
      <input
        value={symptom}
        onChange={(e) => setSymptom(e.target.value)}
        placeholder="Enter symptoms"
      />
      <button onClick={handleCheck} disabled={loading}>
        {loading ? "Checking..." : "Check"}
      </button>
      {error && (
        <p style={{ color: "red" }}>
          <strong>Error:</strong> {error}
        </p>
      )}
      <p style={{ whiteSpace:"pre-line" }}>{result}</p>
    </div>
  );
}
