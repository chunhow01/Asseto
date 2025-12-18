import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Asset, CHART_COLORS } from '../types';
import { Wallet } from 'lucide-react';
import { Currency, HKD_RATE } from '../App';

interface DashboardProps {
  assets: Asset[];
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ assets, currency, onCurrencyChange }) => {
  const baseValue = assets.reduce((sum, asset) => sum + (asset.shares * asset.price), 0);
  const displayRate = currency === 'HKD' ? HKD_RATE : 1;
  const totalValue = baseValue * displayRate;
  const symbol = currency === 'HKD' ? 'HKD$' : 'USD$';

  const data = assets.map(asset => ({
    name: asset.symbol,
    value: asset.shares * asset.price * displayRate
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
            {symbol}{data.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-400">{percent}% of Portfolio</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-8 bg-white rounded-3xl mb-6 shadow-sm border border-gray-200 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-50/50 to-white pointer-events-none" />

      {/* Ultra-mini Currency Switcher Toggle */}
      <div className="absolute top-2 right-2 z-20">
        <div className="flex bg-gray-100 p-0.5 rounded-md border border-gray-200 shadow-inner">
          <button
            onClick={() => onCurrencyChange('USD')}
            className={`px-1.5 py-0.5 text-[7px] font-black rounded-sm transition-all ${
              currency === 'USD' 
                ? 'bg-white text-blue-600 shadow-xs' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            USD
          </button>
          <button
            onClick={() => onCurrencyChange('HKD')}
            className={`px-1.5 py-0.5 text-[7px] font-black rounded-sm transition-all ${
              currency === 'HKD' 
                ? 'bg-white text-blue-600 shadow-xs' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            HKD
          </button>
        </div>
      </div>

      <div className="z-10 flex flex-col items-center mb-6 px-4">
        <h2 className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
          <Wallet size={14} className="text-blue-500" /> Total Portfolio Value
        </h2>
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 mt-3 tracking-tighter flex items-baseline gap-1">
          <span className="text-xl md:text-2xl font-bold text-gray-400 mb-0.5">{symbol}</span>
          {totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h1>
        {currency === 'HKD' && (
          <p className="text-[10px] text-gray-400 mt-2 font-medium">Rate: 1 USD = 7.8 HKD</p>
        )}
      </div>

      <div className="w-full h-[250px] relative z-10">
        {assets.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={65}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
                animationBegin={0}
                animationDuration={800}
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
          <div className="flex items-center justify-center h-full text-gray-300 italic text-sm">
            No assets to display
          </div>
        )}
      </div>
      
      {/* Legend below chart */}
      <div className="flex flex-wrap justify-center gap-4 px-6 mt-4 max-w-lg z-10">
        {data.slice(0, 6).map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-2 text-[11px]">
                <div 
                    className="w-2.5 h-2.5 rounded-full shadow-sm" 
                    style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                />
                <span className="text-gray-600 font-semibold">{entry.name}</span>
                <span className="text-gray-400 font-medium">
                    {totalValue > 0 ? ((entry.value / totalValue) * 100).toFixed(0) : 0}%
                </span>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;