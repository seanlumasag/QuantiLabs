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

    // Scroll to graph after data is loaded
    setTimeout(() => {
      const graphElement = document.getElementById("strategy-graph");
      if (graphElement) {
        graphElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100); // Small delay to ensure graph is rendered
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
    <div className="page-container page-container-with-nav">
      <div className="nav-header">
        <div className="nav-content">
          <h1 className="logo">QuantiLabs</h1>
          <div className="nav-actions">
            <button onClick={onLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: "var(--spacing-xl)" }}>
        <InputForm
          onSubmit={handleAddRunStrategy}
          loading={loading}
          error={error}
          onLogout={onLogout}
        />

        <GraphDisplay graphData={graphData} />

        {error && <div className="error">{error}</div>}

        {loading && <div className="loading">Loading strategies...</div>}

        <div className="strategies-grid">
          {strategies
            .slice()
            .reverse()
            .map((strategy) => (
              <StrategyCard
                key={strategy.id}
                strategy={strategy}
                onViewGraph={handleViewGraph}
                onDelete={handleDeleteStrategy}
              />
            ))}
        </div>

        {strategies.length === 0 && !loading && (
          <div className="text-center mt-5">
            <p className="text-muted">
              No strategies found. Create your first strategy above!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StrategiesPage;
