import { TrendingUp, Activity, Target, BarChart3, AlertCircle } from "lucide-react";
import { Progress } from "../ui/progress";

interface TechnicalTabProps {
  analysis?: string;
}

export function TechnicalTab({ analysis }: TechnicalTabProps) {
  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <div className="w-16 h-16 rounded-full bg-[#4a9eff]/20 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-[#4a9eff]" />
        </div>
        <h3 className="text-xl text-white mb-2">No Technical Analysis Yet</h3>
        <p className="text-gray-400 mb-6 max-w-md">
          Click "Run Full Analysis" to generate technical indicators and trading signals
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Analysis Result */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
        <h3 className="text-lg text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#4a9eff]" />
          Technical Analysis Report
        </h3>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{analysis}</p>
        </div>
      </div>

      {/* Visual Indicators (Mock) */}
      {/* Indicators Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <IndicatorCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="RSI (14)"
          value="62.4"
          status="neutral"
          description="Neutral zone"
        />
        <IndicatorCard
          icon={<Activity className="w-5 h-5" />}
          label="MACD"
          value="+1.24"
          status="bullish"
          description="Bullish crossover"
        />
        <IndicatorCard
          icon={<Target className="w-5 h-5" />}
          label="Stochastic"
          value="48.2"
          status="neutral"
          description="Mid-range"
        />
        <IndicatorCard
          icon={<BarChart3 className="w-5 h-5" />}
          label="ADX"
          value="34.6"
          status="bullish"
          description="Strong trend"
        />
      </div>

      {/* Moving Averages */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
        <h3 className="text-lg text-white mb-4">Moving Averages</h3>
        <div className="space-y-4">
          <MovingAverageRow
            label="SMA 20"
            value="$176.80"
            position="above"
            distance="+0.93%"
          />
          <MovingAverageRow
            label="SMA 50"
            value="$174.20"
            position="above"
            distance="+2.44%"
          />
          <MovingAverageRow
            label="SMA 200"
            value="$168.50"
            position="above"
            distance="+5.91%"
          />
          <MovingAverageRow
            label="EMA 12"
            value="$177.30"
            position="above"
            distance="+0.65%"
          />
          <MovingAverageRow
            label="EMA 26"
            value="$175.90"
            position="above"
            distance="+1.45%"
          />
        </div>
      </div>

      {/* Support & Resistance */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
        <h3 className="text-lg text-white mb-4">Support & Resistance Levels</h3>
        <div className="space-y-3">
          <LevelRow label="Resistance 3" value="$185.20" type="resistance" strength={60} />
          <LevelRow label="Resistance 2" value="$182.40" type="resistance" strength={75} />
          <LevelRow label="Resistance 1" value="$179.80" type="resistance" strength={85} />
          <div className="py-2 px-4 rounded-lg bg-[#4a9eff]/20 border border-[#4a9eff]/30">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Current Price</span>
              <span className="text-lg text-[#4a9eff]">$178.45</span>
            </div>
          </div>
          <LevelRow label="Support 1" value="$176.20" type="support" strength={85} />
          <LevelRow label="Support 2" value="$173.50" type="support" strength={75} />
          <LevelRow label="Support 3" value="$170.00" type="support" strength={65} />
        </div>
      </div>

      {/* Technical Summary */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-[#00d4aa]/10 to-transparent border border-[#00d4aa]/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-[#00d4aa]/20 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-[#00d4aa]" />
          </div>
          <div>
            <h3 className="text-lg text-white">Technical Summary</h3>
            <p className="text-sm text-gray-400">Overall Signal: Strong Buy</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl text-[#00d4aa]">12</p>
            <p className="text-xs text-gray-400">Buy Signals</p>
          </div>
          <div>
            <p className="text-2xl text-gray-400">3</p>
            <p className="text-xs text-gray-400">Neutral</p>
          </div>
          <div>
            <p className="text-2xl text-[#ff6b6b]">2</p>
            <p className="text-xs text-gray-400">Sell Signals</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function IndicatorCard({
  icon,
  label,
  value,
  status,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  status: "bullish" | "bearish" | "neutral";
  description: string;
}) {
  const colors = {
    bullish: "text-[#00d4aa] bg-[#00d4aa]/10 border-[#00d4aa]/20",
    bearish: "text-[#ff6b6b] bg-[#ff6b6b]/10 border-[#ff6b6b]/20",
    neutral: "text-gray-400 bg-white/5 border-white/10",
  };

  return (
    <div className={`p-4 rounded-xl border ${colors[status]}`}>
      <div className={`mb-2 ${colors[status].split(' ')[0]}`}>{icon}</div>
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={`text-xl mb-1 ${colors[status].split(' ')[0]}`}>{value}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
}

function MovingAverageRow({
  label,
  value,
  position,
  distance,
}: {
  label: string;
  value: string;
  position: "above" | "below";
  distance: string;
}) {
  const isAbove = position === "above";
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400 w-20">{label}</span>
        <span className="text-white">{value}</span>
      </div>
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
        isAbove ? 'bg-[#00d4aa]/20 text-[#00d4aa]' : 'bg-[#ff6b6b]/20 text-[#ff6b6b]'
      }`}>
        <span className="text-xs">{isAbove ? '↑' : '↓'} {distance}</span>
      </div>
    </div>
  );
}

function LevelRow({
  label,
  value,
  type,
  strength,
}: {
  label: string;
  value: string;
  type: "support" | "resistance";
  strength: number;
}) {
  const color = type === "resistance" ? "text-[#ff6b6b]" : "text-[#00d4aa]";
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400 w-28">{label}</span>
        <span className={`${color}`}>{value}</span>
      </div>
      <div className="flex items-center gap-2">
        <Progress value={strength} className="w-20 h-1.5 bg-white/10" />
        <span className="text-xs text-gray-400 w-8">{strength}%</span>
      </div>
    </div>
  );
}
