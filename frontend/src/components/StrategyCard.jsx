import { useState } from "react";

function StrategyCard({ strategy, onDelete, onEdit, onViewGraph }) {
  const [showGraph, setShowGraph] = useState(false);

  const handleViewGraph = () => {
    setShowGraph(!showGraph);
    if (!showGraph) {
      onViewGraph(strategy.id);
    }
  };

  return (
    <div className="strategy-card">
      <h3>{strategy.name}</h3>
      <p>Type: {strategy.strategyType}</p>
      <p>Ticker Symbol: {strategy.tickerSymbol}</p>
      <p>Capital: {strategy.capital}</p>
      <p>Threshold Parameter: {strategy.thresholdParam}</p>
      <p>Start Date: {strategy.startDate}</p>
      <p>End Date: {strategy.endDate}</p>
      <p>Final Capital: {strategy.finalCapital} </p>
      <p>Profit/Loss: {strategy.profitLoss} </p>
      <p>Return Percentage: {strategy.returnPercentage}</p>
      <div>
        <button onClick={() => handleViewGraph}>View Graph</button>
        <button onClick={() => onEdit(strategy)}>Edit</button>
        <button onClick={() => onDelete(strategy.id)}>Delete</button>
      </div>
    </div>
  );
}

export default StrategyCard;
