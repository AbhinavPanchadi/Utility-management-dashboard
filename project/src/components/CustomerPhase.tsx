import React from 'react';

const CustomerPhase = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-orange-600 mb-4">⚡ Users by Connection Type</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="bg-yellow-100 rounded-lg p-4 mb-2">
            <div className="text-2xl font-bold text-gray-800">82.82%</div>
          </div>
          <div className="text-sm text-gray-600">Single-Line:</div>
        </div>
        <div className="text-center">
          <div className="bg-yellow-100 rounded-lg p-4 mb-2">
            <div className="text-2xl font-bold text-gray-800">17.18%</div>
          </div>
          <div className="text-sm text-gray-600">Multi-Line:</div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPhase;