import React from 'react';

const tariffData = [
  { category: 'Basic Plan', count: 4825 },
  { category: 'Home Plan', count: 5342 },
  { category: 'Partner Plan', count: 1203 },
  { category: 'Business Plan', count: 3847 },
  { category: 'Municipal Plan', count: 2156 },
];

const TariffTable = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-blue-600 mb-4">Plan Distribution Overview</h3>
      <div className="overflow-y-auto max-h-64">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-50">
              <th className="text-left py-3 px-4 font-medium text-blue-800">Plan Category</th>
              <th className="text-right py-3 px-4 font-medium text-blue-800">Count</th>
            </tr>
          </thead>
          <tbody>
            {tariffData.map((item, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-700">{item.category}</td>
                <td className="py-3 px-4 text-right text-gray-800 font-medium">{item.count.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TariffTable;