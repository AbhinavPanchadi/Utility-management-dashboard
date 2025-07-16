import React from 'react';

const activityData = [
  { activity: 'General Services', count: 335 },
  { activity: 'Tech Solutions', count: 32 },
  { activity: 'Construction', count: 14 },
  { activity: 'Manufacturing', count: 3 },
  { activity: 'Government', count: 33 },
];

const ActivityTable = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-green-600 mb-4">Industry Overview</h3>
      <div className="overflow-y-auto max-h-64">
        <table className="w-full">
          <thead>
            <tr className="bg-green-50">
              <th className="text-left py-3 px-4 font-medium text-green-800">Industry Type</th>
              <th className="text-right py-3 px-4 font-medium text-green-800">Count</th>
            </tr>
          </thead>
          <tbody>
            {activityData.map((item, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-700">{item.activity}</td>
                <td className="py-3 px-4 text-right text-gray-800 font-medium">{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityTable;