import InputForm from "./components/InputForm";
import { useState, useEffect } from "react";

function App() {
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStrategies = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/strategy");
      if (!res.ok) throw new Error("Failed to fetch strategies");
      const data = await res.json();
      setStrategies(data);
    } catch (err) {
      console.error("Error fetching strategies:", err);
    }
  };

  const handleAddStrategy = async (strategy) => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(strategy),
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
  }, []);

  return (
    <div className="app">
      <InputForm onSubmit={handleAddStrategy} loading={loading} error={error}/>
    </div>
  );
}

export default App;
