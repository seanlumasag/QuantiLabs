import { useState, useEffect } from "react";
import InputForm from "../components/InputForm";
import StrategyCard from "../components/StrategyCard";
import GraphDisplay from "../components/GraphDisplay";

function StrategiesPage({ userId, onLogout }) {
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [graphData, setGraphData] = useState([]);
  useEffect(() => {
    if (graphData.length > 0) {
      localStorage.setItem("graphData", JSON.stringify(graphData));
    }
  }, [graphData]);

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
      const createdStrategy = await res.json();
      return createdStrategy; // return here
    } catch (err) {
      setError(err.message);
      throw err; // re-throw so handleAddRunStrategy can catch it if needed
    } finally {
      setLoading(false);
    }
  };

  const handleRunStrategy = async (strategyId) => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/strategy/run/${strategyId}`
      );
      if (!res.ok) throw new Error("Failed to run strategy");
      const dailyResults = await res.json();
      setGraphData(dailyResults);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRunStrategy = async (strategy) => {
    try {
      const createdStrategy = await handleAddStrategy(strategy);
      await handleRunStrategy(createdStrategy.id);
      fetchStrategies();
    } catch (err) {}
  };

  const handleViewGraph = async (strategyId) => {
    await handleRunStrategy(strategyId);
  };

  const handleDeleteStrategy = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/strategy/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting strategy:", error);
    }
    fetchStrategies();
  };

  useEffect(() => {
    fetchStrategies();
  }, [userId]);

  return (
    <div className="strategies-page">
      <InputForm
        onSubmit={handleAddRunStrategy}
        loading={loading}
        error={error}
      />
      <GraphDisplay graphData={graphData} />
      <div className="strategy-list">
        {strategies.map((strategy) => (
          <StrategyCard
            key={strategy.id}
            strategy={strategy}
            onViewGraph={handleViewGraph}
            onDelete={handleDeleteStrategy}
          />
        ))}
      </div>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default StrategiesPage;
