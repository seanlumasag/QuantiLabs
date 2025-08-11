import { useState, useEffect } from "react";
import InputForm from "../components/InputForm";
import StrategyCard from "../components/StrategyCard";

function StrategiesPage({ userId, onLogout }) {
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStrategies = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `http://localhost:8080/api/strategy/user/${userId}`
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

  const handleLogout = () => {
    onLogout();
  };

  const handleViewGraph = async (id) => {};
  const handleEditStrategy = async (id) => {};
  const handleDeleteStrategy = async (id) => {};

  useEffect(() => {
    fetchStrategies();
  }, [userId]);

  return (
    <div className="strategies-page">
      <InputForm
        onSubmit={handleAddStrategy}
        loading={loading}
        error={error}
        onLogout={handleLogout}
      />
      <div className="strategy-list">
        {strategies.map((strategy) => (
          <StrategyCard
            key={strategy.id}
            strategy={strategy}
            onViewGraph={handleViewGraph}
            onEdit={handleEditStrategy}
            onDelete={handleDeleteStrategy}
          />
        ))}
      </div>
    </div>
  );
}

export default StrategiesPage;
