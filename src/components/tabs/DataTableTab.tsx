import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { TrendingUp, TrendingDown } from "lucide-react";

const mockData = [
  { date: "2024-10-31", open: 177.2, high: 179.1, low: 176.8, close: 178.45, volume: "54.2M", change: 1.25 },
  { date: "2024-10-30", open: 176.8, high: 178.2, low: 175.9, close: 177.2, volume: "50.1M", change: 0.4 },
  { date: "2024-10-29", open: 176.4, high: 177.8, low: 175.2, close: 176.8, volume: "53.4M", change: -0.6 },
  { date: "2024-10-28", open: 175.6, high: 177.2, low: 175.1, close: 176.4, volume: "49.8M", change: 0.8 },
  { date: "2024-10-27", open: 173.8, high: 176.4, low: 173.5, close: 175.6, volume: "51.2M", change: 1.8 },
  { date: "2024-10-26", open: 174.2, high: 175.1, low: 172.8, close: 173.8, volume: "48.3M", change: -0.4 },
  { date: "2024-10-25", open: 172.5, high: 175.0, low: 172.1, close: 174.2, volume: "52.0M", change: 1.7 },
];

export function DataTableTab() {
  return (
    <div className="rounded-xl overflow-hidden border border-white/10">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableHead className="text-gray-400">Date</TableHead>
            <TableHead className="text-gray-400">Open</TableHead>
            <TableHead className="text-gray-400">High</TableHead>
            <TableHead className="text-gray-400">Low</TableHead>
            <TableHead className="text-gray-400">Close</TableHead>
            <TableHead className="text-gray-400">Volume</TableHead>
            <TableHead className="text-gray-400">Change</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockData.map((row, index) => (
            <TableRow
              key={index}
              className="border-white/10 hover:bg-white/5 transition-colors"
            >
              <TableCell className="text-white">{row.date}</TableCell>
              <TableCell className="text-white">${row.open.toFixed(2)}</TableCell>
              <TableCell className="text-white">${row.high.toFixed(2)}</TableCell>
              <TableCell className="text-white">${row.low.toFixed(2)}</TableCell>
              <TableCell className="text-white">${row.close.toFixed(2)}</TableCell>
              <TableCell className="text-white">{row.volume}</TableCell>
              <TableCell>
                <div className={`flex items-center gap-1 ${
                  row.change >= 0 ? 'text-[#00d4aa]' : 'text-[#ff6b6b]'
                }`}>
                  {row.change >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{row.change >= 0 ? '+' : ''}{row.change.toFixed(2)}%</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
