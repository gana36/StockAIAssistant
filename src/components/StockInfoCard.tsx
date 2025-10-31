import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "motion/react";
import { Skeleton } from "./ui/skeleton";
import type { StockDataResponse } from "../services/api";

interface StockInfoCardProps {
  symbol: string | null;
  stockData: StockDataResponse | null;
  isLoading: boolean;
}

export function StockInfoCard({ symbol, stockData, isLoading }: StockInfoCardProps) {
  // Format numbers for display
  const formatNumber = (num: number): string => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  // Extract data from API response
  const latestData = stockData?.data[0];
  const info = stockData?.info;
  const price = latestData?.close || 0;
  const change = latestData?.change || 0;
  const changePercent = latestData?.percentChange || 0;

  // Calculate 52-week high/low from historical data
  const high52w = stockData?.data ? Math.max(...stockData.data.map(d => d.high)) : 0;
  const low52w = stockData?.data ? Math.min(...stockData.data.map(d => d.low)) : 0;

  const isPositive = change >= 0;

  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
        <Skeleton className="h-8 w-32 mb-4 bg-white/10" />
        <Skeleton className="h-16 w-48 mb-6 bg-white/10" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <Skeleton className="h-4 w-20 mb-2 bg-white/10" />
              <Skeleton className="h-6 w-24 bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all"
    >
      {/* Company Name and Symbol */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl text-white mb-1">{info?.name || symbol}</h1>
          <p className="text-gray-400">
            {symbol} {info?.sector && `• ${info.sector}`}
          </p>
        </div>
      </div>

      {/* Price and Change */}
      <div className="mb-6">
        <div className="flex items-baseline gap-4">
          <span className="text-5xl text-white">${price.toFixed(2)}</span>
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
            isPositive ? 'bg-[#00d4aa]/20 text-[#00d4aa]' : 'bg-[#ff6b6b]/20 text-[#ff6b6b]'
          }`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="text-sm">
              {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Volume" value={formatNumber(latestData?.volume || 0)} />
        <MetricCard label="Market Cap" value={formatNumber(info?.marketCap || 0)} />
        <MetricCard label="52W High" value={`$${high52w.toFixed(2)}`} />
        <MetricCard label="52W Low" value={`$${low52w.toFixed(2)}`} />
      </div>
    </motion.div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-lg text-white">{value}</p>
    </div>
  );
}
