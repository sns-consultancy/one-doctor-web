import React, { useState } from "react";
// Use environment variable for API key
const API_KEY = process.env.REACT_APP_API_KEY;

export function SubmitHealthData() {
  const [form, setForm] = useState({
    user_id: "",
    heartbeat: "",
    temperature: "",
    blood_pressure: "",
    oxygen_level: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add last_updated only in the background
    const dataToSend = {
      ...form,
      last_updated: new Date().toISOString(),
    };
    const response = await fetch("http://localhost:5000/api/health", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify(dataToSend),
    });
    const result = await response.json();
    setMessage(result.message);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Submit Health Data</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        {Object.keys(form).map((field) => (
          <div key={field}>
            <input
              name={field}
              placeholder={field}
              value={form[field]}
              onChange={handleChange}
              className="border p-1 w-full"
            />
          </div>
        ))}
        <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
          Submit
        </button>
      </form>
      {message && <p className="mt-2 text-green-600">{message}</p>}
    </div>
  );
}