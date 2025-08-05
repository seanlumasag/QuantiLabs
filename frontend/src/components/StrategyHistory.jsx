function StrategyHistory({ strategies }) {
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  return (
    <div className="strategy-history">
      <h2>Strategy History</h2>
      {strategies.length === 0 ? (
        <p>No strategies added yet.</p>
      ) : (
        <ul>
          {strategies.map((strategy, index) => (
            <li key={index}>
              {strategy.strategyType} - {strategy.tickerSymbol} - Capital:{" "}
              {strategy.capital} - Threshold: {strategy.thresholdParam}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export default StrategyHistory;
