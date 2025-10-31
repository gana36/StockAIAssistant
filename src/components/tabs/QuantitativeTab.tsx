import { DollarSign, Percent, TrendingUp, PieChart, AlertCircle } from "lucide-react";
import { Progress } from "../ui/progress";

interface QuantitativeTabProps {
  analysis?: string;
}

export function QuantitativeTab({ analysis }: QuantitativeTabProps) {
  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <div className="w-16 h-16 rounded-full bg-[#4a9eff]/20 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-[#4a9eff]" />
        </div>
        <h3 className="text-xl text-white mb-2">No Quantitative Analysis Yet</h3>
        <p className="text-gray-400 mb-6 max-w-md">
          Click "Run Full Analysis" to generate statistical and quantitative metrics
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Analysis Result */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
        <h3 className="text-lg text-white mb-4 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-[#6b73ff]" />
          Quantitative Analysis Report
        </h3>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{analysis}</p>
        </div>
      </div>

      {/* Original mock content */}
      {/* Valuation Metrics */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
        <h3 className="text-lg text-white mb-4">Valuation Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricRow label="P/E Ratio" value="28.4" benchmark="Industry: 24.2" status="high" />
          <MetricRow label="P/B Ratio" value="42.8" benchmark="Industry: 38.5" status="high" />
          <MetricRow label="EV/EBITDA" value="22.6" benchmark="Industry: 19.8" status="high" />
          <MetricRow label="PEG Ratio" value="1.8" benchmark="Ideal: < 2.0" status="good" />
        </div>
      </div>

      {/* Profitability Ratios */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
        <h3 className="text-lg text-white mb-4">Profitability Ratios</h3>
        <div className="space-y-4">
          <RatioBar label="Gross Margin" value={42.5} target={40} />
          <RatioBar label="Operating Margin" value={29.8} target={25} />
          <RatioBar label="Net Profit Margin" value={24.2} target={20} />
          <RatioBar label="Return on Equity (ROE)" value={56.3} target={50} />
          <RatioBar label="Return on Assets (ROA)" value={22.4} target={20} />
        </div>
      </div>

      {/* Financial Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#4a9eff]/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[#4a9eff]" />
            </div>
            <div>
              <h4 className="text-white">Liquidity</h4>
              <p className="text-xs text-gray-400">Current & Quick Ratios</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Current Ratio</span>
              <span className="text-lg text-[#00d4aa]">1.98</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Quick Ratio</span>
              <span className="text-lg text-[#00d4aa]">1.64</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#6b73ff]/20 flex items-center justify-center">
              <Percent className="w-5 h-5 text-[#6b73ff]" />
            </div>
            <div>
              <h4 className="text-white">Leverage</h4>
              <p className="text-xs text-gray-400">Debt Ratios</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Debt-to-Equity</span>
              <span className="text-lg text-white">1.84</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Interest Coverage</span>
              <span className="text-lg text-white">8.2x</span>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Metrics */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
        <h3 className="text-lg text-white mb-4">Growth Metrics (YoY)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GrowthCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Revenue Growth"
            value="+12.4%"
            isPositive={true}
          />
          <GrowthCard
            icon={<DollarSign className="w-5 h-5" />}
            label="Earnings Growth"
            value="+18.6%"
            isPositive={true}
          />
          <GrowthCard
            icon={<PieChart className="w-5 h-5" />}
            label="Book Value Growth"
            value="+9.2%"
            isPositive={true}
          />
        </div>
      </div>

      {/* Efficiency Ratios */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
        <h3 className="text-lg text-white mb-4">Efficiency Ratios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-white/5">
            <p className="text-sm text-gray-400 mb-2">Asset Turnover</p>
            <p className="text-2xl text-white">0.92x</p>
          </div>
          <div className="p-4 rounded-lg bg-white/5">
            <p className="text-sm text-gray-400 mb-2">Inventory Turnover</p>
            <p className="text-2xl text-white">38.4x</p>
          </div>
          <div className="p-4 rounded-lg bg-white/5">
            <p className="text-sm text-gray-400 mb-2">Receivables Turnover</p>
            <p className="text-2xl text-white">14.2x</p>
          </div>
          <div className="p-4 rounded-lg bg-white/5">
            <p className="text-sm text-gray-400 mb-2">Days Sales Outstanding</p>
            <p className="text-2xl text-white">26 days</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricRow({
  label,
  value,
  benchmark,
  status,
}: {
  label: string;
  value: string;
  benchmark: string;
  status: "good" | "high" | "low";
}) {
  const colors = {
    good: "text-[#00d4aa]",
    high: "text-[#ff6b6b]",
    low: "text-gray-400",
  };

  return (
    <div className="p-4 rounded-lg bg-white/5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">{label}</span>
        <span className={`text-xl ${colors[status]}`}>{value}</span>
      </div>
      <p className="text-xs text-gray-500">{benchmark}</p>
    </div>
  );
}

function RatioBar({ label, value, target }: { label: string; value: number; target: number }) {
  const percentage = Math.min((value / target) * 100, 100);
  const isGood = value >= target;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">{label}</span>
        <span className={`text-lg ${isGood ? 'text-[#00d4aa]' : 'text-white'}`}>
          {value.toFixed(1)}%
        </span>
      </div>
      <Progress value={percentage} className="h-2 bg-white/10" />
    </div>
  );
}

function GrowthCard({
  icon,
  label,
  value,
  isPositive,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isPositive: boolean;
}) {
  return (
    <div className={`p-4 rounded-xl border ${
      isPositive
        ? 'bg-[#00d4aa]/10 border-[#00d4aa]/20'
        : 'bg-[#ff6b6b]/10 border-[#ff6b6b]/20'
    }`}>
      <div className={`mb-3 ${isPositive ? 'text-[#00d4aa]' : 'text-[#ff6b6b]'}`}>
        {icon}
      </div>
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={`text-2xl ${isPositive ? 'text-[#00d4aa]' : 'text-[#ff6b6b]'}`}>
        {value}
      </p>
    </div>
  );
}
