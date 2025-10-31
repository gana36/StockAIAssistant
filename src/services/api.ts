// =====================================================================
// API Service - Flask Backend Integration
// =====================================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// =====================================================================
// Type Definitions
// =====================================================================

export interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  change: number;
  percentChange: number;
}

export interface StockInfo {
  name: string;
  sector: string;
  industry: string;
  marketCap: number;
  beta: number | null;
  peRatio: number | null;
  dividendYield: number | null;
}

export interface StockDataResponse {
  data: StockData[];
  info: StockInfo;
  ticker: string;
}

export interface AnalysisResponse {
  result: string;
}

export interface FullAnalysisResponse {
  basic_summary?: string;
  sentiment_analysis: string;
  technical_analysis: string;
  quantitative_analysis: string;
  risk_assessment: string;
}

export interface ChartResponse {
  chart: any; // Plotly chart config
  ticker: string;
  type: string;
}

// =====================================================================
// API Functions
// =====================================================================

/**
 * Fetch stock data from yfinance
 */
export async function fetchStockData(ticker: string): Promise<StockDataResponse> {
  const response = await fetch(`${API_BASE_URL}/stock-data?ticker=${ticker.toUpperCase()}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch stock data');
  }

  return response.json();
}

/**
 * Fetch stock chart data
 */
export async function fetchStockChart(ticker: string, chartType: 'candlestick' | 'line' = 'candlestick'): Promise<ChartResponse> {
  const response = await fetch(`${API_BASE_URL}/stock-chart?ticker=${ticker.toUpperCase()}&type=${chartType}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch chart data');
  }

  return response.json();
}

/**
 * Run sentiment analysis
 */
export async function runSentimentAnalysis(ticker: string): Promise<AnalysisResponse> {
  const response = await fetch(`${API_BASE_URL}/sentiment-analysis`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ticker: ticker.toUpperCase() }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to run sentiment analysis');
  }

  return response.json();
}

/**
 * Run technical analysis
 */
export async function runTechnicalAnalysis(ticker: string): Promise<AnalysisResponse> {
  const response = await fetch(`${API_BASE_URL}/technical-analysis`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ticker: ticker.toUpperCase() }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to run technical analysis');
  }

  return response.json();
}

/**
 * Run quantitative analysis
 */
export async function runQuantitativeAnalysis(ticker: string): Promise<AnalysisResponse> {
  const response = await fetch(`${API_BASE_URL}/quantitative-analysis`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ticker: ticker.toUpperCase() }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to run quantitative analysis');
  }

  return response.json();
}

/**
 * Run risk assessment
 */
export async function runRiskAssessment(ticker: string): Promise<AnalysisResponse> {
  const response = await fetch(`${API_BASE_URL}/risk-analysis`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ticker: ticker.toUpperCase() }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to run risk assessment');
  }

  return response.json();
}

/**
 * Run full analysis (all 4 analyses)
 */
export async function runFullAnalysis(ticker: string): Promise<FullAnalysisResponse> {
  const response = await fetch(`${API_BASE_URL}/full-analysis`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ticker: ticker.toUpperCase() }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to run full analysis');
  }

  return response.json();
}

/**
 * Ask a question about a stock (Chat API)
 */
export async function askStockQuestion(
  ticker: string,
  question: string,
  preloadedAnalysis?: {
    sentiment?: string;
    technical?: string;
    quantitative?: string;
    risk?: string;
  }
): Promise<AnalysisResponse> {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ticker: ticker.toUpperCase(),
      question,
      preloadedAnalysis,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to analyze question');
  }

  return response.json();
}

/**
 * Health check
 */
export async function healthCheck(): Promise<{ status: string; message: string; version: string }> {
  const response = await fetch('http://localhost:5000/');

  if (!response.ok) {
    throw new Error('Backend is not running');
  }

  return response.json();
}
