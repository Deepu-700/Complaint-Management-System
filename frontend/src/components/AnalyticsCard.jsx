// components/AnalyticsCard.jsx
// Reusable summary stat card with animated counter

import { useEffect, useState } from 'react';

const AnalyticsCard = ({ title, value, icon, color = 'brand', trend }) => {
  const [displayValue, setDisplayValue] = useState(0);

  // Animated counter effect
  useEffect(() => {
    if (!value || typeof value !== 'number') return;
    let start = 0;
    const duration = 800;
    const step = Math.ceil(value / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  // Color map for different card types
  const colorMap = {
    blue:   { bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   text: 'text-blue-400',   icon: 'bg-blue-500/20' },
    green:  { bg: 'bg-green-500/10',  border: 'border-green-500/20',  text: 'text-green-400',  icon: 'bg-green-500/20' },
    yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400', icon: 'bg-yellow-500/20' },
    red:    { bg: 'bg-red-500/10',    border: 'border-red-500/20',    text: 'text-red-400',    icon: 'bg-red-500/20' },
    brand:  { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400', icon: 'bg-indigo-500/20' },
  };

  const c = colorMap[color] || colorMap.brand;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border ${c.border} ${c.bg} p-5 
        transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20 cursor-default`}
    >
      {/* Background glow */}
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full ${c.icon} blur-2xl opacity-60`} />

      <div className="relative flex items-start justify-between">
        {/* Text */}
        <div>
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">{title}</p>
          <p className={`text-3xl font-bold ${c.text} font-mono`}>
            {typeof value === 'number' ? displayValue.toLocaleString() : value ?? '—'}
          </p>
          {trend && (
            <p className="text-gray-500 text-xs mt-1">{trend}</p>
          )}
        </div>

        {/* Icon */}
        <div className={`w-11 h-11 rounded-xl ${c.icon} flex items-center justify-center text-xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCard;
