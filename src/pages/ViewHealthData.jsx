import React, { useState } from "react";
// Use environment variable for API key
const API_KEY = process.env.REACT_APP_API_KEY;

export function ViewHealthData() {
  const [userId, setUserId] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setError("");
    try {
      const response = await fetch(`http://localhost:5000/api/health/${userId}`, {
        headers: { "x-api-key": API_KEY }
      });
      const result = await response.json();
      if (response.ok) setData(result.data);
      else setError(result.message);
    } catch (err) {
      setError("Failed to fetch data");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">View Health Data</h2>
      <input
        placeholder="Enter User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="border p-1 mr-2"
      />
      <button onClick={fetchData} className="bg-blue-500 text-white px-3 py-1 rounded">
        Fetch
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {data && (
        <table className="mt-4 bg-gray-100 rounded w-full text-left">
          <tbody>
            {Object.entries(data).map(([key, value]) => (
              <tr key={key}>
                <th className="py-1 px-2 font-medium capitalize">{key.replace(/_/g, " ")}</th>
                <td className="py-1 px-2">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}