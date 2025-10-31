import { AlertTriangle, Shield, Activity, TrendingDown, AlertCircle } from "lucide-react";
import { Progress } from "../ui/progress";

interface RiskTabProps {
  analysis?: string;
}

export function RiskTab({ analysis }: RiskTabProps) {
  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <div className="w-16 h-16 rounded-full bg-[#4a9eff]/20 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-[#4a9eff]" />
        </div>
        <h3 className="text-xl text-white mb-2">No Risk Assessment Yet</h3>
        <p className="text-gray-400 mb-6 max-w-md">
          Click "Run Full Analysis" to generate comprehensive risk assessment
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Analysis Result */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
        <h3 className="text-lg text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#ff6b6b]" />
          Risk Assessment Report
        </h3>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{analysis}</p>
        </div>
      </div>

      {/* Original mock content */}
      {/* Overall Risk Score */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-[#6b73ff]/10 to-transparent border border-[#6b73ff]/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#6b73ff]/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#6b73ff]" />
            </div>
            <div>
              <h3 className="text-lg text-white">Overall Risk Score</h3>
              <p className="text-sm text-gray-400">Moderate Risk</p>
            </div>
          </div>
          <div className="text-4xl text-[#6b73ff]">5.2</div>
        </div>
        <Progress value={52} className="h-2 bg-white/10" />
        <p className="text-xs text-gray-400 mt-2">Score range: 0 (low risk) to 10 (high risk)</p>
      </div>

      {/* Risk Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RiskCategoryCard
          icon={<Activity className="w-5 h-5" />}
          label="Volatility Risk"
          score={6.8}
          description="Historical price fluctuations"
          status="moderate"
        />
        <RiskCategoryCard
          icon={<TrendingDown className="w-5 h-5" />}
          label="Market Risk"
          score={5.4}
          description="Systematic market exposure"
          status="moderate"
        />
        <RiskCategoryCard
          icon={<AlertTriangle className="w-5 h-5" />}
          label="Liquidity Risk"
          score={2.8}
          description="Trading volume analysis"
          status="low"
        />
        <RiskCategoryCard
          icon={<Shield className="w-5 h-5" />}
          label="Credit Risk"
          score={3.2}
          description="Financial stability metrics"
          status="low"
        />
      </div>

      {/* Risk Metrics */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
        <h3 className="text-lg text-white mb-4">Risk Metrics</h3>
        <div className="space-y-4">
          <MetricRow label="Beta" value="1.24" description="Higher volatility vs market" />
          <MetricRow label="Standard Deviation" value="28.4%" description="Annualized volatility" />
          <MetricRow label="Sharpe Ratio" value="1.82" description="Risk-adjusted returns" />
          <MetricRow label="Max Drawdown" value="-18.6%" description="Largest peak-to-trough decline" />
          <MetricRow label="Value at Risk (95%)" value="$4.82" description="Potential 1-day loss" />
        </div>
      </div>

      {/* Risk Factors */}
      <div className="space-y-3">
        <h4 className="text-sm text-gray-400">Key Risk Factors</h4>
        <RiskFactorCard
          title="Market Concentration"
          description="High dependency on consumer electronics market segment"
          severity="moderate"
        />
        <RiskFactorCard
          title="Supply Chain Disruption"
          description="Exposure to international manufacturing and logistics risks"
          severity="moderate"
        />
        <RiskFactorCard
          title="Regulatory Changes"
          description="Potential impact from antitrust and privacy regulations"
          severity="low"
        />
        <RiskFactorCard
          title="Currency Exposure"
          description="Significant international revenue subject to FX fluctuations"
          severity="moderate"
        />
      </div>

      {/* Diversification Analysis */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
        <h3 className="text-lg text-white mb-4">Diversification Impact</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Correlation with S&P 500</span>
              <span className="text-lg text-white">0.78</span>
            </div>
            <Progress value={78} className="h-2 bg-white/10" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Sector Concentration</span>
              <span className="text-lg text-white">High</span>
            </div>
            <Progress value={85} className="h-2 bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

function RiskCategoryCard({
  icon,
  label,
  score,
  description,
  status,
}: {
  icon: React.ReactNode;
  label: string;
  score: number;
  description: string;
  status: "low" | "moderate" | "high";
}) {
  const colors = {
    low: "text-[#00d4aa] bg-[#00d4aa]/10 border-[#00d4aa]/20",
    moderate: "text-[#6b73ff] bg-[#6b73ff]/10 border-[#6b73ff]/20",
    high: "text-[#ff6b6b] bg-[#ff6b6b]/10 border-[#ff6b6b]/20",
  };

  return (
    <div className={`p-4 rounded-xl border ${colors[status]}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={colors[status].split(' ')[0]}>{icon}</div>
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <p className={`text-3xl mb-2 ${colors[status].split(' ')[0]}`}>{score.toFixed(1)}/10</p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
}

function MetricRow({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
      <div>
        <p className="text-sm text-white mb-1">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <span className="text-xl text-[#6b73ff]">{value}</span>
    </div>
  );
}

function RiskFactorCard({
  title,
  description,
  severity,
}: {
  title: string;
  description: string;
  severity: "low" | "moderate" | "high";
}) {
  const colors = {
    low: "border-[#00d4aa]/20 bg-[#00d4aa]/5",
    moderate: "border-[#6b73ff]/20 bg-[#6b73ff]/5",
    high: "border-[#ff6b6b]/20 bg-[#ff6b6b]/5",
  };

  const badges = {
    low: "bg-[#00d4aa]/20 text-[#00d4aa]",
    moderate: "bg-[#6b73ff]/20 text-[#6b73ff]",
    high: "bg-[#ff6b6b]/20 text-[#ff6b6b]",
  };

  return (
    <div className={`p-4 rounded-lg border ${colors[severity]}`}>
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-white">{title}</h4>
        <span className={`text-xs px-2 py-1 rounded-full ${badges[severity]}`}>
          {severity.toUpperCase()}
        </span>
      </div>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}
