import { useState } from "react";
import { Header } from "./components/Header";
import { StockInfoCard } from "./components/StockInfoCard";
import { AnalysisPanel } from "./components/AnalysisPanel";
import { AIChatSidebar } from "./components/AIChatSidebar";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Play } from "lucide-react";
import { fetchStockData, runFullAnalysis, type StockDataResponse, type FullAnalysisResponse } from "./services/api";

export default function App() {
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [stockData, setStockData] = useState<StockDataResponse | null>(null);
  const [analysisData, setAnalysisData] = useState<FullAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisInProgress, setAnalysisInProgress] = useState(false);

  const handleSearch = async (symbol: string) => {
    setIsLoading(true);
    setSelectedStock(symbol);

    try {
      // Fetch stock data from Flask backend
      const data = await fetchStockData(symbol);
      setStockData(data);
      toast.success(`Successfully loaded data for ${symbol}`, {
        description: `${data.info.name} - ${data.info.sector}`,
      });
    } catch (error) {
      console.error('Error fetching stock data:', error);
      toast.error('Failed to fetch stock data', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
      setSelectedStock(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunAnalysis = async () => {
    if (!selectedStock) return;

    setAnalysisInProgress(true);
    toast.info('Running comprehensive analysis...', {
      description: 'This may take up to 2 minutes',
    });

    try {
      // Run full analysis (sentiment, technical, quantitative, risk)
      const analysis = await runFullAnalysis(selectedStock);
      setAnalysisData(analysis);
      toast.success('Analysis completed!', {
        description: 'Check all tabs for detailed insights',
      });
    } catch (error) {
      console.error('Error running analysis:', error);
      toast.error('Failed to run analysis', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setAnalysisInProgress(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]">
      <Header onSearch={handleSearch} />
      
      <main className="container mx-auto px-4 py-6 max-w-[1440px]">
        {!selectedStock && !isLoading ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#4a9eff]/20 to-[#6b73ff]/20 flex items-center justify-center mb-6">
              <Play className="w-12 h-12 text-[#4a9eff]" />
            </div>
            <h2 className="text-3xl mb-4 text-white">Start Your Analysis</h2>
            <p className="text-gray-400 max-w-md mb-8">
              Search for a stock symbol above to begin comprehensive market analysis with AI-powered insights
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <StockInfoCard
                symbol={selectedStock}
                stockData={stockData}
                isLoading={isLoading}
              />
              <AnalysisPanel
                analysisData={analysisData}
                isLoading={isLoading}
              />
            </div>

            {/* Right Sidebar */}
            <AIChatSidebar
              selectedStock={selectedStock}
              analysisData={analysisData}
              onRunAnalysis={handleRunAnalysis}
              analysisInProgress={analysisInProgress}
            />
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      {selectedStock && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleRunAnalysis}
          className="fixed bottom-8 right-8 lg:hidden w-16 h-16 rounded-full bg-gradient-to-r from-[#4a9eff] to-[#6b73ff] text-white shadow-lg shadow-[#4a9eff]/50 flex items-center justify-center"
        >
          <Play className="w-6 h-6" />
        </motion.button>
      )}

      <Toaster />
    </div>
  );
}
