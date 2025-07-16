import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

const data = [
  { name: 'Manual', value: 318, color: '#3B82F6' },
  { name: 'Automatic', value: 571, color: '#EF4444' },
  { name: 'Digital', value: 9111, color: '#F59E0B' },
];

const cardStyle: React.CSSProperties = {
  borderRadius: 22,
  padding: '28px 24px',
  background: 'linear-gradient(135deg, rgba(59,130,246,0.18) 0%, rgba(251,191,36,0.10) 100%)',
  boxShadow: '0 8px 32px 0 rgba(59,130,246,0.10)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  border: '1.5px solid rgba(59,130,246,0.10)',
  margin: 0,
  overflow: 'hidden',
};

const ReadingMethodsChart = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  return (
    <div style={cardStyle}>
      <h3 style={{ fontSize: 20, fontWeight: 700, color: '#2563eb', marginBottom: 18 }}>Data Collection Methods</h3>
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 14, height: 14, background: '#3B82F6', borderRadius: '50%' }}></div>
          <span style={{ fontSize: 15, color: '#64748b', fontWeight: 500 }}>Number of Users</span>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#2563eb' }}>9,111</span>
        </div>
      </div>
      <div style={{ height: 192 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="name" tick={{ fontSize: 14, fill: '#334155' }} />
            <YAxis tick={{ fontSize: 14, fill: '#334155' }} />
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