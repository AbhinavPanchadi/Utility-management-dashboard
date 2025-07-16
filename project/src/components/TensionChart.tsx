import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'TYPE A (120V)', value: 45, color: '#3B82F6' },
  { name: 'TYPE B (240V)', value: 15, color: '#EF4444' },
  { name: 'TYPE C (480V)', value: 8, color: '#F59E0B' },
  { name: 'TYPE D (600V)', value: 25, color: '#10B981' },
  { name: 'TYPE E (1000V)', value: 7, color: '#8B5CF6' },
];

const TensionChart = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-blue-600 mb-4">Power Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={80}
              paddingAngle={2}
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
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-gray-600">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TensionChart;