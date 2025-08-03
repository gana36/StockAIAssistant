# import yfinance as yf
# import io
# from crewai import Agent, Task, Crew, Process
# from crewai_tools import CodeInterpreterTool
# from dotenv import load_dotenv
# load_dotenv()
# # Get stock data
# ticker = "AMZN"
# stock = yf.Ticker(ticker)
# hist = stock.history(period="1y")
# df = hist.reset_index()

# # Convert to CSV
# csv_buffer = io.StringIO()
# df.to_csv(csv_buffer, index=False)
# csv_str = csv_buffer.getvalue()

# # Create technical analyst agent directly
# technical_analyst = Agent(
#     role="AMZN Technical Analysis Expert",
#     goal="Perform technical analysis on AMZN stock data to identify patterns and potential trading signals",
#     backstory="You're a veteran technical analyst who has spent years analyzing chart patterns, technical indicators, and price movements.",
#     verbose=True,
#     tools=[CodeInterpreterTool(unsafe_mode=True)]
# )

# # Create technical analysis task directly
# technical_analysis_task = Task(
#     description=f"""
#     Perform technical analysis on the AMZN stock data.
#     Analyze key technical indicators including but not limited to:
#     - Moving averages (50-day and 200-day)
#     - Relative Strength Index (RSI)
#     - MACD (Moving Average Convergence Divergence)
#     - Bollinger Bands
#     - Support and resistance levels
#     Identify potential bullish or bearish patterns and provide trading signal recommendations.
    
#     Here is the CSV data:
#     {csv_str[:1000]}... (truncated for brevity)
    
#     Parse this CSV string to perform your analysis. The data has the following columns:
#     - Date: The date of the data
#     - Open: The opening price of the stock
#     - High: The highest price of the stock
#     - Low: The lowest price of the stock
#     - Close: The closing price of the stock
#     - Volume: The volume of the stock
#     """,
#     expected_output="A comprehensive technical analysis report with key indicators, patterns identified, and trading signal recommendations.",
#     agent=technical_analyst
# )

# # Create a simple crew with just the technical analyst
# technical_crew = Crew(
#     agents=[technical_analyst],
#     tasks=[technical_analysis_task],
#     process=Process.sequential,
#     verbose=True
# )

# # Run the crew
# result = technical_crew.kickoff()
# print(result)