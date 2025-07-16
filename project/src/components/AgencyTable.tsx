import React from 'react';

const agencyData = [
  { agency: 'Branch Alpha', count: 169 },
  { agency: 'Branch Beta', count: 9 },
  { agency: 'Branch Gamma', count: 1 },
  { agency: 'Branch Delta', count: 8 },
  { agency: 'Branch Epsilon', count: 139 },
];

const AgencyTable = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-blue-600 mb-4">👥 Branch Overview</h3>
      <div className="overflow-y-auto max-h-64">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-50">
              <th className="text-left py-3 px-4 font-medium text-blue-800">Branch</th>
              <th className="text-right py-3 px-4 font-medium text-blue-800">Count</th>
            </tr>
          </thead>
          <tbody>
            {agencyData.map((item, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-700">{item.agency}</td>
                <td className="py-3 px-4 text-right text-gray-800 font-medium">{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgencyTable;