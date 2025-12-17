export interface Asset {
  id: string;
  symbol: string;
  shares: number;
  price: number;
}

export interface PortfolioStats {
  totalValue: number;
  assetCount: number;
}

export const CHART_COLORS = [
  '#10b981', // Emerald
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#06b6d4', // Cyan
  '#ec4899', // Pink
  '#6366f1', // Indigo
];