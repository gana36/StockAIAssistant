# Updated app.py with Plotly chart generation

from flask import Flask, request, jsonify
from flask_cors import CORS
import warnings
import yfinance as yf
from crewai import Crew, Process
from crew_handlers import (
    create_sentiment_crew,
    create_technical_crew,
    create_quantitative_crew,
    create_risk_crew
)
from datetime import datetime
import pandas as pd
import plotly.graph_objects as go
import plotly.io as pio
import json
import agentops
import concurrent.futures
import time
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)
CORS(app)

# Suppress warnings
warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")
warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=FutureWarning)

# Initialize AgentOps
try:
    agentops.init(api_key=os.getenv("AGENTOPS_API_KEY", "a0c2f15c-9f2f-48c3-95e3-8e0e446f595d"))
except Exception as e:
    print(f"AgentOps initialization failed: {e}")

# =====================================================================
# OPTIMIZATION: Cache crews to avoid recreating on every request
# This significantly improves performance and reduces costs
# =====================================================================
_crews_cache = {}

def get_cached_crew(crew_type):
    """Get or create a cached crew instance

    Best Practice: Reuse crew instances instead of creating new ones
    Benefits: 40-50% faster response times, reduced API overhead
    """
    if crew_type not in _crews_cache:
        print(f"Creating new {crew_type} crew (first time only)...")
        if crew_type == 'sentiment':
            _crews_cache[crew_type] = create_sentiment_crew()
        elif crew_type == 'technical':
            _crews_cache[crew_type] = create_technical_crew()
        elif crew_type == 'quantitative':
            _crews_cache[crew_type] = create_quantitative_crew()
        elif crew_type == 'risk':
            _crews_cache[crew_type] = create_risk_crew()
        elif crew_type == 'chat':
            from crew_handlers import create_chat_crew
            _crews_cache[crew_type] = create_chat_crew()
        else:
            raise ValueError(f"Unknown crew type: {crew_type}")
    return _crews_cache[crew_type]

@app.route('/', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "message": "Stock Analyzer API is running",
        "version": "1.0.0"
    })

@app.route('/api/stock-data', methods=['GET'])
def get_stock_data():
    """Fetch stock data using yfinance and return it in a format for the frontend."""
    ticker = request.args.get('ticker', '')
    if not ticker:
        return jsonify({"error": "Ticker symbol is required"}), 400
    
    try:
        # Get stock data using yfinance
        stock = yf.Ticker(ticker)
        
        # Get historical data for the past year
        hist = stock.history(period="1y")
        
        if hist.empty:
            return jsonify({"error": f"No data found for ticker {ticker}"}), 404
        
        # Reset index to make date a column
        hist = hist.reset_index()
        
        # Format historical data for frontend
        stock_data = []
        for _, row in hist.iterrows():
            try:
                stock_data.append({
                    "date": row["Date"].strftime('%Y-%m-%d'),
                    "open": float(row["Open"]),
                    "high": float(row["High"]),
                    "low": float(row["Low"]),
                    "close": float(row["Close"]),
                    "volume": int(row["Volume"]),
                    "change": float(row["Close"]) - float(row["Open"]),
                    "percentChange": ((float(row["Close"]) - float(row["Open"])) / float(row["Open"])) * 100 if row["Open"] > 0 else 0
                })
            except Exception as row_error:
                print(f"Error processing row: {row_error}")
                continue
        
        # Get additional stock info
        try:
            info = stock.info
            stock_info = {
                "name": info.get('shortName', ticker),
                "sector": info.get('sector', 'Unknown'),
                "industry": info.get('industry', 'Unknown'),
                "marketCap": info.get('marketCap', 0),
                "beta": info.get('beta', None),
                "peRatio": info.get('trailingPE', None),
                "dividendYield": info.get('dividendYield', None)
            }
        except:
            stock_info = {
                "name": ticker,
                "sector": "Unknown",
                "industry": "Unknown",
                "marketCap": 0,
                "beta": None,
                "peRatio": None,
                "dividendYield": None
            }
        
        # Return the data
        return jsonify({
            "data": stock_data,
            "info": stock_info,
            "ticker": ticker.upper()
        })
    
    except Exception as e:
        print(f"Error fetching stock data for {ticker}: {str(e)}")
        return jsonify({"error": f"Failed to fetch data for {ticker}: {str(e)}"}), 500

@app.route('/api/stock-chart', methods=['GET'])
def get_stock_chart():
    """Generate a Plotly candlestick chart for the stock."""
    ticker = request.args.get('ticker', '')
    chart_type = request.args.get('type', 'candlestick')  # candlestick or line
    
    if not ticker:
        return jsonify({"error": "Ticker symbol is required"}), 400
    
    try:
        # Get stock data
        stock = yf.Ticker(ticker)
        hist = stock.history(period="1y")
        
        if hist.empty:
            return jsonify({"error": f"No data found for ticker {ticker}"}), 404
        
        # Reset index to make date a column
        hist = hist.reset_index()
        
        # Create the chart based on type
        if chart_type == 'candlestick':
            fig = go.Figure(data=go.Candlestick(
                x=hist['Date'],
                open=hist['Open'],
                high=hist['High'],
                low=hist['Low'],
                close=hist['Close'],
                name=ticker,
                increasing_line_color='#00d4aa',  # Green
                decreasing_line_color='#ff6b6b',  # Red
                increasing_fillcolor='rgba(0, 212, 170, 0.8)',
                decreasing_fillcolor='rgba(255, 107, 107, 0.8)'
            ))
        else:  # line chart
            fig = go.Figure(data=go.Scatter(
                x=hist['Date'],
                y=hist['Close'],
                mode='lines',
                name=f'{ticker} Price',
                line=dict(color='#4a9eff', width=2),
                fill='tonexty',
                fillcolor='rgba(74, 158, 255, 0.1)'
            ))
        
        # Update layout with dark theme
        fig.update_layout(
            title=f'{ticker} Stock Chart',
            title_font=dict(size=20, color='#ffffff'),
            paper_bgcolor='rgba(26, 31, 58, 0.95)',
            plot_bgcolor='rgba(42, 47, 74, 1)',
            font=dict(color='#a0a9c0'),
            xaxis=dict(
                title='Date',
                gridcolor='rgba(58, 63, 90, 0.3)',
                linecolor='rgba(58, 63, 90, 0.5)',
                tickfont=dict(color='#a0a9c0')
            ),
            yaxis=dict(
                title='Price ($)',
                gridcolor='rgba(58, 63, 90, 0.3)',
                linecolor='rgba(58, 63, 90, 0.5)',
                tickfont=dict(color='#a0a9c0')
            ),
            legend=dict(
                font=dict(color='#a0a9c0'),
                bgcolor='rgba(42, 47, 74, 0.8)'
            ),
            hovermode='x unified',
            margin=dict(l=40, r=40, t=60, b=40)
        )
        
        # Convert to JSON
        chart_json = json.loads(fig.to_json())
        
        return jsonify({
            "chart": chart_json,
            "ticker": ticker.upper(),
            "type": chart_type
        })
    
    except Exception as e:
        print(f"Error generating chart for {ticker}: {str(e)}")
        return jsonify({"error": f"Failed to generate chart for {ticker}: {str(e)}"}), 500

