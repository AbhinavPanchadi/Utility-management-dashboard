import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'North District', value: 65, color: '#10B981' },
  { name: 'South District', value: 8, color: '#F59E0B' },
  { name: 'East District', value: 6, color: '#3B82F6' },
  { name: 'West District', value: 4, color: '#EF4444' },
  { name: 'Central District', value: 3, color: '#8B5CF6' },
  { name: 'Metro Area', value: 5, color: '#06B6D4' },
  { name: 'Suburban Zone', value: 4, color: '#EAB308' },
  { name: 'Industrial Zone', value: 3, color: '#78716C' },
  { name: 'Commercial Zone', value: 2, color: '#EC4899' },
];

const RegionChart = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-teal-600 mb-4">🌍 Active Users by Region</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={80}
              paddingAngle={1}
              dataKey="value"
              onMouseEnter={(_, idx) => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke={activeIndex === index ? '#2563eb' : '#fff'}
                  strokeWidth={activeIndex === index ? 4 : 1}
                  cursor="pointer"
                />
              ))}
            </Pie>
            <Tooltip formatter={(value: any, name: any, props: any) => [`${value}`, `${props.payload.name}`]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2 text-xs">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-gray-600">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegionChart;