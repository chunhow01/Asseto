import React from 'react';
import { Asset } from '../types';
import { TrendingUp, Trash2 } from 'lucide-react';

interface AssetListProps {
  assets: Asset[];
  onRemoveAsset: (id: string) => void;
}

const AssetList: React.FC<AssetListProps> = ({ assets, onRemoveAsset }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full w-full">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
           <div className="w-1 h-5 bg-emerald-500 rounded-full"></div>
           Your Assets
        </h3>
        <span className="text-[10px] sm:text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
            {assets.length} Positions
        </span>
      </div>
      
      {/* Added overflow-x-hidden to strictly disable horizontal scrolling */}
      <div className="overflow-y-auto overflow-x-hidden flex-1 custom-scrollbar w-full">
        {assets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <TrendingUp size={48} className="mb-4 opacity-20" />
            <p>No assets tracked yet.</p>
            <p className="text-sm">Add a symbol to get started.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="text-[10px] sm:text-xs font-medium text-gray-400 border-b border-gray-100 uppercase tracking-wider">
                <th className="py-2 pl-3 w-[28%] truncate">Asset</th>
                <th className="py-2 text-right w-[22%] truncate">Price</th>
                <th className="py-2 text-right w-[18%] truncate">Shares</th>
                <th className="py-2 text-right pr-2 w-[25%] truncate">Value</th>
                <th className="py-2 w-[7%]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {assets.map((asset) => {
                const totalValue = asset.shares * asset.price;
                return (
                  <tr key={asset.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="py-3 pl-3 truncate">
                        <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center font-bold text-gray-600 text-[10px] sm:text-xs shadow-inner">
                                {asset.symbol.substring(0, 2)}
                            </div>
                            <div className="truncate min-w-0 flex-1">
                                <span className="block font-bold text-gray-900 text-xs sm:text-sm truncate">{asset.symbol}</span>
                                <span className="hidden sm:block text-[10px] text-emerald-600 truncate">Live</span>
                            </div>
                        </div>
                    </td>
                    <td className="py-3 text-right text-xs sm:text-sm text-gray-600 truncate">
                      ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 text-right text-xs sm:text-sm text-gray-600 truncate">
                      {asset.shares.toLocaleString()}
                    </td>
                    <td className="py-3 text-right pr-2 truncate">
                      <span className="font-bold text-gray-900 text-xs sm:text-sm">
                        ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </span>
                    </td>
                    <td className="py-3 text-right pr-2">
                        <button 
                            onClick={() => onRemoveAsset(asset.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Remove Asset"
                        >
                            <Trash2 size={14} />
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