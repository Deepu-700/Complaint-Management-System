// components/PriorityChart.jsx
// Horizontal bar chart showing AI-assigned priority distribution

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const PRIORITY_COLORS = {
  High:   '#ef4444',
  Medium: '#f59e0b',
  Low:    '#10b981',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm shadow-xl">
        <p className="text-white font-semibold">{label} Priority</p>
        <p className="text-gray-300">{payload[0].value} complaints</p>
      </div>
    );
  }
  return null;
};

const PriorityChart = ({ data }) => {
  // data = { High: N, Medium: N, Low: N }
  const chartData = Object.entries(data || {}).map(([name, value]) => ({ name, value }));

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        layout="vertical"
        data={chartData}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fill: '#9ca3af', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fill: '#9ca3af', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={55}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
        <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={28}>
          {chartData.map((entry) => (
            <Cell
              key={entry.name}
              fill={PRIORITY_COLORS[entry.name] || '#6366f1'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PriorityChart;
