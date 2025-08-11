import React from "react";
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
  // Optional: format dates or ensure data is sorted by date
  const formattedData = graphData
    .map(({ date, capital }) => ({
      date: new Date(date).toLocaleDateString(), // format date nicely for X axis
      capital: Number(capital.toFixed(2)), // round capital to 2 decimals
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // sort ascending by date

  if (!graphData || graphData.length === 0) {
    return <div>No graph data to display.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={["auto", "auto"]} />
        <Tooltip />
        <Line type="monotone" dataKey="capital" stroke="#8884d8" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default GraphDisplay;
