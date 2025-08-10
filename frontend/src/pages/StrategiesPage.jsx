import { useState, useEffect } from "react";
import InputForm from "../components/InputForm";

function StrategiesPage({ userId, onLogout }) {
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStrategies = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch strategies filtered by userId if your backend supports it
      const res = await fetch(
        `http://localhost:8080/api/strategy?userId=${userId}`
      );
      if (!res.ok) throw new Error("Failed to fetch strategies");
      const data = await res.json();
      setStrategies(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStrategy = async (strategy) => {
    setError(null);
    setLoading(true);
    try {
      // Add userId to the strategy payload
      const res = await fetch("http://localhost:8080/api/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...strategy, userId }),
      });
      if (!res.ok) throw new Error("Failed to add strategy");
      await fetchStrategies();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategies();
  }, [userId]);

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="strategies-page">
      <h1>Your Strategies</h1>
      <button onClick={handleLogout}>Logout</button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <InputForm onSubmit={handleAddStrategy} loading={loading} error={error} />
    </div>
  );
}

export default StrategiesPage;
