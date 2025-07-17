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
  'from-emerald-500 to-green-400', // vivid green
  'from-blue-500 to-blue-600', // blue
  'from-pink-500 to-purple-500', // pink-blue
  'from-orange-400 to-yellow-400', // orange-yellow
  'from-purple-500 to-blue-500', // purple-blue
  'from-red-500 to-orange-500', // red-orange
  'from-teal-400 to-blue-600', // teal-blue
];

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
  
  // If bgColor is a custom CSS gradient, use it directly
  const isCustomGradient = bgColor && bgColor.includes('linear-gradient');
  
  return (
    <div
      className={`
        rounded-2xl p-4 sm:p-5 md:p-6 text-white shadow-lg backdrop-blur-sm border border-white/10
        transition-all duration-300 cursor-pointer min-h-[100px] sm:min-h-[120px] md:min-h-[140px] 
        flex flex-col justify-between w-full relative overflow-hidden
        hover:scale-105 hover:-translate-y-1 hover:shadow-xl
        ${isCustomGradient ? '' : `bg-gradient-to-br ${background}`}
      `}
      style={isCustomGradient ? { background: bgColor } : {}}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      tabIndex={0}
      aria-label={title + ' stat card'}
    >
      {/* Icon positioned absolutely in top-right */}
      <div 
        className={`
          absolute top-3 right-3 sm:top-4 sm:right-4 md:top-5 md:right-5
          bg-white/20 rounded-lg p-2 sm:p-2.5 md:p-3 flex items-center justify-center 
          w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10
          shadow-lg transition-transform duration-300
          ${hover ? 'scale-110' : 'scale-100'}
        `}
        style={iconBg ? { background: iconBg } : {}}
      >
        <div className="text-white text-sm sm:text-base md:text-lg">
          {icon}
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 flex flex-col justify-center pr-12 sm:pr-14 md:pr-16">
        <p className="text-xs sm:text-sm md:text-base opacity-90 tracking-wide text-shadow-sm font-medium mb-1 sm:mb-2">
          {title}
        </p>
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-wide text-shadow-md leading-tight">
          {value}
        </p>
      </div>
    </div>
  );
};

export default StatCard;