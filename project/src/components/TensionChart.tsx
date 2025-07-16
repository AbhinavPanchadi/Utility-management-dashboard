import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'TYPE A (120V)', value: 45, color: '#3B82F6' },
  { name: 'TYPE B (240V)', value: 15, color: '#EF4444' },
  { name: 'TYPE C (480V)', value: 8, color: '#F59E0B' },
  { name: 'TYPE D (600V)', value: 25, color: '#10B981' },
  { name: 'TYPE E (1000V)', value: 7, color: '#8B5CF6' },
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

const legendStyle: React.CSSProperties = {
  marginTop: 18,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const TensionChart = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  return (
    <div style={cardStyle}>
      <h3 style={{ fontSize: 20, fontWeight: 700, color: '#2563eb', marginBottom: 18 }}>Power Distribution</h3>
      <div style={{ height: 256 }}>
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
      <div style={legendStyle}>
        {data.map((item, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: item.color }}></div>
            <span style={{ color: '#334155' }}>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TensionChart;