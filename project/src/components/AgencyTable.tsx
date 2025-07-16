import React from 'react';

const agencyData = [
  { agency: 'Branch Alpha', count: 169 },
  { agency: 'Branch Beta', count: 9 },
  { agency: 'Branch Gamma', count: 1 },
  { agency: 'Branch Delta', count: 8 },
  { agency: 'Branch Epsilon', count: 139 },
];

const cardStyle: React.CSSProperties = {
  borderRadius: 22,
  padding: '28px 24px',
  background: 'linear-gradient(135deg, rgba(59,130,246,0.18) 0%, rgba(99,102,241,0.12) 100%)',
  boxShadow: '0 8px 32px 0 rgba(59,130,246,0.10)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  border: '1.5px solid rgba(59,130,246,0.10)',
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
  color: '#2563eb',
  background: 'rgba(219,234,254,0.7)',
  fontSize: 16,
  borderBottom: '2px solid #e0e7ef',
};

const tdStyle: React.CSSProperties = {
  padding: '13px 16px',
  color: '#1e293b',
  fontWeight: 500,
  fontSize: 15,
  background: 'rgba(255,255,255,0.85)',
  borderBottom: '1px solid #e0e7ef',
};

const AgencyTable = () => {
  return (
    <div style={cardStyle}>
      <h3 style={{ fontSize: 20, fontWeight: 700, color: '#2563eb', marginBottom: 18 }}>👥 Branch Overview</h3>
      <div style={{ overflowY: 'auto', maxHeight: 260 }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Branch</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Count</th>
            </tr>
          </thead>
          <tbody>
            {agencyData.map((item, index) => (
              <tr key={index}>
                <td style={tdStyle}>{item.agency}</td>
                <td style={{ ...tdStyle, textAlign: 'right', color: '#2563eb', fontWeight: 700 }}>{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgencyTable;