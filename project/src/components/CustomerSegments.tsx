import React from 'react';

const segments = [
  { name: 'Standard', percentage: 61.47, color: 'bg-orange-500' },
  { name: 'Professional', percentage: 9.86, color: 'bg-orange-600' },
  { name: 'Personal', percentage: 12.78, color: 'bg-orange-600' },
  { name: 'Personal Plus', percentage: 2.56, color: 'bg-gray-300' },
  { name: 'Enterprise', percentage: 7.13, color: 'bg-orange-600' },
  { name: 'Premium', percentage: 6.2, color: 'bg-orange-600' },
];

const CustomerSegments = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-orange-600 mb-4">🏷️ User Segments</h3>
      <div className="space-y-3">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${segment.color}`}></div>
              <span className="text-sm text-gray-700">{segment.name}</span>
            </div>
            <span className="text-sm font-medium text-gray-800">({segment.percentage}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerSegments;