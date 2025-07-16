import React from 'react';

const segments = [
  { name: 'Standard', percentage: 61.47, color: '#fb923c' },
  { name: 'Professional', percentage: 9.86, color: '#f59e42' },
  { name: 'Personal', percentage: 12.78, color: '#f59e42' },
  { name: 'Personal Plus', percentage: 2.56, color: '#d1d5db' },
  { name: 'Enterprise', percentage: 7.13, color: '#f59e42' },
  { name: 'Premium', percentage: 6.2, color: '#f59e42' },
];

const cardStyle: React.CSSProperties = {
  borderRadius: 22,
  padding: '28px 24px',
  background: 'linear-gradient(135deg, rgba(251,191,36,0.18) 0%, rgba(253,186,116,0.12) 100%)',
  boxShadow: '0 8px 32px 0 rgba(251,191,36,0.10)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  border: '1.5px solid rgba(251,191,36,0.10)',
  margin: 0,
  overflow: 'hidden',
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 12,
};

const leftStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
};

const dotStyle = (color: string): React.CSSProperties => ({
  width: 14,
  height: 14,
  borderRadius: '50%',
  background: color,
});

const nameStyle: React.CSSProperties = {
  fontSize: 15,
  color: '#92400e',
  opacity: 0.88,
};

const percentStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 600,
  color: '#b45309',
};

const CustomerSegments = () => {
  return (
    <div style={cardStyle}>
      <h3 style={{ fontSize: 20, fontWeight: 700, color: '#f59e42', marginBottom: 18 }}>🧷 User Segments</h3>
      <div>
        {segments.map((segment, index) => (
          <div key={index} style={rowStyle}>
            <div style={leftStyle}>
              <div style={dotStyle(segment.color)}></div>
              <span style={nameStyle}>{segment.name}</span>
            </div>
            <span style={percentStyle}>({segment.percentage}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerSegments;