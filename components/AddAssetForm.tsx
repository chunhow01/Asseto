import React, { useState } from 'react';
import { Plus, Loader2, AlertCircle, RefreshCw, PenTool } from 'lucide-react';
import { fetchCryptoPrice } from '../services/stockService';

interface AddAssetFormProps {
  onAddAsset: (symbol: string, shares: number, price: number) => void;
}

type InputMode = 'api' | 'manual';

const AddAssetForm: React.FC<AddAssetFormProps> = ({ onAddAsset }) => {
  const [mode, setMode] = useState<InputMode>('manual');
  const [symbol, setSymbol] = useState('');
  const [shares, setShares] = useState('');
  const [manualPrice, setManualPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol || !shares) return;
    
    const sharesNum = parseFloat(shares);
    if (isNaN(sharesNum) || sharesNum <= 0) {
        setError("Please enter a valid number of shares");
        return;
    }

    if (mode === 'manual') {
        const priceNum = parseFloat(manualPrice);
        if (isNaN(priceNum) || priceNum < 0) {
            setError("Please enter a valid price");
            return;
        }
        onAddAsset(symbol.toUpperCase(), sharesNum, priceNum);
        resetForm();
        return;
    }

    // Auto Mode (CoinGecko)
    setIsLoading(true);
    setError(null);

    try {
      const price = await fetchCryptoPrice(symbol);
      if (price && price > 0) {
        onAddAsset(symbol.toUpperCase(), sharesNum, price);
        resetForm();
      } else {
        setError("Could not fetch price for this symbol. Try Manual mode.");
        setMode('manual');
      }
    } catch (err) {
      setError("Fetch failed. Please check connection or use Manual.");
      setMode('manual');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
      setSymbol('');
      setShares('');
      setManualPrice('');
      setError(null);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
            Add New Asset
        </h3>
        
        {/* Mode Toggle - "Auto" and "Manual" only */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
                type="button"
                onClick={() => setMode('manual')}
                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${mode === 'manual' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <PenTool size={12} /> Manual
            </button>
            <button
                type="button"
                onClick={() => setMode('api')}
                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${mode === 'api' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <RefreshCw size={12} /> Auto
            </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
            Symbol
          </label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="e.g. AAPL, BTC, SOL"
            className="w-full bg-gray-50 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 focus:bg-white placeholder-gray-400 transition-all text-sm"
          />
        </div>
        
        <div className="flex gap-4">
            <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                    Shares
                </label>
                <input
                    type="number"
                    step="any"
                    value={shares}
                    onChange={(e) => setShares(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-gray-50 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 focus:bg-white placeholder-gray-400 transition-all text-sm"
                />
            </div>
            
            {(mode === 'manual' || isLoading) && (
                <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                        Price ($)
                    </label>
                    <input
                        type="number"
                        step="any"
                        disabled={isLoading}
                        value={manualPrice}
                        onChange={(e) => setManualPrice(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-gray-50 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 focus:bg-white placeholder-gray-400 transition-all text-sm disabled:opacity-50"
                    />
                </div>
            )}
        </div>

        {error && (
            <div className="text-red-500 text-xs flex items-center gap-2 bg-red-50 p-3 rounded-lg border border-red-100">
                <AlertCircle size={14} />
                {error}
            </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !symbol || !shares || (mode === 'manual' && !manualPrice)}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/10
            ${isLoading || !symbol || !shares || (mode === 'manual' && !manualPrice)
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-blue-500/20 active:scale-[0.98]'
            }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Fetching Price...
            </>
          ) : (
            <>
              <Plus size={18} />
              {mode === 'manual' ? 'Add Asset' : 'Fetch & Add'}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddAssetForm;