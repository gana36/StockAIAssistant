import { useState, useRef, useEffect } from "react";
import { Send, CheckCircle2, Clock, Play, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Progress } from "./ui/progress";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "sonner";
import { askStockQuestion, type FullAnalysisResponse } from "../services/api";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
}

interface AIChatSidebarProps {
  selectedStock: string | null;
  analysisData: FullAnalysisResponse | null;
  onRunAnalysis: () => void;
  analysisInProgress: boolean;
}

export function AIChatSidebar({
  selectedStock,
  analysisData,
  onRunAnalysis,
  analysisInProgress,
}: AIChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI stock analyst. Search for a stock above, then ask me questions about it. I can help with analysis, insights, and investment decisions.",
      sender: "ai",
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    if (!selectedStock) {
      toast.error("Please select a stock first", {
        description: "Search for a stock symbol to start chatting",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // Call Flask backend chat API
      const response = await askStockQuestion(
        selectedStock,
        input,
        analysisData
          ? {
              sentiment: analysisData.sentiment_analysis,
              technical: analysisData.technical_analysis,
              quantitative: analysisData.quantitative_analysis,
              risk: analysisData.risk_assessment,
            }
          : undefined
      );

      const aiMessage: Message = {
        id: Date.now() + 1,
        text: response.result,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error asking question:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Sorry, I encountered an error processing your question. Please try again.",
        sender: "ai",
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast.error("Failed to get response", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="space-y-6 h-full">
      {/* AI Chat */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden flex flex-col h-[500px]"
      >
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4a9eff] to-[#6b73ff] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white">AI Assistant</h3>
            <p className="text-xs text-gray-400">Always here to help</p>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div ref={scrollRef} className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-[#4a9eff] to-[#6b73ff] text-white rounded-tr-none"
                        : "bg-white/10 backdrop-blur-xl text-white rounded-tl-none border border-white/10"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="max-w-[85%] p-3 rounded-2xl bg-white/10 backdrop-blur-xl text-white rounded-tl-none border border-white/10">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-white/10">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !isTyping && handleSend()}
              placeholder={selectedStock ? "Ask a question..." : "Select a stock first..."}
              disabled={!selectedStock || isTyping}
              className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4a9eff]/50 focus:border-[#4a9eff] transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <motion.button
              whileHover={{ scale: !selectedStock || isTyping ? 1 : 1.05 }}
              whileTap={{ scale: !selectedStock || isTyping ? 1 : 0.95 }}
              onClick={handleSend}
              disabled={!selectedStock || isTyping}
              className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#4a9eff] to-[#6b73ff] flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
      >
        <h3 className="text-white mb-4">Quick Actions</h3>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRunAnalysis}
          disabled={analysisInProgress}
          className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-[#4a9eff] to-[#6b73ff] text-white flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#4a9eff]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4" />
          {analysisInProgress ? "Running Analysis..." : "Run Full Analysis"}
        </motion.button>

        {analysisInProgress && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 space-y-2"
          >
            <Progress value={60} className="h-2 bg-white/10" />
            <p className="text-xs text-gray-400 text-center">Analyzing data...</p>
          </motion.div>
        )}
      </motion.div>

      {/* Analysis Status */}
      {selectedStock && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
        >
          <h3 className="text-white mb-4">Analysis Status</h3>
          <div className="space-y-3">
            <StatusItem
              label="Sentiment Analysis"
              status={
                analysisInProgress
                  ? "running"
                  : analysisData?.sentiment_analysis
                  ? "completed"
                  : "pending"
              }
            />
            <StatusItem
              label="Technical Analysis"
              status={
                analysisInProgress
                  ? "running"
                  : analysisData?.technical_analysis
                  ? "completed"
                  : "pending"
              }
            />
            <StatusItem
              label="Quantitative Analysis"
              status={
                analysisInProgress
                  ? "running"
                  : analysisData?.quantitative_analysis
                  ? "completed"
                  : "pending"
              }
            />
            <StatusItem
              label="Risk Assessment"
              status={
                analysisInProgress
                  ? "running"
                  : analysisData?.risk_assessment
                  ? "completed"
                  : "pending"
              }
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}

function StatusItem({ label, status }: { label: string; status: "completed" | "pending" | "running" }) {
  const icons = {
    completed: <CheckCircle2 className="w-4 h-4 text-[#00d4aa]" />,
    pending: <Clock className="w-4 h-4 text-gray-400" />,
    running: (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Clock className="w-4 h-4 text-[#4a9eff]" />
      </motion.div>
    ),
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
      <span className="text-sm text-white">{label}</span>
      {icons[status]}
    </div>
  );
}
