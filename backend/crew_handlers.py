from crewai import Agent, Task, Crew, Process
from crewai_tools import SerperDevTool, ScrapeWebsiteTool

# Helper function to create a fallback crew when regular creation fails
def create_fallback_crew(analysis_type):
    """Creates a simple fallback crew that won't throw errors"""
    # Create a simple agent
    fallback_agent = Agent(
        role=f"Financial Analyst",
        goal=f"Provide basic {analysis_type}",
        backstory=f"You're an experienced financial analyst who can provide basic {analysis_type}.",
        verbose=True
    )
    
    # Create a simple task
    fallback_task = Task(
        description=f"""
        The system encountered an error creating a specialized crew for {analysis_type}.
        Please provide a simple explanation that you cannot perform detailed {analysis_type} at this time,
        but offer some general advice about what this analysis typically involves for the ticker {{ticker}}.
        """,
        expected_output=f"""
        A brief explanation about why detailed {analysis_type} cannot be performed,
        along with some general information about what this type of analysis typically covers.
        """,
        agent=fallback_agent
    )
    
    # Create a simple crew
    fallback_crew = Crew(
        agents=[fallback_agent],
        tasks=[fallback_task],
        process=Process.sequential,
        verbose=True
    )
    
    return fallback_crew

def create_sentiment_crew():
    """Creates a crew focused on sentiment analysis"""
    try:
        # Create the sentiment analyst and task directly
        # Create the sentiment analyst agent directly
        sentiment_analyst = Agent(
            role=f"Sentiment Analysis Specialist",
            goal="Analyze market sentiment for stocks using news articles and social media data",
            backstory="You're an expert in natural language processing and sentiment analysis, with a deep understanding of how market sentiment affects stock prices.",
            verbose=True,
            tools=[SerperDevTool(), ScrapeWebsiteTool()]
        )
        # ONLY search Yahoo Finance and MarketWatch for the following limited information
        # Please add tradining symbols to the bullet points to make it attractive and dont spam trading symbols.
        # Create the sentiment analysis task directly
        sentiment_analysis_task = Task(
            description="""
            Analyze the current market sentiment for {ticker} based on recent news.
            Your search scope is: {search_scope}
            - Recent news headlines about {ticker} (limit to 5 most recent articles)
            - Latest analyst ratings if readily available
            
            Based on this information, determine if the overall sentiment appears positive, negative, or neutral.
            Generate a sentiment score on a scale of -100 (extremely negative) to +100 (extremely positive).
            """,
            expected_output="""
            A sentiment analysis report (100-150 words) with a sentiment score and brief explanation 
            of key factors represent them in no more than 7 concise and straight bullet points. 
            """,
            agent=sentiment_analyst
        )
        
        # Create the crew with the sentiment analyst and task
        sentiment_crew = Crew(
            agents=[sentiment_analyst],
            tasks=[sentiment_analysis_task],
            process=Process.sequential,
            verbose=True,
        )
        
        return sentiment_crew
    except Exception as e:
        # Log the error for debugging
        print(f"Error creating sentiment crew: {str(e)}")
        # Return a fallback crew
        return create_fallback_crew("sentiment analysis")

def create_technical_crew():
    """Creates a crew focused on technical analysis"""
    try:
        # Create the technical analyst and task directly
        # Create the technical analyst agent directly
        technical_analyst = Agent(
            role=f"Technical Analysis Expert",
            goal="Perform technical analysis on stocks to identify patterns and potential trading signals",
            backstory="You're a veteran technical analyst who has spent years analyzing chart patterns, technical indicators, and price movements.",
            verbose=True,
            tools=[SerperDevTool(), ScrapeWebsiteTool()]
        )
        # search TradingView or Barchart or other reports to find the following technical indicators (limit to 5 most recent articles):
        # Create the technical analysis task directly
        technical_analysis_task = Task(
            description="""
            Perform a focused technical analysis on the {ticker} stock.
            Your search scope is: {search_scope}
            - Current price relative to 50-day and 200-day moving averages
            - Current RSI value (oversold/overbought)
            - Basic MACD signal (bullish/bearish)
            - And any other important information to be considered as techincal analysis
            
            Based on this information, provide a simple trading signal (buy, sell, or hold)
            with a brief explanation of your reasoning.
            
            
            """,
            expected_output="""
            A concise technical analysis report (100-150 words) with key indicators and a clear trading recommendation with 
            represent them in no more than 7 concise and straight bullet points.
            """,
            agent=technical_analyst
        )
        
        # Create the crew with the technical analyst and task
        technical_crew = Crew(
            agents=[technical_analyst],
            tasks=[technical_analysis_task],
            process=Process.sequential,
            verbose=True,
        )
        
        return technical_crew
    except Exception as e:
        # Log the error for debugging
        print(f"Error creating technical crew: {str(e)}")
        # Return a simpler fallback crew that won't cause errors
        return create_fallback_crew("technical analysis")

def create_quantitative_crew():
    """Creates a crew focused on quantitative analysis"""
    try:
        # Create the quantitative analyst agent directly
        quantitative_analyst = Agent(
            role=f"Quantitative Analyst",
            goal="Perform in-depth statistical analysis on stocks to identify trends and anomalies",
            backstory="You're a mathematics wizard with expertise in statistical models and quantitative finance.",
            verbose=True,
            tools=[SerperDevTool(), ScrapeWebsiteTool()]
        )
        # search Yahoo Finance or Finviz to find the following key metrics (limit to 5 most recent articles):
        # Please add tradining symbols to the bullet points to make it attractive and dont spam trading symbols.
        # Create the quantitative analysis task directly
        quantitative_analysis_task = Task(
            description="""
            Conduct a focused quantitative analysis on the {ticker} stock.
            Your search scope is: {search_scope}
            - Beta value and volatility compared to market
            - Year-to-date and 1-year return
            - Basic risk-adjusted performance measure if available
            - And any other important information to be considered as quantitative analysis
            
            Based on this information, provide a brief assessment of the stock's
            quantitative characteristics and what they mean for investors.
            
            
            """,
            expected_output="""
            A concise quantitative analysis report (100-150 words) with key metrics and their interpretation
            represent them in no more than 7 concise and staright bullet points.
            """,
            agent=quantitative_analyst
        )
        
        # Create the crew with the quantitative analyst and task
        quantitative_crew = Crew(
            agents=[quantitative_analyst],
            tasks=[quantitative_analysis_task],
            process=Process.sequential,
            verbose=True,
        )
        
        return quantitative_crew
    except Exception as e:
        # Log the error for debugging
        print(f"Error creating quantitative crew: {str(e)}")
        # Return a fallback crew
        return create_fallback_crew("quantitative analysis")

def create_risk_crew():
    """Creates a crew focused on risk assessment"""
    try:
        # Create the risk manager agent directly
        risk_manager = Agent(
            role=f"Risk Management Specialist",
            goal="Assess the risk profile of stocks based on various factors and metrics",
            backstory="You're a cautious risk manager with years of experience in evaluating financial instruments.",
            verbose=True,
            tools=[SerperDevTool(), ScrapeWebsiteTool()]
        )
        # search Yahoo Finance or Morningstar etc to identify:
        # Create the risk assessment task directly
        risk_assessment_task = Task(
            description="""
            Assess the basic risk profile of {ticker} stock.
            
            Your search scope is: {search_scope}
            - Current beta value
            - Primary business risks mentioned in recent analyst reports
            - Major market risks affecting this stock
            - And any other important information to be considered as risk assessment
            
            Based on this information, provide a risk rating from 1 (very low risk) to 10 (extremely high risk)
            with a brief justification of your rating.
            
            
            """,
            expected_output="""
            A concise risk assessment report (100-150 words) with a clear risk rating and 
            explanation represent them in no more than 7 concise and straight bullet points.
            """,
            agent=risk_manager
        )
        
        # Create the crew with the risk manager and task
        risk_crew = Crew(
            agents=[risk_manager],
            tasks=[risk_assessment_task],
            process=Process.sequential,
            verbose=True,
        )
        
        return risk_crew
    except Exception as e:
        # Log the error for debugging
        print(f"Error creating risk crew: {str(e)}")
        # Return a fallback crew
        return create_fallback_crew("risk assessment")