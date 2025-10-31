
# =====================================================================
# main.py - Test Script (Optional)
# =====================================================================

import yfinance as yf
import io
from crewai import Agent, Task, Crew, Process
from crewai_tools import CodeInterpreterTool
from dotenv import load_dotenv

load_dotenv()

def test_stock_data():
    """Test function to verify yfinance integration"""
    ticker = "AAPL"
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(period="1y")
        df = hist.reset_index()
        print(f"Successfully fetched {len(df)} days of data for {ticker}")
        print(f"Latest close price: ${df.iloc[-1]['Close']:.2f}")
        return True
    except Exception as e:
        print(f"Error fetching stock data: {e}")
        return False

def test_crew_creation():
    """Test function to verify crew creation"""
    try:
        from crew_handlers import create_sentiment_crew
        crew = create_sentiment_crew()
        print("Successfully created sentiment analysis crew")
        return True
    except Exception as e:
        print(f"Error creating crew: {e}")
        return False

if __name__ == "__main__":
    print("Testing Stock Analyzer Backend Components...")
    print("-" * 50)
    
    print("1. Testing stock data fetching...")
    stock_test = test_stock_data()
    
    print("\n2. Testing crew creation...")
    crew_test = test_crew_creation()
    
    print("-" * 50)
    if stock_test and crew_test:
        print("✅ All tests passed! Backend is ready to run.")
    else:
        print("❌ Some tests failed. Check your configuration.")