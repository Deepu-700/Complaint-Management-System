// components/ComplaintPieChart.jsx
// Pie chart showing complaint status distribution

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = {
  Pending:     '#f59e0b',
  'In Progress': '#3b82f6',
  Resolved:    '#10b981',
  Rejected:    '#ef4444',
};

// Custom tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm shadow-xl">
        <p className="text-white font-semibold">{name}</p>
        <p className="text-gray-300">{value} complaints</p>
      </div>
    );
  }
  return null;
};

// Custom legend
const renderLegend = (props) => {
  const { payload } = props;
  return (
    <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
      {payload.map((entry) => (
        <li key={entry.value} className="flex items-center gap-1.5 text-xs text-gray-400">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          {entry.value}
        </li>
      ))}
    </ul>
  );
};

const ComplaintPieChart = ({ data }) => {
  // data = { Pending: N, 'In Progress': N, Resolved: N, Rejected: N }
  const chartData = Object.entries(data || {})
    .map(([name, value]) => ({ name, value }))
    .filter((d) => d.value > 0);

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="45%"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
        >
          {chartData.map((entry) => (
            <Cell
              key={entry.name}
              fill={COLORS[entry.name] || '#6366f1'}
              stroke="transparent"
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={renderLegend} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ComplaintPieChart;
