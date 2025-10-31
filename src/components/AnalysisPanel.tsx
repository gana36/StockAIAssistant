import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ChartTab } from "./tabs/ChartTab";
import { DataTableTab } from "./tabs/DataTableTab";
import { SentimentTab } from "./tabs/SentimentTab";
import { TechnicalTab } from "./tabs/TechnicalTab";
import { QuantitativeTab } from "./tabs/QuantitativeTab";
import { RiskTab } from "./tabs/RiskTab";
import { Skeleton } from "./ui/skeleton";
import { motion } from "motion/react";
import type { FullAnalysisResponse } from "../services/api";

interface AnalysisPanelProps {
  analysisData: FullAnalysisResponse | null;
  isLoading: boolean;
}

export function AnalysisPanel({ analysisData, isLoading }: AnalysisPanelProps) {
  const [activeTab, setActiveTab] = useState("chart");

  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
        <div className="flex gap-4 mb-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 bg-white/10" />
          ))}
        </div>
        <Skeleton className="h-[400px] w-full bg-white/10" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b border-white/10 px-6 pt-6">
          <TabsList className="bg-transparent border-b-0 h-auto p-0 w-full justify-start gap-1">
            <TabsTrigger
              value="chart"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#4a9eff] rounded-none pb-3 text-gray-400 data-[state=active]:text-white"
            >
              Chart
            </TabsTrigger>
            <TabsTrigger
              value="data"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#4a9eff] rounded-none pb-3 text-gray-400 data-[state=active]:text-white"
            >
              Data Table
            </TabsTrigger>
            <TabsTrigger
              value="sentiment"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#4a9eff] rounded-none pb-3 text-gray-400 data-[state=active]:text-white"
            >
              Sentiment
            </TabsTrigger>
            <TabsTrigger
              value="technical"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#4a9eff] rounded-none pb-3 text-gray-400 data-[state=active]:text-white"
            >
              Technical
            </TabsTrigger>
            <TabsTrigger
              value="quantitative"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#4a9eff] rounded-none pb-3 text-gray-400 data-[state=active]:text-white hidden md:inline-flex"
            >
              Quantitative
            </TabsTrigger>
            <TabsTrigger
              value="risk"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#4a9eff] rounded-none pb-3 text-gray-400 data-[state=active]:text-white hidden md:inline-flex"
            >
              Risk
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-6">
          <TabsContent value="chart" className="mt-0">
            <ChartTab />
          </TabsContent>
          <TabsContent value="data" className="mt-0">
            <DataTableTab />
          </TabsContent>
          <TabsContent value="sentiment" className="mt-0">
            <SentimentTab analysis={analysisData?.sentiment_analysis} />
          </TabsContent>
          <TabsContent value="technical" className="mt-0">
            <TechnicalTab analysis={analysisData?.technical_analysis} />
          </TabsContent>
          <TabsContent value="quantitative" className="mt-0">
            <QuantitativeTab analysis={analysisData?.quantitative_analysis} />
          </TabsContent>
          <TabsContent value="risk" className="mt-0">
            <RiskTab analysis={analysisData?.risk_assessment} />
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
}
