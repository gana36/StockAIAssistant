import { useState } from "react";
import { Search, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner@2.0.3";

interface HeaderProps {
  onSearch: (symbol: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const [searchValue, setSearchValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue.toUpperCase());
      toast.success(`Searching for ${searchValue.toUpperCase()}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0e27]/80 border-b border-white/5">
      <div className="container mx-auto px-4 h-[60px] flex items-center justify-between max-w-[1440px]">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4a9eff] to-[#6b73ff] flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl text-white hidden sm:inline">StockAI</span>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="flex items-center gap-3 flex-1 max-w-[400px] mx-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search stock symbol..."
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4a9eff]/50 focus:border-[#4a9eff] transition-all"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="h-10 px-6 rounded-lg bg-gradient-to-r from-[#4a9eff] to-[#6b73ff] text-white hover:shadow-lg hover:shadow-[#4a9eff]/30 transition-all"
          >
            Search
          </motion.button>
        </form>

        {/* Placeholder for future actions */}
        <div className="w-10 hidden sm:block"></div>
      </div>
    </header>
  );
}
