import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function StrategyCard({ strategy, onDelete, onEdit, onViewGraph }) {
  const [showGraph, setShowGraph] = useState(false);
  const [miniGraphData, setMiniGraphData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleViewGraph = () => {
    setShowGraph(!showGraph);
    if (!showGraph) {
      onViewGraph(strategy.id);
    }
  };

  const handleGenerateMiniGraph = async (strategyId) => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/strategy/run/${strategyId}`
      );
      if (!res.ok) throw new Error("Failed to run strategy");
      const dailyResults = await res.json();
      setMiniGraphData(dailyResults);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGenerateMiniGraph(strategy.id);
  }, [strategy.id]);

  const profitLoss = strategy.finalCapital - strategy.capital;
  const returnPercentage = (profitLoss / strategy.capital) * 100;
  const isProfit = profitLoss >= 0;

  return (
    <div className="strategy-card">
      <div className="card-header">
        <h3 className="strategy-title">
          {strategy.name || `${strategy.strategyType} Strategy`}
        </h3>
        <div className="strategy-meta">
          <span className="text-secondary">{strategy.tickerSymbol}</span>
          <span className="text-secondary">
            {strategy.startDate} to {strategy.endDate}
          </span>
        </div>
      </div>

      {miniGraphData.length > 0 && (
        <div className="mb-3" style={{ width: "100%", height: 120 }}>
          <ResponsiveContainer>
            <LineChart data={miniGraphData}>
              <XAxis dataKey="date" hide={true} />
              <YAxis hide={true} domain={["auto", "auto"]} />
              <Tooltip
                labelFormatter={(value) => `Date: ${value}`}
                formatter={(value) => [`$${value.toFixed(2)}`, "Capital"]}
              />
              <Line
                type="monotone"
                dataKey="capital"
                stroke={
                  isProfit ? "var(--success-color)" : "var(--danger-color)"
                }
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="strategy-info">
        <div className="grid grid-2 mb-3">
          <div>
            <span className="text-secondary text-sm">Strategy Type:</span>
            <p className="font-medium">{strategy.strategyType}</p>
          </div>
          <div>
            <span className="text-secondary text-sm">Threshold:</span>
            <p className="font-medium">{strategy.thresholdParam}</p>
          </div>
        </div>

        <div className="grid grid-2 mb-3">
          <div>
            <span className="text-secondary text-sm">Initial Capital:</span>
            <p className="font-medium font-mono">
              ${strategy.capital.toFixed(2)}
            </p>
          </div>
          <div>
            <span className="text-secondary text-sm">Final Capital:</span>
            <p className="font-medium font-mono">
              ${strategy.finalCapital.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid grid-2 mb-3">
          <div>
            <span className="text-secondary text-sm">Profit/Loss:</span>
            <p
              className={`font-medium font-mono ${
                isProfit ? "text-success" : "text-danger"
              }`}
            >
              {isProfit ? "+" : ""}${profitLoss.toFixed(2)}
            </p>
          </div>
          <div>
            <span className="text-secondary text-sm">Return:</span>
            <p
              className={`font-medium font-mono ${
                isProfit ? "text-success" : "text-danger"
              }`}
            >
              {isProfit ? "+" : ""}
              {returnPercentage.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      {error && <div className="error mb-3">{error}</div>}

      {loading && <div className="loading mb-3">Loading graph data...</div>}

      <div className="strategy-actions">
        <button
          onClick={() => handleViewGraph(strategy.id)}
          className="btn btn-primary btn-sm"
        >
          View Graph
        </button>
        <button
          onClick={() => onDelete(strategy.id)}
          className="btn btn-danger btn-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default StrategyCard;
