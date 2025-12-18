import React, { useState, useMemo } from 'react';
import { Asset } from '../types';
import { TrendingUp, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Currency, HKD_RATE } from '../App';

interface AssetListProps {
  assets: Asset[];
  onRemoveAsset: (id: string) => void;
  currency: Currency;
}

type SortKey = 'symbol' | 'price' | 'shares' | 'value';

const AssetList: React.FC<AssetListProps> = ({ assets, onRemoveAsset, currency }) => {
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>(null);

  const displayRate = currency === 'HKD' ? HKD_RATE : 1;
  const listSymbol = '$'; // Simplified for the details area as requested

  const handleSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key) {
        direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    } else {
        if (['price', 'shares', 'value'].includes(key)) {
            direction = 'desc';
        }
    }
    setSortConfig({ key, direction });
  };

  const sortedAssets = useMemo(() => {
    if (!sortConfig) return assets;

    return [...assets].sort((a, b) => {
        let aValue: number | string;
        let bValue: number | string;

        if (sortConfig.key === 'value') {
            aValue = a.shares * a.price;
            bValue = b.shares * b.price;
        } else {
            aValue = a[sortConfig.key];
            bValue = b[sortConfig.key];
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });
  }, [assets, sortConfig]);

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
      if (sortConfig?.key !== columnKey) return <ArrowUpDown size={12} className="opacity-30 ml-1" />;
      return sortConfig.direction === 'asc' 
        ? <ArrowUp size={12} className="text-blue-600 ml-1" /> 
        : <ArrowDown size={12} className="text-blue-600 ml-1" />;
  };

  const Th = ({ label, sortKey, align = 'left', className = '' }: { label: string, sortKey?: SortKey, align?: 'left' | 'right', className?: string }) => (
      <th 
        className={`py-3 ${align === 'right' ? 'text-right' : 'text-left'} ${className} ${sortKey ? 'cursor-pointer hover:text-gray-600 select-none group' : ''}`}
        onClick={() => sortKey && handleSort(sortKey)}
      >
          <div className={`flex items-center ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
            {label}
            {sortKey && <SortIcon columnKey={sortKey} />}
          </div>
      </th>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full w-full min-h-[500px]">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
           <div className="w-1.5 h-5 bg-emerald-500 rounded-full"></div>
           Portfolio Details
        </h3>
        <span className="text-[10px] sm:text-xs font-bold text-gray-500 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg uppercase tracking-wider">
            {assets.length} Positions
        </span>
      </div>
      
      <div className="overflow-y-auto overflow-x-hidden flex-1 custom-scrollbar w-full">
        {assets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-300">
            <TrendingUp size={64} className="mb-4 opacity-10" />
            <p className="font-semibold text-lg">Empty Portfolio</p>
            <p className="text-sm font-medium">Add some assets to start tracking.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="text-[10px] font-bold text-gray-400 border-b border-gray-100 uppercase tracking-widest">
                <Th label="Asset" sortKey="symbol" className="pl-4 w-[28%]" />
                <Th label="Price ($)" sortKey="price" align="right" className="w-[22%]" />
                <Th label="Shares" sortKey="shares" align="right" className="w-[18%]" />
                <Th label="Value ($)" sortKey="value" align="right" className="pr-2 w-[25%]" />
                <th className="py-2 w-[7%]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedAssets.map((asset) => {
                const totalValue = asset.shares * asset.price * displayRate;
                const displayPrice = asset.price * displayRate;
                return (
                  <tr key={asset.id} className="group hover:bg-gray-50 transition-all">
                    <td className="py-4 pl-4 truncate">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0 flex items-center justify-center font-black text-gray-400 text-[10px] shadow-sm">
                                {asset.symbol.substring(0, 2)}
                            </div>
                            <div className="truncate min-w-0 flex-1">
                                <span className="block font-black text-gray-900 text-xs sm:text-sm truncate leading-none">{asset.symbol}</span>
                            </div>
                        </div>
                    </td>
                    <td className="py-4 text-right text-xs sm:text-sm font-medium text-gray-600 truncate">
                      {listSymbol}{displayPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 text-right text-xs sm:text-sm font-medium text-gray-600 truncate">
                      {asset.shares.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    </td>
                    <td className="py-4 text-right pr-2 truncate">
                      <span className="font-black text-gray-900 text-xs sm:text-sm">
                        {listSymbol}{totalValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </span>
                    </td>
                    <td className="py-4 text-right pr-4">
                        <button 
                            onClick={() => onRemoveAsset(asset.id)}
                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                            title="Remove Asset"
                        >
                            <Trash2 size={16} />
                        </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AssetList;