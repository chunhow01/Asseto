import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Asset, CHART_COLORS } from '../types';
import { Wallet } from 'lucide-react';

interface DashboardProps {
  assets: Asset[];
}

const Dashboard: React.FC<DashboardProps> = ({ assets }) => {
  const totalValue = assets.reduce((sum, asset) => sum + (asset.shares * asset.price), 0);

  const data = assets.map(asset => ({
    name: asset.symbol,
    value: asset.shares * asset.price
  })).sort((a, b) => b.value - a.value);

  // Custom tooltip for the pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percent = totalValue > 0 ? ((data.value / totalValue) * 100).toFixed(1) : 0;
      return (
        <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-xl">
          <p className="font-bold text-gray-900">{data.name}</p>
          <p className="text-gray-600">
            ${data.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-400">{percent}% of Portfolio</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-6 bg-white rounded-3xl mb-6 shadow-sm border border-gray-200 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-50/50 to-white pointer-events-none" />

      <div className="z-10 flex flex-col items-center mb-6">
        <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wider flex items-center gap-2">
          <Wallet size={16} /> Total Portfolio Value
        </h2>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 tracking-tight">
          ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h1>
      </div>

      <div className="w-full h-[250px] relative z-10">
        {assets.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={CHART_COLORS[index % CHART_COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 italic">
            No assets to display
          </div>
        )}
      </div>
      
      {/* Legend below chart */}
      <div className="flex flex-wrap justify-center gap-3 px-4 mt-2 max-w-lg z-10">
        {data.slice(0, 6).map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                <div 
                    className="w-2.5 h-2.5 rounded-full shadow-sm" 
                    style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                />
                <span className="text-gray-700 font-medium">{entry.name}</span>
                <span className="text-gray-400">
                    {totalValue > 0 ? ((entry.value / totalValue) * 100).toFixed(0) : 0}%
                </span>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;