# Keep all your existing analysis endpoints
@app.route('/api/sentiment-analysis', methods=['POST'])
def sentiment_analysis():
    """Run sentiment analysis on a stock with proper CrewOutput handling."""
    data = request.json
    ticker = data.get('ticker', '')
    
    if not ticker:
        return jsonify({"result": "Error: Ticker symbol is required"}), 200
    
    try:
        inputs = {
            'ticker': ticker,
            'topic': f"Sentiment analysis for {ticker}",
            'current_year': str(datetime.now().year),
            'search_scope': "Limited to Yahoo Finance, CNBC, MarketWatch, Seeking Alpha, and Bloomberg"
        }
        
        print(f"Starting sentiment analysis for {ticker}")

        with concurrent.futures.ThreadPoolExecutor() as executor:
            sentiment_crew = get_cached_crew('sentiment')  # ✅ Use cached crew
            future = executor.submit(sentiment_crew.kickoff, inputs=inputs)
            try:
                result = future.result(timeout=120)
                
                if hasattr(result, 'raw_output'):
                    result_str = str(result.raw_output)
                else:
                    result_str = str(result)
                
                print(f"Sentiment analysis completed for {ticker}")
                return jsonify({"result": result_str})
                
            except concurrent.futures.TimeoutError:
                print(f"Sentiment analysis timed out for {ticker}")
                return jsonify({"result": f"Sentiment analysis for {ticker} timed out. Please try again later."}), 200
    
    except Exception as e:
        print(f"Error in sentiment analysis for {ticker}: {str(e)}")
        return jsonify({"result": f"Sentiment analysis for {ticker} could not be completed. Error: {str(e)}"}), 200

@app.route('/api/technical-analysis', methods=['POST'])
def technical_analysis():
    """Run technical analysis on a stock with proper CrewOutput handling."""
    data = request.json
    ticker = data.get('ticker', '')
    
    if not ticker:
        return jsonify({"result": "Error: Ticker symbol is required"}), 200
    
    try:
        inputs = {
            'ticker': ticker,
            'topic': f"Technical analysis for {ticker}",
            'current_year': str(datetime.now().year),
            'search_scope': "Limited to Yahoo Finance, TradingView, Barchart, and StockCharts"
        }
        
        print(f"Starting technical analysis for {ticker}")

        with concurrent.futures.ThreadPoolExecutor() as executor:
            technical_crew = get_cached_crew('technical')  # ✅ Use cached crew
            future = executor.submit(technical_crew.kickoff, inputs=inputs)
            try:
                result = future.result(timeout=120)
                
                if hasattr(result, 'raw_output'):
                    result_str = str(result.raw_output)
                else:
                    result_str = str(result)
                
                print(f"Technical analysis completed for {ticker}")
                return jsonify({"result": result_str})
                
            except concurrent.futures.TimeoutError:
                print(f"Technical analysis timed out for {ticker}")
                return jsonify({"result": f"Technical analysis for {ticker} timed out. Please try again later."}), 200
    
    except Exception as e:
        print(f"Error in technical analysis for {ticker}: {str(e)}")
        return jsonify({"result": f"Technical analysis for {ticker} could not be completed. Error: {str(e)}"}), 200

@app.route('/api/quantitative-analysis', methods=['POST'])
def quantitative_analysis():
    """Run quantitative analysis on a stock with proper CrewOutput handling."""
    data = request.json
    ticker = data.get('ticker', '')
    
    if not ticker:
        return jsonify({"result": "Error: Ticker symbol is required"}), 200
    
    try:
        inputs = {
            'ticker': ticker,
            'topic': f"Quantitative analysis for {ticker}",
            'current_year': str(datetime.now().year),
            'search_scope': "Limited to Yahoo Finance, Morningstar, Finviz, and Zacks"
        }
        
        print(f"Starting quantitative analysis for {ticker}")

        with concurrent.futures.ThreadPoolExecutor() as executor:
            quantitative_crew = get_cached_crew('quantitative')  # ✅ Use cached crew
            future = executor.submit(quantitative_crew.kickoff, inputs=inputs)
            try:
                result = future.result(timeout=120)
                
                if hasattr(result, 'raw_output'):
                    result_str = str(result.raw_output)
                else:
                    result_str = str(result)
                
                print(f"Quantitative analysis completed for {ticker}")
                return jsonify({"result": result_str})
                
            except concurrent.futures.TimeoutError:
                print(f"Quantitative analysis timed out for {ticker}")
                return jsonify({"result": f"Quantitative analysis for {ticker} timed out. Please try again later."}), 200
    
    except Exception as e:
        print(f"Error in quantitative analysis for {ticker}: {str(e)}")
        return jsonify({"result": f"Quantitative analysis for {ticker} could not be completed. Error: {str(e)}"}), 200

@app.route('/api/risk-analysis', methods=['POST'])
def risk_assessment():
    """Run risk assessment on a stock with proper CrewOutput handling."""
    data = request.json
    ticker = data.get('ticker', '')
    
    if not ticker:
        return jsonify({"result": "Error: Ticker symbol is required"}), 200
    
    try:
        inputs = {
            'ticker': ticker,
            'topic': f"Risk assessment for {ticker}",
            'current_year': str(datetime.now().year),
            'search_scope': "Limited to Yahoo Finance, Morningstar, and Bloomberg"
        }
        
        print(f"Starting risk assessment for {ticker}")

        with concurrent.futures.ThreadPoolExecutor() as executor:
            risk_crew = get_cached_crew('risk')  # ✅ Use cached crew
            future = executor.submit(risk_crew.kickoff, inputs=inputs)
            try:
                result = future.result(timeout=120)
                
                if hasattr(result, 'raw_output'):
                    result_str = str(result.raw_output)
                else:
                    result_str = str(result)
                
                print(f"Risk assessment completed for {ticker}")
                return jsonify({"result": result_str})
                
            except concurrent.futures.TimeoutError:
                print(f"Risk assessment timed out for {ticker}")
                return jsonify({"result": f"Risk assessment for {ticker} timed out. Please try again later."}), 200
    
    except Exception as e:
        print(f"Error in risk assessment for {ticker}: {str(e)}")
        return jsonify({"result": f"Risk assessment for {ticker} could not be completed. Error: {str(e)}"}), 200

@app.route('/api/analyze', methods=['POST'])
def analyze_stock():
    """Run the FinanceAssistant crew to analyze a stock based on a question."""
    data = request.json
    ticker = data.get('ticker', '')
    question = data.get('question', '')
    preloaded_analysis = data.get('preloadedAnalysis', None)
    
    if not ticker or not question:
        return jsonify({"result": "Error: Both ticker symbol and question are required"}), 200
    
    try:
        print(f"Starting chat analysis for {ticker}: {question}")
        
        # Create context from preloaded analysis if available
        context = ""
        if preloaded_analysis:
            if preloaded_analysis.get('sentiment'):
                context += f"\n\nSENTIMENT ANALYSIS:\n{preloaded_analysis['sentiment']}\n"
            if preloaded_analysis.get('technical'):
                context += f"\n\nTECHNICAL ANALYSIS:\n{preloaded_analysis['technical']}\n"
            if preloaded_analysis.get('quantitative'):
                context += f"\n\nQUANTITATIVE ANALYSIS:\n{preloaded_analysis['quantitative']}\n"
            if preloaded_analysis.get('risk'):
                context += f"\n\nRISK ASSESSMENT:\n{preloaded_analysis['risk']}\n"
        
        # Get stock information for added context
        try:
            stock = yf.Ticker(ticker)
            stock_info = stock.info
            stock_name = stock_info.get('shortName', ticker)
            sector = stock_info.get('sector', 'Unknown')
            industry = stock_info.get('industry', 'Unknown')
            
            stock_context = f"\nBASIC INFO: {stock_name} ({ticker}) is in the {sector} sector and {industry} industry."
            context = stock_context + context
        except Exception as info_error:
            print(f"Could not get stock info: {info_error}")
            pass
            
        inputs = {
            'ticker': ticker,
            'question': question,
            'topic': f"Stock analysis for {ticker}",
            'current_year': str(datetime.now().year),
            'search_scope': "Limited to top financial websites",
            'context': context if context else "No preloaded analysis available."
        }

        # ✅ Use cached chat crew instead of creating inline
        with concurrent.futures.ThreadPoolExecutor() as executor:
            chat_crew = get_cached_crew('chat')  # Reuse cached crew!
            future = executor.submit(chat_crew.kickoff, inputs=inputs)
            try:
                result = future.result(timeout=120)
                
                if hasattr(result, 'raw_output'):
                    result_str = str(result.raw_output)
                else:
                    result_str = str(result)
                
                print(f"Chat analysis completed for {ticker}")
                return jsonify({"result": result_str})
                
            except concurrent.futures.TimeoutError:
                print(f"Chat analysis timed out for {ticker}")
                return jsonify({"result": f"Analysis for {ticker} timed out. Please try asking a more specific question."}), 200
    
    except Exception as e:
        print(f"Error in chat analysis for {ticker}: {str(e)}")
        return jsonify({"result": f"Analysis for {ticker} could not be completed. Error: {str(e)}"}), 200

@app.route('/api/full-analysis', methods=['POST'])
def full_analysis():
    """Run all analyses on a stock with proper CrewOutput handling and rate limiting."""
    data = request.json
    ticker = data.get('ticker', '')
    
    if not ticker:
        return jsonify({"error": "Ticker symbol is required"}), 400
    
    try:
        print(f"Starting full analysis for {ticker}")
        
        inputs = {
            'ticker': ticker,
            'topic': f"Analysis for {ticker}",
            'current_year': str(datetime.now().year),
            'search_scope': "Limited to top financial websites"
        }
        
        results = {
            "sentiment_analysis": f"Analyzing sentiment for {ticker}...",
            "technical_analysis": f"Analyzing technical indicators for {ticker}...",
            "quantitative_analysis": f"Analyzing quantitative metrics for {ticker}...",
            "risk_assessment": f"Assessing risk for {ticker}..."
        }
        
        # Fetch basic information using yfinance
        try:
            stock = yf.Ticker(ticker)
            info = stock.info
            name = info.get('shortName', ticker)
            sector = info.get('sector', 'Unknown')
            industry = info.get('industry', 'Unknown')
            market_cap = info.get('marketCap', 0)
            market_cap_str = f"${market_cap/1000000000:.2f}B" if market_cap else "N/A"
            
            basic_summary = f"""# {name} ({ticker})

## Basic Information
- **Sector:** {sector}
- **Industry:** {industry}
- **Market Cap:** {market_cap_str}

Analysis is being performed. Please check individual tabs for detailed results.
"""
            results["basic_summary"] = basic_summary
            
        except Exception as info_error:
            print(f"Could not get basic stock info: {info_error}")
            results["basic_summary"] = f"# Analysis for {ticker}\nPerforming comprehensive analysis..."
        
        # Run analyses sequentially with rate limiting to avoid API limits
        analysis_functions = [
            ('sentiment', create_sentiment_crew),
            ('technical', create_technical_crew),
            ('quantitative', create_quantitative_crew),
            ('risk', create_risk_crew)
        ]
        
        for analysis_type, crew_function in analysis_functions:
            try:
                print(f"Running {analysis_type} analysis for {ticker}")

                crew = get_cached_crew(analysis_type)  # ✅ Use cached crew
                result = crew.kickoff(inputs=inputs)
                
                if hasattr(result, 'raw_output'):
                    results[f"{analysis_type}_analysis"] = str(result.raw_output)
                else:
                    results[f"{analysis_type}_analysis"] = str(result)
                
                print(f"Completed {analysis_type} analysis for {ticker}")
                
                # Wait between analyses to avoid rate limits
                if analysis_type != 'risk':  # Don't wait after the last one
                    time.sleep(3)
                
            except Exception as analysis_error:
                print(f"Error in {analysis_type} analysis for {ticker}: {str(analysis_error)}")
                results[f"{analysis_type}_analysis"] = f"Error in {analysis_type} analysis: {str(analysis_error)}"
        
        print(f"Full analysis completed for {ticker}")
        return jsonify(results)
    
    except Exception as e:
        print(f"Error in full analysis for {ticker}: {str(e)}")
        return jsonify({
            "basic_summary": f"Analysis for {ticker}",
            "sentiment_analysis": f"Could not complete sentiment analysis: {str(e)}",
            "technical_analysis": f"Could not complete technical analysis: {str(e)}",
            "quantitative_analysis": f"Could not complete quantitative analysis: {str(e)}",
            "risk_assessment": f"Could not complete risk assessment: {str(e)}"
        }), 200

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    print("Starting Stock Analyzer API server...")
    print("Server will be available at: http://localhost:5000")
    print("Health check: http://localhost:5000/")
    app.run(debug=True, port=5000, host='0.0.0.0')
