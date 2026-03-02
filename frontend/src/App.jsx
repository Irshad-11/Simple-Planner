import React, { useEffect, useState } from "react";

function App() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/flask/system-status");

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const result = await response.json();
      console.log("System Status:", result);

      setStatus(result);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const renderIndicator = (condition) => {
    return condition === "working"
      ? "text-green-400"
      : "text-red-500";
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 flex items-center justify-center px-6">
      <div className="w-full max-w-3xl bg-gray-900 shadow-2xl rounded-2xl p-8 border border-gray-800">

        <h1 className="text-3xl text-center font-bold text-indigo-400 mb-8">
          System Dashboard
        </h1>

        {loading && (
          <p className="text-yellow-400 animate-pulse mb-4">
            Running system diagnostics...
          </p>
        )}

        {error && (
          <p className="text-red-500 mb-4">
            Error: {error}
          </p>
        )}

        {status && (
          <div className="space-y-4">

            <div className="flex justify-between bg-gray-800 p-4 rounded-lg">
              <span>React Server</span>
              <span className="text-green-400">working</span>
            </div>

            <div className="flex justify-between bg-gray-800 p-4 rounded-lg">
              <span>Flask Backend</span>
              <span className="text-green-400">{status.flask}</span>
            </div>

            <div className="flex justify-between bg-gray-800 p-4 rounded-lg">
              <span>PostgreSQL</span>
              <span className={renderIndicator(status.postgresql.status)}>
                {status.postgresql.status}
              </span>
            </div>

            <div className="flex justify-between bg-gray-800 p-4 rounded-lg">
              <span>Spring Boot Microservice</span>
              <span className={renderIndicator(status.spring_boot.status)}>
                {status.spring_boot.status}
              </span>
            </div>

            <div className="flex justify-between bg-gray-800 p-4 rounded-lg">
              <span>Overall System</span>
              <span className={
                status.overall === "healthy"
                  ? "text-green-400"
                  : "text-red-500"
              }>
                {status.overall}
              </span>
            </div>

          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={fetchStatus}
            className="bg-indigo-600 hover:bg-indigo-700 transition px-6 py-3 rounded-xl font-semibold"
          >
            Test Again
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;