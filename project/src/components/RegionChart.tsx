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

const cardStyle: React.CSSProperties = {
  borderRadius: 22,
  padding: '28px 24px',
  background: 'linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(59,130,246,0.10) 100%)',
  boxShadow: '0 8px 32px 0 rgba(16,185,129,0.10)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  border: '1.5px solid rgba(16,185,129,0.10)',
  margin: 0,
  overflow: 'hidden',
};

const legendStyle: React.CSSProperties = {
  marginTop: 18,
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: 8,
};

const RegionChart = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  return (
    <div style={cardStyle}>
      <h3 style={{ fontSize: 20, fontWeight: 700, color: '#14b8a6', marginBottom: 18 }}>🌍 Active Users by Region</h3>
      <div style={{ height: 256 }}>
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
      <div style={legendStyle}>
        {data.map((item, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color }}></div>
            <span style={{ color: '#334155' }}>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegionChart;