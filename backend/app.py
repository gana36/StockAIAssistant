# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import warnings
# import yfinance as yf
# from crewai import Crew, Process
# # from crew import FinanceAssistant
# from crew_handlers import (
#     create_sentiment_crew,
#     create_technical_crew,
#     create_quantitative_crew,
#     create_risk_crew
# )
# from datetime import datetime
# import pandas as pd
# import io
# import agentops
# import concurrent.futures
# import time
# from dotenv import load_dotenv
# load_dotenv()
# app = Flask(__name__)
# CORS(app)  # Enable CORS for all routes

# # Suppress warnings
# warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

# # Initialize AgentOps
# # agentops.init(api_key='64ec0862-91a3-4a04-8ee0-db769e2a3222')
# agentops.init(api_key="a0c2f15c-9f2f-48c3-95e3-8e0e446f595d")

# @app.route('/api/stock-data', methods=['GET'])
# def get_stock_data():
#     """Fetch stock data using yfinance and return it in a format for the frontend."""
#     ticker = request.args.get('ticker', '')
#     if not ticker:
#         return jsonify({"error": "Ticker symbol is required"}), 400
    
#     try:
#         # Get stock data using yfinance
#         stock = yf.Ticker(ticker)
        
#         # Get historical data for the past year
#         hist = stock.history(period="1y")
        
#         # Reset index to make date a column
#         hist = hist.reset_index()
        
#         # Format historical data for frontend
#         stock_data = []
#         for _, row in hist.iterrows():
#             stock_data.append({
#                 "date": row["Date"].strftime('%Y-%m-%d'),
#                 "open": float(row["Open"]),
#                 "high": float(row["High"]),
#                 "low": float(row["Low"]),
#                 "close": float(row["Close"]),
#                 "volume": int(row["Volume"]),
#                 "change": float(row["Close"]) - float(row["Open"]),
#                 "percentChange": ((float(row["Close"]) - float(row["Open"])) / float(row["Open"])) * 100 if row["Open"] > 0 else 0
#             })
        
#         # Return the data
#         return jsonify({
#             "data": stock_data
#         })
    
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# def get_stock_data_frame(ticker):
#     """Helper function to get stock data as a DataFrame."""
#     stock = yf.Ticker(ticker)
#     hist = stock.history(period="1y")
#     return hist.reset_index()
# @app.route('/api/sentiment-analysis', methods=['POST'])
# def sentiment_analysis():
#     """Run sentiment analysis on a stock with proper CrewOutput handling."""
#     data = request.json
#     ticker = data.get('ticker', '')
    
#     if not ticker:
#         return jsonify({"result": "Error: Ticker symbol is required"}), 200
    
#     try:
#         # Prepare inputs for the sentiment analysis crew
#         inputs = {
#             'ticker': ticker,
#             'topic': f"Sentiment analysis for {ticker}",
#             'current_year': str(datetime.now().year),
#             'search_scope': "Limited to Yahoo Finance, CNBC, MarketWatch, Seeking Alpha, and Bloomberg"
#         }
        
#         # Set a timeout for the operation
#         with concurrent.futures.ThreadPoolExecutor() as executor:
#             sentiment_crew = create_sentiment_crew()
#             future = executor.submit(sentiment_crew.kickoff, inputs=inputs)
#             try:
#                 result = future.result(timeout=120)  # 2-minute timeout
                
#                 # Handle CrewOutput object serialization
#                 if hasattr(result, 'raw_output'):
#                     # If it's a CrewOutput object, extract the raw_output as a string
#                     result_str = str(result.raw_output)
#                 else:
#                     # If it's already a string or other basic type
#                     result_str = str(result)
                
#                 return jsonify({"result": result_str})
                
#             except concurrent.futures.TimeoutError:
#                 return jsonify({"result": f"Sentiment analysis for {ticker} timed out. Please try again later."}), 200
    
#     except Exception as e:
#         # Provide a useful fallback response
#         return jsonify({"result": f"Sentiment analysis for {ticker} could not be completed. Error: {str(e)}"}), 200


# @app.route('/api/technical-analysis', methods=['POST'])
# def technical_analysis():
#     """Run technical analysis on a stock with proper CrewOutput handling."""
#     data = request.json
#     ticker = data.get('ticker', '')
    
#     if not ticker:
#         return jsonify({"result": "Error: Ticker symbol is required"}), 200
    
#     try:
#         # Prepare inputs for the technical analysis crew
#         inputs = {
#             'ticker': ticker,
#             'topic': f"Technical analysis for {ticker}",
#             'current_year': str(datetime.now().year),
#             'search_scope': "Limited to Yahoo Finance, TradingView, Barchart, and StockCharts"
#         }
        
#         # Set a timeout for the operation
#         with concurrent.futures.ThreadPoolExecutor() as executor:
#             technical_crew = create_technical_crew()
#             future = executor.submit(technical_crew.kickoff, inputs=inputs)
#             try:
#                 result = future.result(timeout=120)  # 2-minute timeout
                
#                 # Handle CrewOutput object serialization
#                 if hasattr(result, 'raw_output'):
#                     # If it's a CrewOutput object, extract the raw_output as a string
#                     result_str = str(result.raw_output)
#                 else:
#                     # If it's already a string or other basic type
#                     result_str = str(result)
                
#                 return jsonify({"result": result_str})
                
#             except concurrent.futures.TimeoutError:
#                 return jsonify({"result": f"Technical analysis for {ticker} timed out. Please try again later."}), 200
    
#     except Exception as e:
#         # Provide a useful fallback response
#         return jsonify({"result": f"Technical analysis for {ticker} could not be completed. Error: {str(e)}"}), 200


# @app.route('/api/quantitative-analysis', methods=['POST'])
# def quantitative_analysis():
#     """Run quantitative analysis on a stock with proper CrewOutput handling."""
#     data = request.json
#     ticker = data.get('ticker', '')
    
#     if not ticker:
#         return jsonify({"result": "Error: Ticker symbol is required"}), 200
    
#     try:
#         # Prepare inputs for the quantitative analysis crew
#         inputs = {
#             'ticker': ticker,
#             'topic': f"Quantitative analysis for {ticker}",
#             'current_year': str(datetime.now().year),
#             'search_scope': "Limited to Yahoo Finance, Morningstar, Finviz, and Zacks"
#         }
        
#         # Set a timeout for the operation
#         with concurrent.futures.ThreadPoolExecutor() as executor:
#             quantitative_crew = create_quantitative_crew()
#             future = executor.submit(quantitative_crew.kickoff, inputs=inputs)
#             try:
#                 result = future.result(timeout=120)  # 2-minute timeout
                
#                 # Handle CrewOutput object serialization
#                 if hasattr(result, 'raw_output'):
#                     # If it's a CrewOutput object, extract the raw_output as a string
#                     result_str = str(result.raw_output)
#                 else:
#                     # If it's already a string or other basic type
#                     result_str = str(result)
                
#                 return jsonify({"result": result_str})
                
#             except concurrent.futures.TimeoutError:
#                 return jsonify({"result": f"Quantitative analysis for {ticker} timed out. Please try again later."}), 200
    
#     except Exception as e:
#         # Provide a useful fallback response
#         return jsonify({"result": f"Quantitative analysis for {ticker} could not be completed. Error: {str(e)}"}), 200


# @app.route('/api/risk-assessment', methods=['POST'])
# def risk_assessment():
#     """Run risk assessment on a stock with proper CrewOutput handling."""
#     data = request.json
#     ticker = data.get('ticker', '')
    
#     if not ticker:
#         return jsonify({"result": "Error: Ticker symbol is required"}), 200
    
#     try:
#         # Prepare inputs for the risk assessment crew
#         inputs = {
#             'ticker': ticker,
#             'topic': f"Risk assessment for {ticker}",
#             'current_year': str(datetime.now().year),
#             'search_scope': "Limited to Yahoo Finance, Morningstar, and Bloomberg"
#         }
        
#         # Set a timeout for the operation
#         with concurrent.futures.ThreadPoolExecutor() as executor:
#             risk_crew = create_risk_crew()
#             future = executor.submit(risk_crew.kickoff, inputs=inputs)
#             try:
#                 result = future.result(timeout=120)  # 2-minute timeout
                
#                 # Handle CrewOutput object serialization
#                 if hasattr(result, 'raw_output'):
#                     # If it's a CrewOutput object, extract the raw_output as a string
#                     result_str = str(result.raw_output)
#                 else:
#                     # If it's already a string or other basic type
#                     result_str = str(result)
                
#                 return jsonify({"result": result_str})
                
#             except concurrent.futures.TimeoutError:
#                 return jsonify({"result": f"Risk assessment for {ticker} timed out. Please try again later."}), 200
    
#     except Exception as e:
#         # Provide a useful fallback response
#         return jsonify({"result": f"Risk assessment for {ticker} could not be completed. Error: {str(e)}"}), 200


# @app.route('/api/analyze', methods=['POST'])
# def analyze_stock():
#     """Run the FinanceAssistant crew to analyze a stock based on a question with proper CrewOutput handling."""
#     data = request.json
#     ticker = data.get('ticker', '')
#     question = data.get('question', '')
    
#     if not ticker or not question:
#         return jsonify({"result": "Error: Both ticker symbol and question are required"}), 200
    
#     try:
#         # Prepare inputs for the crew
#         inputs = {
#             'ticker': ticker,
#             'question': question,
#             'topic': f"Stock analysis for {ticker}",
#             'current_year': str(datetime.now().year),
#             'search_scope': "Limited to top financial websites"
#         }
        
#         # Create a simple reporting crew
#         from crewai import Agent, Task, Crew, Process
#         from crewai_tools import SerperDevTool
        
#         reporting_analyst = Agent(
#             role=f"Financial Analyst for {ticker}",
#             goal=f"Answer questions about {ticker} stock",
#             backstory=f"You're an experienced financial analyst specializing in stock analysis.",
#             verbose=True,
#             tools=[SerperDevTool()]
#         )
        
#         reporting_task = Task(
#             description=f"""
#             Analyze the {ticker} stock and answer the following question: {question}
#             Use Yahoo Finance, CNBC, or MarketWatch to find basic information about {ticker}.
#             Provide a concise answer based on the available information.
#             Your search scope is: Limited to top financial websites
#             """,
#             expected_output="""
#             Concise answer to the question with key insights, not exceeding 100 words.
#             """,
#             agent=reporting_analyst
#         )
        
#         reporting_crew = Crew(
#             agents=[reporting_analyst],
#             tasks=[reporting_task],
#             process=Process.sequential,
#             verbose=True
#         )
        
#         # Set a timeout for the operation
#         with concurrent.futures.ThreadPoolExecutor() as executor:
#             future = executor.submit(reporting_crew.kickoff, inputs=inputs)
#             try:
#                 result = future.result(timeout=120)  # 2-minute timeout
                
#                 # Handle CrewOutput object serialization
#                 if hasattr(result, 'raw_output'):
#                     # If it's a CrewOutput object, extract the raw_output as a string
#                     result_str = str(result.raw_output)
#                 else:
#                     # If it's already a string or other basic type
#                     result_str = str(result)
                
#                 return jsonify({"result": result_str})
                
#             except concurrent.futures.TimeoutError:
#                 return jsonify({"result": f"Analysis for {ticker} timed out. Please try asking a more specific question."}), 200
    
#     except Exception as e:
#         # Provide a useful fallback response
#         return jsonify({"result": f"Analysis for {ticker} could not be completed. Error: {str(e)}"}), 200


# @app.route('/api/full-analysis', methods=['POST'])
# def full_analysis():
#     """Run all analyses on a stock with proper CrewOutput handling."""
#     data = request.json
#     ticker = data.get('ticker', '')
    
#     if not ticker:
#         return jsonify({"error": "Ticker symbol is required"}), 400
    
#     try:
#         # Common inputs for all crews
#         inputs = {
#             'ticker': ticker,
#             'topic': f"Analysis for {ticker}",
#             'current_year': str(datetime.now().year),
#             'search_scope': "Limited to top financial websites"
#         }
        
#         # Placeholders for results
#         results = {
#             "sentiment_analysis": f"Analyzing sentiment for {ticker}...",
#             "technical_analysis": f"Analyzing technical indicators for {ticker}...",
#             "quantitative_analysis": f"Analyzing quantitative metrics for {ticker}...",
#             "risk_assessment": f"Assessing risk for {ticker}..."
#         }
        
#         # Fetch basic information using yfinance
#         try:
#             stock = yf.Ticker(ticker)
#             info = stock.info
#             name = info.get('shortName', ticker)
#             sector = info.get('sector', 'Unknown')
#             industry = info.get('industry', 'Unknown')
#             market_cap = info.get('marketCap', 0)
#             market_cap_str = f"${market_cap/1000000000:.2f}B" if market_cap else "N/A"
            
#             # Create a basic summary
#             basic_summary = f"""# {name} ({ticker})

#             ## Basic Information
#             - **Sector:** {sector}
#             - **Industry:** {industry}
#             - **Market Cap:** {market_cap_str}

#             Analysis is being performed. Please check individual tabs for detailed results.
#             """
#             results["basic_summary"] = basic_summary
            
#             # Return initial results immediately
#             initial_response = jsonify(results)
            
#         except:
#             # If we can't get yfinance data, just proceed with the analysis
#             results["basic_summary"] = f"# Analysis for {ticker}\nPerforming comprehensive analysis..."
#             initial_response = jsonify(results)
        
#         # Start all analyses in separate threads
#         with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
#             # Submit all tasks
#             sentiment_future = executor.submit(create_sentiment_crew().kickoff, inputs=inputs)
#             technical_future = executor.submit(create_technical_crew().kickoff, inputs=inputs)
#             quantitative_future = executor.submit(create_quantitative_crew().kickoff, inputs=inputs)
#             risk_future = executor.submit(create_risk_crew().kickoff, inputs=inputs)
            
#             # Get results with timeouts
#             try:
#                 sentiment_result = sentiment_future.result(timeout=120)
#                 # Handle CrewOutput object serialization
#                 if hasattr(sentiment_result, 'raw_output'):
#                     results["sentiment_analysis"] = str(sentiment_result.raw_output)
#                 else:
#                     results["sentiment_analysis"] = str(sentiment_result)
#             except Exception as e:
#                 results["sentiment_analysis"] = f"Sentiment analysis timed out or encountered an error: {str(e)}"
            
#             try:
#                 technical_result = technical_future.result(timeout=120)
#                 # Handle CrewOutput object serialization
#                 if hasattr(technical_result, 'raw_output'):
#                     results["technical_analysis"] = str(technical_result.raw_output)
#                 else:
#                     results["technical_analysis"] = str(technical_result)
#             except Exception as e:
#                 results["technical_analysis"] = f"Technical analysis timed out or encountered an error: {str(e)}"
            
#             try:
#                 quantitative_result = quantitative_future.result(timeout=120)
#                 # Handle CrewOutput object serialization
#                 if hasattr(quantitative_result, 'raw_output'):
#                     results["quantitative_analysis"] = str(quantitative_result.raw_output)
#                 else:
#                     results["quantitative_analysis"] = str(quantitative_result)
#             except Exception as e:
#                 results["quantitative_analysis"] = f"Quantitative analysis timed out or encountered an error: {str(e)}"
            
#             try:
#                 risk_result = risk_future.result(timeout=120)
#                 # Handle CrewOutput object serialization
#                 if hasattr(risk_result, 'raw_output'):
#                     results["risk_assessment"] = str(risk_result.raw_output)
#                 else:
#                     results["risk_assessment"] = str(risk_result)
#             except Exception as e:
#                 results["risk_assessment"] = f"Risk assessment timed out or encountered an error: {str(e)}"
        
#         # Return final results
#         return jsonify(results)
    
#     except Exception as e:
#         # Return a partial result even if there's an error
#         return jsonify({
#             "basic_summary": f"Analysis for {ticker}",
#             "sentiment_analysis": f"Could not complete sentiment analysis: {str(e)}",
#             "technical_analysis": f"Could not complete technical analysis: {str(e)}",
#             "quantitative_analysis": f"Could not complete quantitative analysis: {str(e)}",
#             "risk_assessment": f"Could not complete risk assessment: {str(e)}"
#         }), 200

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)
from flask import Flask, request, jsonify
from flask_cors import CORS
import warnings
import yfinance as yf
from crewai import Crew, Process
# from crew import FinanceAssistant
from crew_handlers import (
    create_sentiment_crew,
    create_technical_crew,
    create_quantitative_crew,
    create_risk_crew
)
from datetime import datetime
import pandas as pd
import io
import agentops
import concurrent.futures
import time
from dotenv import load_dotenv
load_dotenv()
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Suppress warnings
warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

# Initialize AgentOps
# agentops.init(api_key='64ec0862-91a3-4a04-8ee0-db769e2a3222')
agentops.init(api_key="a0c2f15c-9f2f-48c3-95e3-8e0e446f595d")

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
        
        # Reset index to make date a column
        hist = hist.reset_index()
        
        # Format historical data for frontend
        stock_data = []
        for _, row in hist.iterrows():
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
        
        # Return the data
        return jsonify({
            "data": stock_data
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_stock_data_frame(ticker):
    """Helper function to get stock data as a DataFrame."""
    stock = yf.Ticker(ticker)
    hist = stock.history(period="1y")
    return hist.reset_index()

@app.route('/api/sentiment-analysis', methods=['POST'])
def sentiment_analysis():
    """Run sentiment analysis on a stock with proper CrewOutput handling."""
    data = request.json
    ticker = data.get('ticker', '')
    
    if not ticker:
        return jsonify({"result": "Error: Ticker symbol is required"}), 200
    
    try:
        # Prepare inputs for the sentiment analysis crew
        inputs = {
            'ticker': ticker,
            'topic': f"Sentiment analysis for {ticker}",
            'current_year': str(datetime.now().year),
            'search_scope': "Limited to Yahoo Finance, CNBC, MarketWatch, Seeking Alpha, and Bloomberg"
        }
        
        # Set a timeout for the operation
        with concurrent.futures.ThreadPoolExecutor() as executor:
            sentiment_crew = create_sentiment_crew()
            future = executor.submit(sentiment_crew.kickoff, inputs=inputs)
            try:
                result = future.result(timeout=120)  # 2-minute timeout
                
                # Handle CrewOutput object serialization
                if hasattr(result, 'raw_output'):
                    # If it's a CrewOutput object, extract the raw_output as a string
                    result_str = str(result.raw_output)
                else:
                    # If it's already a string or other basic type
                    result_str = str(result)
                
                return jsonify({"result": result_str})
                
            except concurrent.futures.TimeoutError:
                return jsonify({"result": f"Sentiment analysis for {ticker} timed out. Please try again later."}), 200
    
    except Exception as e:
        # Provide a useful fallback response
        return jsonify({"result": f"Sentiment analysis for {ticker} could not be completed. Error: {str(e)}"}), 200


@app.route('/api/technical-analysis', methods=['POST'])
def technical_analysis():
    """Run technical analysis on a stock with proper CrewOutput handling."""
    data = request.json
    ticker = data.get('ticker', '')
    
    if not ticker:
        return jsonify({"result": "Error: Ticker symbol is required"}), 200
    
    try:
        # Prepare inputs for the technical analysis crew
        inputs = {
            'ticker': ticker,
            'topic': f"Technical analysis for {ticker}",
            'current_year': str(datetime.now().year),
            'search_scope': "Limited to Yahoo Finance, TradingView, Barchart, and StockCharts"
        }
        
        # Set a timeout for the operation
        with concurrent.futures.ThreadPoolExecutor() as executor:
            technical_crew = create_technical_crew()
            future = executor.submit(technical_crew.kickoff, inputs=inputs)
            try:
                result = future.result(timeout=120)  # 2-minute timeout
                
                # Handle CrewOutput object serialization
                if hasattr(result, 'raw_output'):
                    # If it's a CrewOutput object, extract the raw_output as a string
                    result_str = str(result.raw_output)
                else:
                    # If it's already a string or other basic type
                    result_str = str(result)
                
                return jsonify({"result": result_str})
                
            except concurrent.futures.TimeoutError:
                return jsonify({"result": f"Technical analysis for {ticker} timed out. Please try again later."}), 200
    
    except Exception as e:
        # Provide a useful fallback response
        return jsonify({"result": f"Technical analysis for {ticker} could not be completed. Error: {str(e)}"}), 200


@app.route('/api/quantitative-analysis', methods=['POST'])
def quantitative_analysis():
    """Run quantitative analysis on a stock with proper CrewOutput handling."""
    data = request.json
    ticker = data.get('ticker', '')
    
    if not ticker:
        return jsonify({"result": "Error: Ticker symbol is required"}), 200
    
    try:
        # Prepare inputs for the quantitative analysis crew
        inputs = {
            'ticker': ticker,
            'topic': f"Quantitative analysis for {ticker}",
            'current_year': str(datetime.now().year),
            'search_scope': "Limited to Yahoo Finance, Morningstar, Finviz, and Zacks"
        }
        
        # Set a timeout for the operation
        with concurrent.futures.ThreadPoolExecutor() as executor:
            quantitative_crew = create_quantitative_crew()
            future = executor.submit(quantitative_crew.kickoff, inputs=inputs)
            try:
                result = future.result(timeout=120)  # 2-minute timeout
                
                # Handle CrewOutput object serialization
                if hasattr(result, 'raw_output'):
                    # If it's a CrewOutput object, extract the raw_output as a string
                    result_str = str(result.raw_output)
                else:
                    # If it's already a string or other basic type
                    result_str = str(result)
                
                return jsonify({"result": result_str})
                
            except concurrent.futures.TimeoutError:
                return jsonify({"result": f"Quantitative analysis for {ticker} timed out. Please try again later."}), 200
    
    except Exception as e:
        # Provide a useful fallback response
        return jsonify({"result": f"Quantitative analysis for {ticker} could not be completed. Error: {str(e)}"}), 200


@app.route('/api/risk-assessment', methods=['POST'])
def risk_assessment():
    """Run risk assessment on a stock with proper CrewOutput handling."""
    data = request.json
    ticker = data.get('ticker', '')
    
    if not ticker:
        return jsonify({"result": "Error: Ticker symbol is required"}), 200
    
    try:
        # Prepare inputs for the risk assessment crew
        inputs = {
            'ticker': ticker,
            'topic': f"Risk assessment for {ticker}",
            'current_year': str(datetime.now().year),
            'search_scope': "Limited to Yahoo Finance, Morningstar, and Bloomberg"
        }
        
        # Set a timeout for the operation
        with concurrent.futures.ThreadPoolExecutor() as executor:
            risk_crew = create_risk_crew()
            future = executor.submit(risk_crew.kickoff, inputs=inputs)
            try:
                result = future.result(timeout=120)  # 2-minute timeout
                
                # Handle CrewOutput object serialization
                if hasattr(result, 'raw_output'):
                    # If it's a CrewOutput object, extract the raw_output as a string
                    result_str = str(result.raw_output)
                else:
                    # If it's already a string or other basic type
                    result_str = str(result)
                
                return jsonify({"result": result_str})
                
            except concurrent.futures.TimeoutError:
                return jsonify({"result": f"Risk assessment for {ticker} timed out. Please try again later."}), 200
    
    except Exception as e:
        # Provide a useful fallback response
        return jsonify({"result": f"Risk assessment for {ticker} could not be completed. Error: {str(e)}"}), 200


@app.route('/api/analyze', methods=['POST'])
def analyze_stock():
    """Run the FinanceAssistant crew to analyze a stock based on a question with proper CrewOutput handling."""
    data = request.json
    ticker = data.get('ticker', '')
    question = data.get('question', '')
    preloaded_analysis = data.get('preloadedAnalysis', None)
    
    if not ticker or not question:
        return jsonify({"result": "Error: Both ticker symbol and question are required"}), 200
    
    try:
        # Create context from preloaded analysis if available
        context = ""
        if preloaded_analysis:
            # Format the preloaded analysis into a single context string
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
            
            # Add basic stock info to context
            stock_context = f"\nBASIC INFO: {stock_name} ({ticker}) is in the {sector} sector and {industry} industry."
            context = stock_context + context
        except:
            # If we can't get yfinance data, just continue with existing context
            pass
            
        # Prepare inputs for the crew
        inputs = {
            'ticker': ticker,
            'question': question,
            'topic': f"Stock analysis for {ticker}",
            'current_year': str(datetime.now().year),
            'search_scope': "Limited to top financial websites",
            'context': context if context else "No preloaded analysis available."
        }
        
        # Create a smarter reporting crew that uses preloaded analysis
        from crewai import Agent, Task, Crew, Process
        from crewai_tools import SerperDevTool
        
        reporting_analyst = Agent(
            role=f"Financial Analyst for {ticker}",
            goal=f"Answer questions about {ticker} stock using both preloaded analysis and new research",
            backstory=f"You're an experienced financial analyst specializing in stock analysis with access to preloaded data and live search capabilities.",
            verbose=True,
            tools=[SerperDevTool()]
        )
        
        reporting_task = Task(
            description=f"""
            Analyze {ticker} stock and answer this question: "{question}"
            
            You should use BOTH:
            1. The preloaded analysis context:
            {context}
            
            2. Perform your own search to get additional information:
            - Use SerperDevTool to search for current information about {ticker}
            - Find data specific to answering the question
            
            Your search scope is: Limited to top financial websites
            """,
            expected_output="""
            A comprehensive answer that combines insights from both the preloaded analysis 
            and your additional research.
            """,
            agent=reporting_analyst
        )
        
        reporting_crew = Crew(
            agents=[reporting_analyst],
            tasks=[reporting_task],
            process=Process.sequential,
            verbose=True
        )
        
        # Set a timeout for the operation
        with concurrent.futures.ThreadPoolExecutor() as executor:
            future = executor.submit(reporting_crew.kickoff, inputs=inputs)
            try:
                result = future.result(timeout=120)  # 2-minute timeout
                
                # Handle CrewOutput object serialization
                if hasattr(result, 'raw_output'):
                    # If it's a CrewOutput object, extract the raw_output as a string
                    result_str = str(result.raw_output)
                else:
                    # If it's already a string or other basic type
                    result_str = str(result)
                
                return jsonify({"result": result_str})
                
            except concurrent.futures.TimeoutError:
                return jsonify({"result": f"Analysis for {ticker} timed out. Please try asking a more specific question."}), 200
    
    except Exception as e:
        # Provide a useful fallback response
        return jsonify({"result": f"Analysis for {ticker} could not be completed. Error: {str(e)}"}), 200


@app.route('/api/full-analysis', methods=['POST'])
def full_analysis():
    """Run all analyses on a stock with proper CrewOutput handling and rate limiting."""
    data = request.json
    ticker = data.get('ticker', '')
    
    if not ticker:
        return jsonify({"error": "Ticker symbol is required"}), 400
    
    try:
        # Common inputs for all crews
        inputs = {
            'ticker': ticker,
            'topic': f"Analysis for {ticker}",
            'current_year': str(datetime.now().year),
            'search_scope': "Limited to top financial websites"
        }
        
        # Placeholders for results
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
            
            # Create a basic summary
            basic_summary = f"""# {name} ({ticker})

            ## Basic Information
            - **Sector:** {sector}
            - **Industry:** {industry}
            - **Market Cap:** {market_cap_str}

            Analysis is being performed. Please check individual tabs for detailed results.
            """
            results["basic_summary"] = basic_summary
            
            # Return initial results immediately
            initial_response = jsonify(results)
            
        except:
            # If we can't get yfinance data, just proceed with the analysis
            results["basic_summary"] = f"# Analysis for {ticker}\nPerforming comprehensive analysis..."
            initial_response = jsonify(results)
        
        # Run analyses sequentially with rate limiting instead of all at once
        try:
            # Sentiment Analysis
            sentiment_crew = create_sentiment_crew()
            sentiment_result = sentiment_crew.kickoff(inputs=inputs)
            if hasattr(sentiment_result, 'raw_output'):
                results["sentiment_analysis"] = str(sentiment_result.raw_output)
            else:
                results["sentiment_analysis"] = str(sentiment_result)
            
            # Wait before next request to avoid rate limits
            time.sleep(5)
            
            # Technical Analysis
            technical_crew = create_technical_crew()
            technical_result = technical_crew.kickoff(inputs=inputs)
            if hasattr(technical_result, 'raw_output'):
                results["technical_analysis"] = str(technical_result.raw_output)
            else:
                results["technical_analysis"] = str(technical_result)
            
            # Wait before next request
            time.sleep(5)
            
            # Quantitative Analysis
            quantitative_crew = create_quantitative_crew()
            quantitative_result = quantitative_crew.kickoff(inputs=inputs)
            if hasattr(quantitative_result, 'raw_output'):
                results["quantitative_analysis"] = str(quantitative_result.raw_output)
            else:
                results["quantitative_analysis"] = str(quantitative_result)
            
            # Wait before next request
            time.sleep(5)
            
            # Risk Assessment
            risk_crew = create_risk_crew()
            risk_result = risk_crew.kickoff(inputs=inputs)
            if hasattr(risk_result, 'raw_output'):
                results["risk_assessment"] = str(risk_result.raw_output)
            else:
                results["risk_assessment"] = str(risk_result)
            
        except Exception as e:
            print(f"Error in sequential analysis: {str(e)}")
            # Continue with partial results
        
        # Return final results
        return jsonify(results)
    
    except Exception as e:
        # Return a partial result even if there's an error
        return jsonify({
            "basic_summary": f"Analysis for {ticker}",
            "sentiment_analysis": f"Could not complete sentiment analysis: {str(e)}",
            "technical_analysis": f"Could not complete technical analysis: {str(e)}",
            "quantitative_analysis": f"Could not complete quantitative analysis: {str(e)}",
            "risk_assessment": f"Could not complete risk assessment: {str(e)}"
        }), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)