import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function GraphDisplay({ graphData }) {
  if (!graphData || graphData.length === 0) {
    return null; // Don't show anything if no data
  }

  // Optional: format dates or ensure data is sorted by date
  const formattedData = graphData
    .map(({ date, capital }) => ({
      date: new Date(date).toLocaleDateString(), // format date nicely for X axis
      capital: Number(capital.toFixed(2)), // round capital to 2 decimals
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // sort ascending by date

  // Calculate performance metrics
  const initialCapital = formattedData[0]?.capital || 0;
  const finalCapital = formattedData[formattedData.length - 1]?.capital || 0;
  const totalReturn = finalCapital - initialCapital;
  const returnPercentage =
    initialCapital > 0 ? (totalReturn / initialCapital) * 100 : 0;
  const isProfit = totalReturn >= 0;

  return (
    <div id="strategy-graph" className="graph-container">
      <div className="graph-header">
        <h3 className="graph-title">Strategy Performance</h3>
        <div className="flex gap-4 text-sm">
          <div>
            <span className="text-secondary">Total Return: </span>
            <span
              className={`font-medium font-mono ${
                isProfit ? "text-success" : "text-danger"
              }`}
            >
              {isProfit ? "+" : ""}${totalReturn.toFixed(2)} (
              {isProfit ? "+" : ""}
              {returnPercentage.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={formattedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "var(--text-secondary)" }}
            axisLine={{ stroke: "var(--border-medium)" }}
          />
          <YAxis
            domain={["auto", "auto"]}
            tick={{ fontSize: 12, fill: "var(--text-secondary)" }}
            axisLine={{ stroke: "var(--border-medium)" }}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-light)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-lg)",
            }}
            labelFormatter={(value) => `Date: ${value}`}
            formatter={(value) => [`$${value.toFixed(2)}`, "Capital"]}
          />
          <Line
            type="monotone"
            dataKey="capital"
            stroke={isProfit ? "var(--success-color)" : "var(--danger-color)"}
            strokeWidth={3}
            dot={false}
            activeDot={{
              r: 6,
              fill: isProfit ? "var(--success-color)" : "var(--danger-color)",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GraphDisplay;
