import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

const mockData = [
  { date: "Oct 24", price: 172.5, volume: 45000000 },
  { date: "Oct 25", price: 174.2, volume: 52000000 },
  { date: "Oct 26", price: 173.8, volume: 48000000 },
  { date: "Oct 27", price: 175.6, volume: 51000000 },
  { date: "Oct 28", price: 176.4, volume: 49000000 },
  { date: "Oct 29", price: 177.2, volume: 53000000 },
  { date: "Oct 30", price: 176.8, volume: 50000000 },
  { date: "Oct 31", price: 178.45, volume: 54000000 },
];

export function ChartTab() {
  return (
    <div className="space-y-6">
      {/* Price Chart */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        <h3 className="text-sm text-gray-400 mb-4">Price Movement (7 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={mockData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4a9eff" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4a9eff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis
              dataKey="date"
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
            />
            <YAxis
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              domain={['dataMin - 1', 'dataMax + 1']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(26, 31, 58, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#4a9eff"
              strokeWidth={2}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Volume Chart */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        <h3 className="text-sm text-gray-400 mb-4">Volume (7 Days)</h3>
        <ResponsiveContainer width="100%" height={150}>
          <AreaChart data={mockData}>
            <defs>
              <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6b73ff" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6b73ff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis
              dataKey="date"
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
            />
            <YAxis
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(26, 31, 58, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Area
              type="monotone"
              dataKey="volume"
              stroke="#6b73ff"
              strokeWidth={2}
              fill="url(#colorVolume)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
