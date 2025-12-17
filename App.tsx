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
                    {/* Consistent Minimalist Logo matched to home screen */}
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 overflow-hidden p-1.5">
                        <img 
                            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjUxMiIgaGVpnaHQ9IjUxMiIgZmlsbD0iI2ZmZmZmZiIvPjxjaXJjbGUgY3g9IjI1NiIgY3k9IjI1NiIgcj0iMTUwIiBzdHJva2U9IiMyNTYzZWIiIHN0cm9rZS13aWR0aD0iNTAiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMjU2IDEwNiBBMTUwIDE1MCAwIDAgMSA0MDYgMjU2IiBzdHJva2U9IiM2MGE1ZmEiIHN0cm9rZS13aWR0aD0iNTAiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvc3ZnPg==" 
                            alt="Asseto Logo" 
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-gray-900">Asseto</span>
                </div>
                <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-500">
                    <span className="hover:text-gray-900 cursor-pointer transition-colors">Dashboard</span>
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