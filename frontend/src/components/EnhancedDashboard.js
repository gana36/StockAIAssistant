import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Award, AlertTriangle, BarChart2, Calendar, Globe } from 'lucide-react';
import axios from 'axios';

const EnhancedDashboard = ({ ticker, data }) => {
  const [timeframe, setTimeframe] = useState('1month');
  const [sectorData, setSectorData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [keyMetrics, setKeyMetrics] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [marketEvents, setMarketEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Sample colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
  
  // Fetch additional data when ticker changes
  useEffect(() => {
    if (!ticker) return;
    
    setLoading(true);
    
    // For a real implementation, you would fetch this data from your backend
    // Here we're just simulating data for demonstration
    
    // Get some basic metrics from the price data
    const generateDashboardData = () => {
      try {
        // Calculate returns for different periods
        const calculateReturns = () => {
          if (!data || data.length < 30) return [];
          
          const latest = data[0];
          
          // Find data points at approximately 1M, 3M, 6M, and 1Y ago
          const oneMonthAgo = data.find(d => new Date(d.date) <= new Date(new Date(latest.date).setMonth(new Date(latest.date).getMonth() - 1))) || data[data.length - 1];
          const threeMonthAgo = data.find(d => new Date(d.date) <= new Date(new Date(latest.date).setMonth(new Date(latest.date).getMonth() - 3))) || data[data.length - 1];
          const sixMonthAgo = data.find(d => new Date(d.date) <= new Date(new Date(latest.date).setMonth(new Date(latest.date).getMonth() - 6))) || data[data.length - 1];
          
          const yearStartDate = new Date(new Date().getFullYear(), 0, 1);
          const ytdStartIndex = data.findIndex(d => new Date(d.date) <= yearStartDate);
          const ytdStart = ytdStartIndex >= 0 ? data[ytdStartIndex] : data[data.length - 1];
          
          // Calculate returns
          const oneMonthReturn = ((latest.close - oneMonthAgo.close) / oneMonthAgo.close) * 100;
          const threeMonthReturn = ((latest.close - threeMonthAgo.close) / threeMonthAgo.close) * 100;
          const sixMonthReturn = ((latest.close - sixMonthAgo.close) / sixMonthAgo.close) * 100;
          const ytdReturn = ((latest.close - ytdStart.close) / ytdStart.close) * 100;
          
          return [
            { name: '1M', value: parseFloat(oneMonthReturn.toFixed(2)) },
            { name: '3M', value: parseFloat(threeMonthReturn.toFixed(2)) },
            { name: '6M', value: parseFloat(sixMonthReturn.toFixed(2)) },
            { name: 'YTD', value: parseFloat(ytdReturn.toFixed(2)) }
          ];
        };
        
        // Generate sample sector data
        const generateSectorData = () => {
          if (ticker === 'GOOG' || ticker === 'GOOGL') {
            return [
              { name: 'Search Advertising', value: 58 },
              { name: 'Cloud Services', value: 22 },
              { name: 'YouTube', value: 12 },
              { name: 'Other', value: 8 }
            ];
          } else if (ticker === 'AAPL') {
            return [
              { name: 'iPhone', value: 52 },
              { name: 'Services', value: 21 },
              { name: 'Mac', value: 11 },
              { name: 'iPad', value: 9 },
              { name: 'Wearables', value: 7 }
            ];
          } else if (ticker === 'MSFT') {
            return [
              { name: 'Cloud', value: 42 },
              { name: 'Office', value: 33 },
              { name: 'Windows', value: 15 },
              { name: 'Gaming', value: 10 }
            ];
          } else {
            // Default sector data
            return [
              { name: 'Segment 1', value: 40 },
              { name: 'Segment 2', value: 30 },
              { name: 'Segment 3', value: 20 },
              { name: 'Other', value: 10 }
            ];
          }
        };
        
        // Generate key metrics
        const generateKeyMetrics = () => {
          // Calculate some metrics from the price data
          const latestPrice = data && data.length > 0 ? data[0].close : 0;
          const avgVolume = data && data.length > 0 
            ? Math.round(data.reduce((sum, item) => sum + item.volume, 0) / data.length) 
            : 0;
          
          // For demo purposes, calculate a rough market cap
          const marketCap = latestPrice * avgVolume * 0.001;
          const marketCapStr = marketCap > 1000 
            ? `$${(marketCap / 1000).toFixed(2)}T` 
            : `$${marketCap.toFixed(2)}B`;
            
          // Get PE ratio
          const peRatio = (latestPrice / (latestPrice * 0.04)).toFixed(2);
          
          return [
            { name: 'Last Price', value: `$${latestPrice.toFixed(2)}`, change: '+2.31', changePercent: '+1.2%' },
            { name: 'Market Cap', value: marketCapStr, change: '+15B', changePercent: '+0.8%' },
            { name: 'P/E Ratio', value: peRatio, change: '-0.3', changePercent: '-1.1%' },
            { name: 'Avg Volume', value: avgVolume.toLocaleString(), change: '+12.4M', changePercent: '+15.3%' }
          ];
        };
        
        // Generate sample news based on ticker
        const generateNews = () => {
          const date = new Date().toISOString().slice(0, 10);
          
          if (ticker === 'GOOG' || ticker === 'GOOGL') {
            return [
              { title: 'Google Announces New AI Services for Cloud Platform', date: date, sentiment: 'positive' },
              { title: 'Tech Giants Face New Regulatory Scrutiny in EU', date: date, sentiment: 'negative' },
              { title: 'Google Stock Upgraded by Major Analysts', date: date, sentiment: 'positive' }
            ];
          } else if (ticker === 'AAPL') {
            return [
              { title: 'Apple to Release New iPhone Models This Fall', date: date, sentiment: 'positive' },
              { title: 'Supply Chain Issues May Impact Apple Production', date: date, sentiment: 'negative' },
              { title: 'Apple Services Revenue Reaches New Record', date: date, sentiment: 'positive' }
            ];
          } else {
            return [
              { title: `${ticker} Reports Strong Quarterly Earnings`, date: date, sentiment: 'positive' },
              { title: `Analysts Raise Price Target for ${ticker}`, date: date, sentiment: 'positive' },
              { title: `${ticker} Announces Expansion into New Markets`, date: date, sentiment: 'positive' }
            ];
          }
        };
        
        // Generate events
        const generateEvents = () => {
          // Calculate dates relative to current date
          const today = new Date();
          const futureDate1 = new Date(today);
          futureDate1.setDate(today.getDate() + 12);
          const futureDate1Str = futureDate1.toISOString().slice(0, 10);
          
          const futureDate2 = new Date(today);
          futureDate2.setDate(today.getDate() + 25);
          const futureDate2Str = futureDate2.toISOString().slice(0, 10);
          
          const futureDate3 = new Date(today);
          futureDate3.setDate(today.getDate() + 45);
          const futureDate3Str = futureDate3.toISOString().slice(0, 10);
          
          return [
            { date: futureDate1Str, event: 'Quarterly Earnings Report', impact: 'high' },
            { date: futureDate2Str, event: 'Investor Conference', impact: 'medium' },
            { date: futureDate3Str, event: 'Dividend Payout', impact: 'medium' }
          ];
        };
        
        // Set state with generated data
        setPerformanceData(calculateReturns());
        setSectorData(generateSectorData());
        setKeyMetrics(generateKeyMetrics());
        setNewsItems(generateNews());
        setMarketEvents(generateEvents());
        setLoading(false);
      } catch (error) {
        console.error("Error generating dashboard data:", error);
        setLoading(false);
      }
    };
    
    generateDashboardData();
    
    // Cleanup function
    return () => {
      setPerformanceData([]);
      setSectorData([]);
      setKeyMetrics([]);
      setNewsItems([]);
      setMarketEvents([]);
    };
  }, [ticker, data]);
  
  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-center h-20">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-500 border-t-transparent" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Enhanced Dashboard for {ticker}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Performance Summary */}
        <div className="md:col-span-5 bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-medium text-gray-800">Performance Summary</h3>
            <div className="flex space-x-2">
              {['1month', '3months', '6months', 'ytd'].map((period) => (
                <button
                  key={period}
                  className={`px-2 py-1 text-xs rounded ${timeframe === period ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                  onClick={() => setTimeframe(period)}
                >
                  {period.replace('months', 'M').replace('month', 'M')}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(tick) => `${tick}%`} />
                <Tooltip formatter={(value) => [`${value}%`, 'Return']} />
                <Bar dataKey="value" fill="#4299e1">
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.value >= 0 ? '#38a169' : '#e53e3e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Sector Breakdown */}
        <div className="md:col-span-4 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-base font-medium text-gray-800 mb-4">Sector & Business Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Allocation']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Key Metrics */}
        <div className="md:col-span-3 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-base font-medium text-gray-800 mb-3">Key Metrics</h3>
          <div className="grid grid-cols-1 gap-3">
            {keyMetrics.map((metric) => (
              <div key={metric.name} className="border border-gray-200 rounded-md p-3 bg-white">
                <p className="text-sm text-gray-500">{metric.name}</p>
                <p className="text-lg font-semibold">{metric.value}</p>
                <p className={`text-xs ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change} ({metric.changePercent})
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Competitors Comparison */}
        <div className="md:col-span-4 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-base font-medium text-gray-800 mb-3">Competitors Comparison</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>P/E Ratio</span>
                <span>vs. Industry Avg</span>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="py-1">{ticker}</td>
                    <td className="py-1 text-right">25.8</td>
                    <td className="py-1 text-right text-red-600">+12%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-1">MSFT</td>
                    <td className="py-1 text-right">28.3</td>
                    <td className="py-1 text-right text-red-600">+23%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-1">AAPL</td>
                    <td className="py-1 text-right">24.1</td>
                    <td className="py-1 text-right text-red-600">+5%</td>
                  </tr>
                  <tr>
                    <td className="py-1">META</td>
                    <td className="py-1 text-right">22.9</td>
                    <td className="py-1 text-right text-green-600">-1%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Revenue Growth (YoY)</span>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="py-1">{ticker}</td>
                    <td className="py-1 text-right">12.8%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-1">MSFT</td>
                    <td className="py-1 text-right">14.2%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-1">AAPL</td>
                    <td className="py-1 text-right">8.3%</td>
                  </tr>
                  <tr>
                    <td className="py-1">META</td>
                    <td className="py-1 text-right">15.7%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* News & Events */}
        <div className="md:col-span-5 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-base font-medium text-gray-800 mb-3">News & Upcoming Events</h3>
          
          <h4 className="font-medium text-gray-700 mb-2 flex items-center text-sm">
            <Calendar className="w-4 h-4 mr-2" /> Upcoming Events
          </h4>
          <ul className="space-y-2 mb-4">
            {marketEvents.map((event) => (
              <li key={event.date} className="flex justify-between border-b pb-2">
                <div>
                  <p className="font-medium text-sm">{event.event}</p>
                  <p className="text-xs text-gray-500">{event.date}</p>
                </div>
                <div className={`px-2 py-1 rounded text-xs ${
                  event.impact === 'high' ? 'bg-red-100 text-red-800' :
                  event.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {event.impact.charAt(0).toUpperCase() + event.impact.slice(1)} Impact
                </div>
              </li>
            ))}
          </ul>
          
          <h4 className="font-medium text-gray-700 mb-2 flex items-center text-sm">
            <Globe className="w-4 h-4 mr-2" /> Recent News
          </h4>
          <ul className="space-y-2">
            {newsItems.map((news) => (
              <li key={news.title} className="border-b pb-2">
                <p className="font-medium text-sm">{news.title}</p>
                <div className="flex justify-between">
                  <p className="text-xs text-gray-500">{news.date}</p>
                  <p className={`text-xs ${
                    news.sentiment === 'positive' ? 'text-green-600' :
                    news.sentiment === 'negative' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {news.sentiment.charAt(0).toUpperCase() + news.sentiment.slice(1)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Risk Indicators */}
        <div className="md:col-span-3 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-base font-medium text-gray-800 mb-3 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" /> Risk Indicators
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Volatility (Beta)</span>
                <span className="text-sm font-medium">1.12</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: '56%' }}></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>Lower</span>
                <span>Higher</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">VaR (95%, 1-day)</span>
                <span className="text-sm font-medium">-2.4%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: '48%' }}></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>Lower</span>
                <span>Higher</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Liquidity</span>
                <span className="text-sm font-medium">Very High</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '90%' }}></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>Lower</span>
                <span>Higher</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Overall Risk Score</span>
                <span className="text-sm font-medium">Medium (6/10)</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;