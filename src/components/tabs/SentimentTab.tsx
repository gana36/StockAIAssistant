import { ThumbsUp, ThumbsDown, Minus, TrendingUp, Newspaper, Users, AlertCircle } from "lucide-react";
import { Progress } from "../ui/progress";

interface SentimentTabProps {
  analysis?: string;
}

export function SentimentTab({ analysis }: SentimentTabProps) {
  const sentimentData = {
    overall: 72,
    bullish: 65,
    bearish: 23,
    neutral: 12,
    newsScore: 78,
    socialScore: 68,
  };

  // If no analysis data, show prompt to run analysis
  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <div className="w-16 h-16 rounded-full bg-[#4a9eff]/20 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-[#4a9eff]" />
        </div>
        <h3 className="text-xl text-white mb-2">No Sentiment Analysis Yet</h3>
        <p className="text-gray-400 mb-6 max-w-md">
          Click "Run Full Analysis" in the sidebar to generate AI-powered sentiment analysis
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Analysis Result */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
        <h3 className="text-lg text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#00d4aa]" />
          Sentiment Analysis Report
        </h3>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{analysis}</p>
        </div>
      </div>

      {/* Visual Metrics (Mock - can be replaced with parsed data) */}
      {/* Overall Sentiment */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-[#00d4aa]/10 to-transparent border border-[#00d4aa]/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#00d4aa]/20 flex items-center justify-center">
              <ThumbsUp className="w-6 h-6 text-[#00d4aa]" />
            </div>
            <div>
              <h3 className="text-lg text-white">Overall Sentiment</h3>
              <p className="text-sm text-gray-400">Bullish Trend</p>
            </div>
          </div>
          <div className="text-4xl text-[#00d4aa]">{sentimentData.overall}%</div>
        </div>
        <Progress value={sentimentData.overall} className="h-2 bg-white/10" />
      </div>

      {/* Sentiment Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SentimentCard
          icon={<ThumbsUp className="w-5 h-5" />}
          label="Bullish"
          value={sentimentData.bullish}
          color="text-[#00d4aa]"
          bgColor="bg-[#00d4aa]/10"
          borderColor="border-[#00d4aa]/20"
        />
        <SentimentCard
          icon={<ThumbsDown className="w-5 h-5" />}
          label="Bearish"
          value={sentimentData.bearish}
          color="text-[#ff6b6b]"
          bgColor="bg-[#ff6b6b]/10"
          borderColor="border-[#ff6b6b]/20"
        />
        <SentimentCard
          icon={<Minus className="w-5 h-5" />}
          label="Neutral"
          value={sentimentData.neutral}
          color="text-gray-400"
          bgColor="bg-white/5"
          borderColor="border-white/10"
        />
      </div>

      {/* Source Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#4a9eff]/20 flex items-center justify-center">
              <Newspaper className="w-5 h-5 text-[#4a9eff]" />
            </div>
            <div>
              <h4 className="text-white">News Sentiment</h4>
              <p className="text-xs text-gray-400">Based on 247 articles</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Progress value={sentimentData.newsScore} className="flex-1 h-2 bg-white/10" />
            <span className="text-lg text-[#4a9eff]">{sentimentData.newsScore}%</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#6b73ff]/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#6b73ff]" />
            </div>
            <div>
              <h4 className="text-white">Social Sentiment</h4>
              <p className="text-xs text-gray-400">Based on 15.2K mentions</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Progress value={sentimentData.socialScore} className="flex-1 h-2 bg-white/10" />
            <span className="text-lg text-[#6b73ff]">{sentimentData.socialScore}%</span>
          </div>
        </div>
      </div>

      {/* Recent Insights */}
      <div className="space-y-3">
        <h4 className="text-sm text-gray-400">Recent Insights</h4>
        <InsightCard
          text="Strong institutional buying detected in the last 48 hours"
          sentiment="positive"
          timestamp="2 hours ago"
        />
        <InsightCard
          text="Quarterly earnings exceeded analyst expectations by 8%"
          sentiment="positive"
          timestamp="5 hours ago"
        />
        <InsightCard
          text="Minor profit-taking observed among retail investors"
          sentiment="neutral"
          timestamp="1 day ago"
        />
      </div>
    </div>
  );
}

function SentimentCard({
  icon,
  label,
  value,
  color,
  bgColor,
  borderColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  bgColor: string;
  borderColor: string;
}) {
  return (
    <div className={`p-4 rounded-xl ${bgColor} border ${borderColor}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={color}>{icon}</div>
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-2xl ${color}`}>{value}%</span>
        <Progress value={value} className="flex-1 h-1.5 bg-white/10" />
      </div>
    </div>
  );
}

function InsightCard({
  text,
  sentiment,
  timestamp,
}: {
  text: string;
  sentiment: "positive" | "negative" | "neutral";
}) {
  const colors = {
    positive: "border-[#00d4aa]/20 bg-[#00d4aa]/5",
    negative: "border-[#ff6b6b]/20 bg-[#ff6b6b]/5",
    neutral: "border-white/10 bg-white/5",
  };

  return (
    <div className={`p-4 rounded-lg border ${colors[sentiment]}`}>
      <p className="text-white text-sm mb-2">{text}</p>
      <p className="text-xs text-gray-400">{timestamp}</p>
    </div>
  );
}
