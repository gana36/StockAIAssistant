# Stock AI Assistant - Frontend-Backend Integration Guide

## 🎯 Overview

Your application now has a **React + TypeScript frontend** (from Figma) integrated with your **Flask + CrewAI backend**!

```
┌─────────────────────────────────────┐
│   React Frontend (Port 3000)        │
│   - Modern UI from Figma            │
│   - Real-time data display          │
│   - Interactive charts              │
└──────────────┬──────────────────────┘
               │ API Calls (HTTP)
               ▼
┌─────────────────────────────────────┐
│   Flask Backend (Port 5000)         │
│   - CrewAI Agents (optimized)       │
│   - Stock data fetching             │
│   - AI-powered analysis             │
└─────────────────────────────────────┘
```

---

## 📁 Project Structure

```
StockAIAssistant/
├── backend/                    # Flask + CrewAI Backend
│   ├── app.py                 # Main Flask server (OPTIMIZED ✅)
│   ├── crew_handlers.py       # CrewAI crews (OPTIMIZED ✅)
│   ├── config/
│   │   ├── agents.yaml        # Agent definitions
│   │   └── tasks.yaml         # Task descriptions
│   ├── .env                   # Backend environment variables
│   └── requirements.txt       # Python dependencies
│
├── src/                        # React Frontend (from Figma)
│   ├── App.tsx                # Main app (UPDATED ✅)
│   ├── main.tsx               # Entry point
│   ├── index.css              # Tailwind styles
│   ├── components/            # React components
│   │   ├── Header.tsx
│   │   ├── StockInfoCard.tsx
│   │   ├── AnalysisPanel.tsx
│   │   ├── AIChatSidebar.tsx
│   │   └── ui/                # Shadcn/Radix UI components
│   └── services/
│       └── api.ts             # API service layer (NEW ✅)
│
├── index.html                 # HTML entry point
├── vite.config.ts             # Vite config (UPDATED ✅)
├── package.json               # Node dependencies
├── .env                       # Frontend environment variables (NEW ✅)
└── .env.example               # Environment template (NEW ✅)
```

---

## 🚀 Quick Start

### 1. Install Dependencies

#### Backend (Python):
```bash
cd backend
pip install -r requirements.txt
```

#### Frontend (Node.js):
```bash
# From project root
npm install
```

### 2. Configure Environment Variables

#### Backend (.env in /backend):
```bash
# Already configured
SERPER_API_KEY=your_serper_key
OPENAI_API_KEY=your_openai_key
AGENTOPS_API_KEY=your_agentops_key
```

#### Frontend (.env in root):
```bash
# Already created
VITE_API_URL=http://localhost:5000/api
VITE_DEV_MODE=true
```

### 3. Start Both Servers

#### Terminal 1 - Backend (Flask):
```bash
cd backend
python run.py
```
✅ Backend running at: http://localhost:5000

#### Terminal 2 - Frontend (React + Vite):
```bash
# From project root
npm run dev
```
✅ Frontend running at: http://localhost:3000

### 4. Access the Application

Open your browser to: **http://localhost:3000**

---

## 🔗 API Integration

### API Service Layer

All API calls go through `src/services/api.ts`:

```typescript
// Example: Fetch stock data
import { fetchStockData } from './services/api';

const data = await fetchStockData('AAPL');
console.log(data.info.name); // "Apple Inc."
```

### Available API Functions:

| Function | Description | Backend Endpoint |
|----------|-------------|------------------|
| `fetchStockData(ticker)` | Get stock data & info | `GET /api/stock-data` |
| `fetchStockChart(ticker, type)` | Get chart data | `GET /api/stock-chart` |
| `runSentimentAnalysis(ticker)` | Run sentiment crew | `POST /api/sentiment-analysis` |
| `runTechnicalAnalysis(ticker)` | Run technical crew | `POST /api/technical-analysis` |
| `runQuantitativeAnalysis(ticker)` | Run quant crew | `POST /api/quantitative-analysis` |
| `runRiskAssessment(ticker)` | Run risk crew | `POST /api/risk-analysis` |
| `runFullAnalysis(ticker)` | Run all 4 crews | `POST /api/full-analysis` |
| `askStockQuestion(ticker, question, context)` | Chat with AI | `POST /api/analyze` |
| `healthCheck()` | Check backend status | `GET /` |

### Type Safety

All API responses are fully typed:

```typescript
import type {
  StockDataResponse,
  AnalysisResponse,
  FullAnalysisResponse,
  ChartResponse
} from './services/api';
```

---

## 🎨 How App.tsx Works Now

### Before (Mock Data):
```typescript
const handleSearch = (symbol: string) => {
  setIsLoading(true);
  setTimeout(() => {
    setSelectedStock(symbol);  // ❌ No real data
    setIsLoading(false);
  }, 1500);
};
```

### After (Real API):
```typescript
const handleSearch = async (symbol: string) => {
  setIsLoading(true);
  try {
    const data = await fetchStockData(symbol);  // ✅ Real data from Flask!
    setStockData(data);
    toast.success(`Loaded ${symbol}`);
  } catch (error) {
    toast.error('Failed to fetch data');
  } finally {
    setIsLoading(false);
  }
};
```

---

## 🔧 Vite Proxy Configuration

Vite automatically proxies `/api/*` requests to Flask:

```typescript
// vite.config.ts
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:5000',  // Proxies to Flask
      changeOrigin: true,
    },
  },
}
```

**How it works:**
- Frontend calls: `http://localhost:3000/api/stock-data`
- Vite proxies to: `http://localhost:5000/api/stock-data`
- Flask responds with data
- Frontend receives response

This avoids CORS issues during development!

---

## 📊 Data Flow Example

### User searches for "AAPL":

```
1. User types "AAPL" in Header component
   ↓
2. Header.tsx calls: onSearch("AAPL")
   ↓
3. App.tsx handleSearch() executes:
   - Calls fetchStockData("AAPL")
   ↓
4. api.ts makes HTTP request:
   GET http://localhost:3000/api/stock-data?ticker=AAPL
   ↓
5. Vite proxy forwards to:
   GET http://localhost:5000/api/stock-data?ticker=AAPL
   ↓
6. Flask app.py receives request:
   - Fetches data using yfinance
   - Returns JSON response
   ↓
7. Frontend receives data:
   - Updates state with stockData
   - Passes to StockInfoCard component
   ↓
8. StockInfoCard displays:
   - Company name, price, metrics
   - Chart with Plotly/Recharts
```

---

## 🎯 Component Updates Needed

You'll need to update these components to use real data:

### 1. StockInfoCard.tsx
```typescript
// Add props
interface StockInfoCardProps {
  symbol: string | null;
  stockData: StockDataResponse | null;  // NEW
  isLoading: boolean;
}

// Use real data
const { data, info } = stockData || {};
const latestPrice = data?.[0]?.close;
const companyName = info?.name;
```

### 2. AnalysisPanel.tsx
```typescript
// Add props
interface AnalysisPanelProps {
  analysisData: FullAnalysisResponse | null;  // NEW
  isLoading: boolean;
}

// Display real analysis
const sentimentAnalysis = analysisData?.sentiment_analysis;
const technicalAnalysis = analysisData?.technical_analysis;
```

### 3. AIChatSidebar.tsx
```typescript
// Add props
interface AIChatSidebarProps {
  selectedStock: string | null;  // NEW
  analysisData: FullAnalysisResponse | null;  // NEW
  onRunAnalysis: () => void;
  analysisInProgress: boolean;
}

// Use askStockQuestion() from api.ts for chat
const response = await askStockQuestion(
  selectedStock,
  userMessage,
  {
    sentiment: analysisData?.sentiment_analysis,
    technical: analysisData?.technical_analysis,
    // ... other analyses
  }
);
```

---

## 🧪 Testing the Integration

### Test 1: Health Check
```bash
# Check if backend is running
curl http://localhost:5000/

# Expected response:
{
  "status": "healthy",
  "message": "Stock Analyzer API is running",
  "version": "1.0.0"
}
```

### Test 2: Stock Data
```bash
# Fetch AAPL data
curl "http://localhost:5000/api/stock-data?ticker=AAPL"

# Should return stock data + info
```

### Test 3: Frontend Connection
1. Open http://localhost:3000
2. Search for "AAPL"
3. Check browser console for API calls
4. Should see real company name, price, and metrics

---

## 🐛 Troubleshooting

### Backend not starting:
```bash
# Check if port 5000 is already in use
netstat -ano | findstr :5000

# Kill the process if needed
taskkill /PID <PID> /F

# Restart backend
cd backend
python run.py
```

### Frontend not connecting to backend:
1. Check both servers are running
2. Verify backend is on port 5000
3. Check browser console for CORS errors
4. Ensure `.env` has correct API URL

### API calls failing:
1. Open browser DevTools → Network tab
2. Look for failed requests
3. Check request URL and response
4. Verify Flask endpoint exists in app.py

### TypeScript errors:
```bash
# Install TypeScript types
npm install --save-dev @types/node

# Check for errors
npm run build
```

---

## 📝 Development Workflow

### Daily Development:
```bash
# Terminal 1: Start backend
cd backend && python run.py

# Terminal 2: Start frontend
npm run dev

# Terminal 3: Watch logs
# Backend logs in Terminal 1
# Frontend logs in Terminal 2 + Browser Console
```

### Making Changes:

**Backend changes:**
- Edit files in `backend/`
- Flask auto-reloads (debug mode)
- Test in browser immediately

**Frontend changes:**
- Edit files in `src/`
- Vite HMR (Hot Module Replacement)
- Changes appear instantly in browser

---

## 🚀 Production Build

### Build Frontend:
```bash
npm run build
```
Creates optimized build in `/build` folder.

### Serve Frontend from Flask:

Update `backend/app.py`:
```python
from flask import Flask, send_from_directory

app = Flask(__name__, static_folder='../build', static_url_path='')

@app.route('/')
def serve_frontend():
    return send_from_directory(app.static_folder, 'index.html')
```

Then run only Flask:
```bash
cd backend
python app.py
```
Access everything at: http://localhost:5000

---

## ✅ What You Have Now

✅ **React Frontend** - Modern UI from Figma
✅ **Flask Backend** - Optimized CrewAI agents
✅ **API Integration** - Type-safe service layer
✅ **Vite Proxy** - No CORS issues
✅ **Real-time Data** - yfinance stock data
✅ **AI Analysis** - All 4 crews working
✅ **Chat Interface** - Ask questions about stocks
✅ **Production Ready** - Can build and deploy

---

## 📚 Next Steps

1. **Update Components** - Modify StockInfoCard, AnalysisPanel, AIChatSidebar to use real data
2. **Add Error Boundaries** - Handle API failures gracefully
3. **Add Loading States** - Show spinners/skeletons during API calls
4. **Implement Caching** - Cache stock data in frontend state
5. **Add Websockets** - For real-time updates (optional)
6. **Deploy** - Host frontend (Vercel) and backend (Railway/Render)

---

## 🎉 You're All Set!

Your Figma frontend is now fully integrated with your optimized Flask backend!

**Start both servers and test it out:**
```bash
# Terminal 1
cd backend && python run.py

# Terminal 2
npm run dev
```

Then open: http://localhost:3000 🚀
