import React, { useState } from "react";

function HealthSyncDashboard() {
  const [appleData, setAppleData] = useState(null);
  const [fitbitData, setFitbitData] = useState(null);
  const [googleData, setGoogleData] = useState(null);

  const syncData = async (source) => {
    const endpointMap = {
      apple: "/applehealth/data",
      fitbit: "/fitbit/heartrate",
      google: "/googlefit/steps",
    };

    try {
      const res = await fetch(endpointMap[source]);
      const data = await res.json();
      if (source === "apple") setAppleData(data);
      if (source === "fitbit") setFitbitData(data);
      if (source === "google") setGoogleData(data);
    } catch (error) {
      console.error("Error syncing", source, error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">🩺 One Doctor Health Sync</h1>

      <div className="space-x-4">
        <button onClick={() => syncData("apple")} className="px-4 py-2 bg-blue-500 text-white rounded">Sync Apple Health</button>
        <button onClick={() => syncData("fitbit")} className="px-4 py-2 bg-green-500 text-white rounded">Sync Fitbit</button>
        <button onClick={() => syncData("google")} className="px-4 py-2 bg-yellow-500 text-black rounded">Sync Google Fit</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {appleData && <pre className="bg-gray-100 p-3 rounded">Apple: {JSON.stringify(appleData, null, 2)}</pre>}
        {fitbitData && <pre className="bg-gray-100 p-3 rounded">Fitbit: {JSON.stringify(fitbitData, null, 2)}</pre>}
        {googleData && <pre className="bg-gray-100 p-3 rounded">Google Fit: {JSON.stringify(googleData, null, 2)}</pre>}
      </div>
    </div>
  );
}

export default HealthSyncDashboard;