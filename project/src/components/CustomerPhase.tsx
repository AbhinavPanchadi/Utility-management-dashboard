import React from 'react';

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

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 18,
};

const boxStyle: React.CSSProperties = {
  textAlign: 'center',
};

const percentBoxStyle: React.CSSProperties = {
  background: 'rgba(253,230,138,0.7)',
  borderRadius: 14,
  padding: '18px 0',
  marginBottom: 8,
};

const percentTextStyle: React.CSSProperties = {
  fontSize: 26,
  fontWeight: 700,
  color: '#b45309',
};

const labelStyle: React.CSSProperties = {
  fontSize: 15,
  color: '#92400e',
  opacity: 0.85,
};

const CustomerPhase = () => {
  return (
    <div style={cardStyle}>
      <h3 style={{ fontSize: 20, fontWeight: 700, color: '#f59e42', marginBottom: 18 }}>⚡ Users by Connection Type</h3>
      <div style={gridStyle}>
        <div style={boxStyle}>
          <div style={percentBoxStyle}>
            <div style={percentTextStyle}>82.82%</div>
          </div>
          <div style={labelStyle}>Single-Line:</div>
        </div>
        <div style={boxStyle}>
          <div style={percentBoxStyle}>
            <div style={percentTextStyle}>17.18%</div>
          </div>
          <div style={labelStyle}>Multi-Line:</div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPhase;