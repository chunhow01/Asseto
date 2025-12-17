import React, { useState, useEffect } from 'react';
import { Asset } from './types';
import Dashboard from './components/Dashboard';
import AssetList from './components/AssetList';
import AddAssetForm from './components/AddAssetForm';
import SettingsModal from './components/SettingsModal';
import { Settings } from 'lucide-react';

const App: React.FC = () => {
  const STORAGE_KEY = 'asseto_portfolio_v1';
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [assets, setAssets] = useState<Asset[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load from local storage", e);
    }
    return [
      { id: '1', symbol: 'VOO', shares: 15.5, price: 436.50 },
      { id: '2', symbol: 'BTC', shares: 0.25, price: 64230.15 },
      { id: '3', symbol: 'AAPL', shares: 50, price: 173.25 },
    ];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
  }, [assets]);

  const handleAddAsset = (symbol: string, shares: number, price: number) => {
    const newAsset: Asset = {
      id: crypto.randomUUID(),
      symbol,
      shares,
      price
    };
    setAssets(prev => [...prev, newAsset]);
  };

  const handleRemoveAsset = (id: string) => {
      setAssets(prev => prev.filter(a => a.id !== id));
  };

  const handleImportAssets = (importedAssets: Asset[]) => {
      setAssets(importedAssets);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100">
        <SettingsModal 
            isOpen={isSettingsOpen} 
            onClose={() => setIsSettingsOpen(false)} 
            assets={assets}
            onImport={handleImportAssets}
        />

        <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Minimalist Logo synchronized with app icon */}
                    <div className="h-10 px-4 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 overflow-hidden">
                        <img 
                            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjUxMiIgaGVpnaHQ9IjUxMiIgZmlsbD0id2hpdGUiLz48dGV4dCB4PSI1MCUiIHk9IjUyJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9Ii1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgJ1NlZ29lIFVJJywgUm9ib3RvLCBIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iOTAwIiBmb250LXNpemU9Ijk2IiBsZXR0ZXItc3BhY2luZz0iLTUiIGZpbGw9ImJsYWNrIj5Bc3NldG88L3RleHQ+PC9zdmc+" 
                            alt="Asseto Logo" 
                            className="h-7 object-contain"
                        />
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-500">
                    <span className="hover:text-gray-900 cursor-pointer transition-colors font-semibold">Dashboard</span>
                    <button 
                        onClick={() => setIsSettingsOpen(true)}
                        className="flex items-center gap-2 hover:text-gray-900 cursor-pointer transition-colors"
                    >
                        Settings
                    </button>
                    <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 ml-2 overflow-hidden flex items-center justify-center text-[10px] text-gray-400">
                      User
                    </div>
                </div>
                <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className="sm:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                    <Settings size={20} />
                </button>
            </div>
        </nav>

        <main className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <Dashboard assets={assets} />
                    <AddAssetForm onAddAsset={handleAddAsset} />
                </div>
                <div className="lg:col-span-7">
                    <AssetList assets={assets} onRemoveAsset={handleRemoveAsset} />
                </div>
            </div>
        </main>
    </div>
  );
};

export default App;