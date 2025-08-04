import { useState, useEffect } from "react";
import InputForm from "./components/InputForm";

function App() {
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStrategies();
  }, []);

  const fetchStrategies = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/strategy");
      if (!res.ok) throw new Error("Failed to fetch strategies");
      const data = await res.json();
      setStrategies(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Strategies</h1>
      <InputForm onSubmit={fetchStrategies} loading={loading} />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && (
        <ul>
          {strategies.length === 0 ? (
            <li>No strategies found.</li>
          ) : (
            strategies.map((s) => (
              <li key={s.id}>
                <strong>{s.strategyType}</strong> - {s.tickerSymbol} ($
                {s.capital}) [Threshold: {s.thresholdParam}]
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default App;
