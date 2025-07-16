import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

const data = [
  { name: 'Manual', value: 318, color: '#3B82F6' },
  { name: 'Automatic', value: 571, color: '#EF4444' },
  { name: 'Digital', value: 9111, color: '#F59E0B' },
];

const ReadingMethodsChart = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Collection Methods</h3>
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-600">Number of Users</span>
          <span className="text-lg font-semibold text-gray-800">9,111</span>
        </div>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip cursor={{ fill: '#f3f4f6' }} />
            <Bar
              dataKey="value"
              onMouseOver={(_, idx) => setActiveIndex(idx)}
              onMouseOut={() => setActiveIndex(null)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={activeIndex === index ? '#2563eb' : entry.color}
                  cursor="pointer"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReadingMethodsChart;