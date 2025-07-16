import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  bgColor?: string; // Optional, fallback to default
  iconBg?: string; // Optional, fallback to default
}

// Array of high-contrast, vivid gradients
const gradients = [
  'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', // vivid green
  'linear-gradient(135deg, #396afc 0%, #2948ff 100%)', // blue
  'linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)', // pink-blue
  'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)', // orange-yellow
  'linear-gradient(135deg, #7f53ac 0%, #647dee 100%)', // purple-blue
  'linear-gradient(135deg, #ff5858 0%, #f09819 100%)', // red-orange
  'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)', // teal-blue
];

const cardStyle: React.CSSProperties = {
  borderRadius: 22,
  padding: '32px 28px',
  color: '#fff',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.22)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  border: '1.5px solid rgba(255,255,255,0.10)',
  transition: 'transform 0.25s cubic-bezier(.4,2,.6,1), box-shadow 0.25s cubic-bezier(.4,2,.6,1)',
  cursor: 'pointer',
  minWidth: 240,
  minHeight: 120,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  overflow: 'hidden',
};

const cardHoverStyle: React.CSSProperties = {
  transform: 'translateY(-8px) scale(1.045)',
  boxShadow: '0 16px 48px 0 rgba(31, 38, 135, 0.28)',
};

const iconContainerStyle = (iconBg?: string, scale = 1): React.CSSProperties => ({
  background: iconBg || 'rgba(255,255,255,0.18)',
  borderRadius: 16,
  padding: 18,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 54,
  minHeight: 54,
  boxShadow: '0 2px 8px rgba(34,193,195,0.10)',
  transition: 'transform 0.25s cubic-bezier(.4,2,.6,1)',
  transform: `scale(${scale})`,
});

function getGradient(title: string, bgColor?: string) {
  // If a valid bgColor is provided and not white/empty, use it
  if (bgColor && !/^#?fff?f?f?$/i.test(bgColor.trim()) && bgColor.trim() !== '') {
    return bgColor;
  }
  // Otherwise, pick a gradient based on the title hash
  const idx = Math.abs(
    Array.from(title).reduce((acc, c) => acc + c.charCodeAt(0), 0)
  ) % gradients.length;
  return gradients[idx];
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, bgColor, iconBg }) => {
  const [hover, setHover] = React.useState(false);
  const background = getGradient(title, bgColor);
  return (
    <div
      style={{
        ...cardStyle,
        background,
        ...(hover ? cardHoverStyle : {}),
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      tabIndex={0}
      aria-label={title + ' stat card'}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 16, opacity: 0.97, margin: 0, letterSpacing: 0.2, textShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>{title}</p>
          <p style={{ fontSize: 32, fontWeight: 800, margin: '10px 0 0 0', letterSpacing: 0.5, textShadow: '0 4px 16px rgba(0,0,0,0.22)' }}>{value}</p>
        </div>
        <div style={iconContainerStyle(iconBg, hover ? 1.18 : 1)}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;