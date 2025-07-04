import React, { useState } from "react";
import axios from "axios";
import "./Home.css";

export default function Home() {
  const [response, setResponse] = useState("");

  const handleClick = async (type) => {
    const promptInput = prompt(`Enter your ${type} input:`);
    if (!promptInput) return;

    const endpointMap = {
      "symptom": "/api/symptom-checker",
      "chatbot": "/api/health-chatbot",
      "summary": "/api/note-summarizer",
      "history": "/api/medical-history-ai"
    };

    try {
      const res = await axios.post(endpointMap[type], { prompt: promptInput });
      setResponse(res.data.result);
    } catch (err) {
      setResponse("Error: " + err.message);
    }
  };

  return (
    <div className="home-container">
      <h2>Welcome to One Doctor App</h2>
      <p>Your AI-powered health assistant</p>
      <div className="search-buttons">
        <button onClick={() => handleClick("symptom")}>🩺 Symptom Checker</button>
        <button onClick={() => handleClick("chatbot")}>💬 Health Chatbot</button>
        <button onClick={() => handleClick("summary")}>📝 Note Summarizer</button>
        <button onClick={() => handleClick("history")}>📖 AI Medical History</button>
      </div>
      {response && (
        <div className="response-box">
          <strong>AI Response:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}