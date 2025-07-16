import React from 'react';

const activityData = [
  { activity: 'General Services', count: 335 },
  { activity: 'Tech Solutions', count: 32 },
  { activity: 'Construction', count: 14 },
  { activity: 'Manufacturing', count: 3 },
  { activity: 'Government', count: 33 },
];

const cardStyle: React.CSSProperties = {
  borderRadius: 22,
  padding: '28px 24px',
  background: 'linear-gradient(135deg, rgba(34,197,94,0.18) 0%, rgba(16,185,129,0.12) 100%)',
  boxShadow: '0 8px 32px 0 rgba(16,185,129,0.10)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  border: '1.5px solid rgba(16,185,129,0.10)',
  margin: 0,
  overflow: 'hidden',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: 0,
};

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '14px 16px',
  fontWeight: 700,
  color: '#059669',
  background: 'rgba(220,252,231,0.7)',
  fontSize: 16,
  borderBottom: '2px solid #d1fae5',
};

const tdStyle: React.CSSProperties = {
  padding: '13px 16px',
  color: '#1e293b',
  fontWeight: 500,
  fontSize: 15,
  background: 'rgba(255,255,255,0.85)',
  borderBottom: '1px solid #d1fae5',
};

const ActivityTable = () => {
  return (
    <div style={cardStyle}>
      <h3 style={{ fontSize: 20, fontWeight: 700, color: '#059669', marginBottom: 18 }}>Industry Overview</h3>
      <div style={{ overflowY: 'auto', maxHeight: 260 }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Industry Type</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Count</th>
            </tr>
          </thead>
          <tbody>
            {activityData.map((item, index) => (
              <tr key={index}>
                <td style={tdStyle}>{item.activity}</td>
                <td style={{ ...tdStyle, textAlign: 'right', color: '#059669', fontWeight: 700 }}>{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityTable;