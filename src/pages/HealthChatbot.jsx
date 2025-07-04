import React, { useState } from "react";
export default function HealthChatbot() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3002";
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAnswer("");
    try {
      const response = await fetch(`${API_URL}/health-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (!response.ok) {
        throw new Error("API request failed.");
      }
      const data = await response.json();
      setAnswer(data.answer);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h2>:speech_balloon: Health Chatbot</h2>
      <p>
        Ask a health-related question (medications, diet, conditions). Responses are informational only.
      </p>
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <textarea
          rows="3"
          style={{ width: "100%", padding: "0.5rem" }}
          placeholder="Type your question here..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "0.5rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Asking..." : "Ask Question"}
        </button>
      </form>
      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }}>
          {error}
        </div>
      )}
      {answer && (
        <div
          style={{
            backgroundColor: "#F1F1F1",
            padding: "1rem",
            borderRadius: "4px",
          }}
        >
          <strong>AI Answer:</strong>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}