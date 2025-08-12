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

  return (
    <div className="strategy-card">
      {miniGraphData.length > 0 && (
        <div style={{ width: "100%", height: 100, marginTop: "10px" }}>
          <ResponsiveContainer>
            <LineChart data={miniGraphData}>
              <XAxis dataKey="date" hide={true} />
              <YAxis hide={true} domain={["auto", "auto"]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="capital"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      <h3>{strategy.name}</h3>
      <p>Strategy Type: {strategy.strategyType}</p>
      <p>Ticker Symbol: {strategy.tickerSymbol}</p>
      <p>Capital: {strategy.capital}</p>
      <p>Threshold Parameter: {strategy.thresholdParam}</p>
      <p>Start Date: {strategy.startDate}</p>
      <p>End Date: {strategy.endDate}</p>
      <p>Final Capital: {strategy.finalCapital.toFixed(2)} </p>
      <p>
        Profit/Loss: {(strategy.finalCapital - strategy.capital).toFixed(2)}{" "}
      </p>
      <p>
        Return Percentage:{" "}
        {(
          (strategy.finalCapital - strategy.capital) /
          strategy.capital * 100
        ).toFixed(2)}%
      </p>

      <div>
        <button onClick={() => handleViewGraph(strategy.id)}>View Graph</button>
        <button onClick={() => onDelete(strategy.id)}>Delete</button>
      </div>
    </div>
  );
}

export default StrategyCard;
