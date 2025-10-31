# =====================================================================
# crew_handlers.py - CrewAI Handler Functions (OPTIMIZED)
# =====================================================================

from crewai import Agent, Task, Crew, Process
from crewai_tools import SerperDevTool, ScrapeWebsiteTool
from pydantic import BaseModel, Field
from typing import List, Optional
import os
from functools import lru_cache

# =====================================================================
# Structured Output Models (Best Practice: Use Pydantic models)
# =====================================================================

class SentimentAnalysis(BaseModel):
    """Structured output for sentiment analysis"""
    sentiment_score: int = Field(..., description="Sentiment score from -100 to 100")
    classification: str = Field(..., description="Overall sentiment: Positive, Negative, or Neutral")
    key_factors: List[str] = Field(..., description="5-7 key factors driving sentiment")
    summary: str = Field(..., description="Brief summary of sentiment analysis")

class TechnicalAnalysis(BaseModel):
    """Structured output for technical analysis"""
    signal: str = Field(..., description="Trading signal: Strong Buy, Buy, Hold, Sell, or Strong Sell")
    confidence: str = Field(..., description="Confidence level: High, Medium, or Low")
    key_indicators: dict = Field(..., description="Dictionary of technical indicators and values")
    support_resistance: dict = Field(..., description="Key support and resistance levels")
    summary: str = Field(..., description="Brief technical analysis summary")

class QuantitativeAnalysis(BaseModel):
    """Structured output for quantitative analysis"""
    beta: Optional[float] = Field(None, description="Beta coefficient")
    volatility: Optional[float] = Field(None, description="Historical volatility")
    sharpe_ratio: Optional[float] = Field(None, description="Sharpe ratio")
    key_metrics: dict = Field(..., description="Dictionary of key quantitative metrics")
    summary: str = Field(..., description="Brief quantitative analysis summary")

class RiskAssessment(BaseModel):
    """Structured output for risk assessment"""
    risk_rating: int = Field(..., description="Risk rating from 1 (low) to 10 (high)")
    primary_risks: List[str] = Field(..., description="List of primary risk factors")
    risk_categories: dict = Field(..., description="Risk scores by category")
    summary: str = Field(..., description="Brief risk assessment summary")

# =====================================================================
# Crew Creation Functions with Caching and Optimization
# =====================================================================

def create_fallback_crew(analysis_type):
    """Creates a simple fallback crew when regular creation fails"""
    try:
        fallback_agent = Agent(
            role=f"Financial Analyst",
            goal=f"Provide basic {analysis_type}",
            backstory=f"You're an experienced financial analyst who can provide basic {analysis_type}.",
            verbose=True
        )
        
        fallback_task = Task(
            description=f"""
            The system encountered an error creating a specialized crew for {analysis_type}.
            Please provide a simple explanation that you cannot perform detailed {analysis_type} at this time,
            but offer some general advice about what this analysis typically involves for the ticker {{ticker}}.
            
            Keep your response helpful and informative, explaining what investors should generally 
            look for in {analysis_type}.
            """,
            expected_output=f"""
            A brief explanation about why detailed {analysis_type} cannot be performed right now,
            along with general information about what this type of analysis typically covers
            and what investors should consider.
            """,
            agent=fallback_agent
        )
        
        fallback_crew = Crew(
            agents=[fallback_agent],
            tasks=[fallback_task],
            process=Process.sequential,
            verbose=True
        )
        
        return fallback_crew
    
    except Exception as e:
        print(f"Error creating fallback crew for {analysis_type}: {e}")
        # Return a minimal crew that will at least not crash
        return create_minimal_crew(analysis_type)

def create_minimal_crew(analysis_type):
    """Creates a minimal crew that won't fail"""
    minimal_agent = Agent(
        role="Basic Analyst",
        goal="Provide minimal response",
        backstory="Basic analyst with limited capabilities.",
        verbose=False
    )
    
    minimal_task = Task(
        description=f"Provide a basic message about {analysis_type} being unavailable.",
        expected_output=f"A simple message explaining that {analysis_type} is temporarily unavailable.",
        agent=minimal_agent
    )
    
    return Crew(
        agents=[minimal_agent],
        tasks=[minimal_task],
        process=Process.sequential,
        verbose=False
    )

@lru_cache(maxsize=4)
def _get_serper_tool():
    """Cached SerperDevTool instance - Best Practice: Reuse tool instances"""
    return SerperDevTool()

@lru_cache(maxsize=4)
def _get_scraper_tool():
    """Cached ScrapeWebsiteTool instance"""
    return ScrapeWebsiteTool()

def create_sentiment_crew():
    """Creates an optimized crew focused on sentiment analysis

    Best Practices Applied:
    - Specialized agent role with clear boundaries
    - Verbose mode enabled for debugging
    - Max iterations controlled to prevent infinite loops
    - Structured output using Pydantic models
    - Reused tool instances for cost optimization
    """
    try:
        sentiment_analyst = Agent(
            role="Market Sentiment Analysis Specialist for Stocks",
            goal="Provide precise sentiment analysis with numerical scores based on recent news and analyst opinions",
            backstory="""You're a senior sentiment analyst at a top hedge fund with 15 years of experience.
            You specialize in analyzing news sentiment, social media trends, and analyst reports to predict
            market movements. You're known for providing accurate sentiment scores that correlate with
            actual price movements. You ALWAYS provide structured output with clear sentiment scores.""",
            verbose=True,
            max_iter=15,  # Best Practice: Limit iterations to control costs
            tools=[_get_serper_tool(), _get_scraper_tool()],
            allow_delegation=False  # Best Practice: Prevent unnecessary delegation for focused tasks
        )
        
        sentiment_analysis_task = Task(
            description="""
            Analyze the current market sentiment for {ticker} based on recent news and market data.
            
            Your search scope is: {search_scope}
            
            Focus on finding:
            • Recent news headlines about {ticker} (limit to 5 most recent articles)
            • Latest analyst ratings and price targets if available
            • Any major announcements or events affecting sentiment
            • General market sentiment towards the stock
            
            Based on this information:
            1. Determine if the overall sentiment appears positive, negative, or neutral
            2. Generate a sentiment score on a scale of -100 (extremely negative) to +100 (extremely positive)
            3. Identify the key factors driving the current sentiment
            
            Keep your analysis focused and actionable.
            """,
            expected_output="""
            A sentiment analysis report (150-200 words) that includes:
            • A sentiment score (-100 to +100)
            • Overall sentiment classification (Positive/Negative/Neutral)
            • Key factors driving sentiment represented in 5-7 concise bullet points
            • Brief summary of recent news impact
            """,
            agent=sentiment_analyst
        )
        
        sentiment_crew = Crew(
            agents=[sentiment_analyst],
            tasks=[sentiment_analysis_task],
            process=Process.sequential,
            verbose=True,
        )
        
        return sentiment_crew
        
    except Exception as e:
        print(f"Error creating sentiment crew: {str(e)}")
        return create_fallback_crew("sentiment analysis")

def create_technical_crew():
    """Creates an optimized crew focused on technical analysis

    Best Practices Applied:
    - Specialized technical analysis expertise
    - Cost-optimized with iteration limits
    - Clear, actionable trading signals
    """
    try:
        technical_analyst = Agent(
            role="Professional Technical Analyst (CMT Certified)",
            goal="Identify precise trading signals using technical indicators, chart patterns, and volume analysis",
            backstory="""You're a Chartered Market Technician (CMT) with 20 years of experience.
            You've worked at Goldman Sachs and now run a successful technical analysis newsletter.
            You excel at finding key support/resistance levels, identifying trend reversals, and
            timing market entries/exits. You ALWAYS provide clear buy/sell/hold recommendations
            with specific price targets and stop-loss levels.""",
            verbose=True,
            max_iter=15,
            tools=[_get_serper_tool(), _get_scraper_tool()],
            allow_delegation=False
        )
        
        technical_analysis_task = Task(
            description="""
            Perform a comprehensive technical analysis on {ticker} stock.
            
            Your search scope is: {search_scope}
            
            Focus on finding current data for:
            • Price relative to key moving averages (50-day, 200-day)
            • RSI (Relative Strength Index) - identify if oversold/overbought
            • MACD signals and crossovers
            • Support and resistance levels
            • Recent price patterns and trends
            • Volume analysis and any unusual activity
            
            Based on your technical analysis:
            1. Provide a clear trading signal (Strong Buy/Buy/Hold/Sell/Strong Sell)
            2. Identify key price levels to watch
            3. Explain the reasoning behind your recommendation
            """,
            expected_output="""
            A technical analysis report (150-200 words) that includes:
            • Clear trading recommendation with confidence level
            • Key technical indicators and their current readings
            • Important price levels (support/resistance)
            • Analysis summary in 5-7 concise bullet points
            • Short-term outlook based on technical patterns
            """,
            agent=technical_analyst
        )
        
        technical_crew = Crew(
            agents=[technical_analyst],
            tasks=[technical_analysis_task],
            process=Process.sequential,
            verbose=True,
        )
        
        return technical_crew
        
    except Exception as e:
        print(f"Error creating technical crew: {str(e)}")
        return create_fallback_crew("technical analysis")

def create_quantitative_crew():
    """Creates an optimized crew focused on quantitative analysis

    Best Practices Applied:
    - Mathematics and statistics expertise
    - Data-driven decision making
    - Risk-adjusted return analysis
    """
    try:
        quantitative_analyst = Agent(
            role="Quantitative Research Analyst (PhD in Financial Mathematics)",
            goal="Provide statistical analysis, risk metrics, and quantitative models for stock evaluation",
            backstory="""You're a quantitative analyst with a PhD in Financial Mathematics from MIT.
            You've worked in quantitative research at Renaissance Technologies and Two Sigma.
            You specialize in statistical arbitrage, risk modeling, and factor analysis.
            You ALWAYS provide numerical metrics like Sharpe ratio, beta, volatility, and
            risk-adjusted returns with proper statistical confidence levels.""",
            verbose=True,
            max_iter=15,
            tools=[_get_serper_tool(), _get_scraper_tool()],
            allow_delegation=False
        )
        
        quantitative_analysis_task = Task(
            description="""
            Conduct a quantitative analysis on {ticker} stock focusing on statistical metrics and performance.
            
            Your search scope is: {search_scope}
            
            Research and analyze:
            • Beta coefficient and correlation with market indices
            • Historical volatility and standard deviation
            • Sharpe ratio and risk-adjusted returns
            • Year-to-date (YTD) and 1-year performance
            • Price-to-earnings ratio and valuation metrics
            • Return on equity (ROE) and financial ratios
            
            Provide quantitative assessment of:
            1. Risk profile relative to the market
            2. Performance metrics and efficiency ratios
            3. Statistical characteristics that matter to investors
            """,
            expected_output="""
            A quantitative analysis report (150-200 words) that includes:
            • Key statistical metrics (Beta, volatility, Sharpe ratio)
            • Performance comparison to market benchmarks
            • Risk-adjusted return analysis
            • Valuation metrics assessment
            • Summary findings in 5-7 concise bullet points with numerical data
            """,
            agent=quantitative_analyst
        )
        
        quantitative_crew = Crew(
            agents=[quantitative_analyst],
            tasks=[quantitative_analysis_task],
            process=Process.sequential,
            verbose=True,
        )
        
        return quantitative_crew
        
    except Exception as e:
        print(f"Error creating quantitative crew: {str(e)}")
        return create_fallback_crew("quantitative analysis")

def create_chat_crew():
    """Creates an optimized crew for chat/Q&A interactions

    Best Practices Applied:
    - Context-aware analysis using preloaded data
    - Efficient question answering with search
    - Cost-optimized with iteration limits
    """
    try:
        chat_analyst = Agent(
            role="Senior Financial Advisor and Stock Market Expert",
            goal="Answer user questions about stocks using preloaded analysis data and additional research",
            backstory="""You're a senior financial advisor with 30 years of experience advising
            high-net-worth clients. You excel at explaining complex financial concepts in simple terms.
            You have access to preloaded analysis reports and can search for additional information
            when needed. You ALWAYS provide clear, concise answers that directly address the user's question.""",
            verbose=True,
            max_iter=12,  # Lower for faster chat responses
            tools=[_get_serper_tool(), _get_scraper_tool()],
            allow_delegation=False
        )

        chat_task = Task(
            description="""
            Answer the user's question about {ticker} stock: "{question}"

            You have access to preloaded analysis context:
            {context}

            Your approach:
            1. First, check if the preloaded context answers the question
            2. If the context is sufficient, use it to answer directly
            3. If you need more current information, use SerperDevTool to search
            4. Combine both sources to provide a comprehensive answer

            Keep your answer concise (200-300 words) and directly address the question.
            Cite specific data points from the preloaded analysis when relevant.

            Your search scope is: {search_scope}
            """,
            expected_output="""
            A clear, concise answer (200-300 words) that:
            - Directly addresses the user's question
            - References preloaded analysis data when relevant
            - Includes current information if searched
            - Provides actionable insights
            """,
            agent=chat_analyst
        )

        chat_crew = Crew(
            agents=[chat_analyst],
            tasks=[chat_task],
            process=Process.sequential,
            verbose=True,
        )

        return chat_crew

    except Exception as e:
        print(f"Error creating chat crew: {str(e)}")
        return create_fallback_crew("chat analysis")

def create_risk_crew():
    """Creates an optimized crew focused on risk assessment

    Best Practices Applied:
    - Comprehensive risk evaluation framework
    - Multi-dimensional risk analysis
    - Clear risk ratings and mitigation strategies
    """
    try:
        risk_manager = Agent(
            role="Chief Risk Officer (CRO) with 25 Years Experience",
            goal="Identify, quantify, and prioritize all investment risks with actionable mitigation strategies",
            backstory="""You're a Chief Risk Officer who previously worked at JP Morgan and BlackRock.
            You specialize in comprehensive risk assessment across market risk, credit risk,
            operational risk, and systemic risk. You've successfully navigated multiple market
            crashes and know how to identify early warning signals. You ALWAYS provide a
            clear risk rating (1-10) with detailed breakdown of specific risk factors and
            their potential impact on returns.""",
            verbose=True,
            max_iter=15,
            tools=[_get_serper_tool(), _get_scraper_tool()],
            allow_delegation=False
        )
        
        risk_assessment_task = Task(
            description="""
            Conduct a comprehensive risk assessment for {ticker} stock.
            
            Your search scope is: {search_scope}
            
            Evaluate multiple risk categories:
            • Market Risk: Beta, correlation with indices, sector sensitivity
            • Business Risk: Industry challenges, competitive position, regulatory risks
            • Financial Risk: Debt levels, liquidity, cash flow stability
            • Operational Risk: Management quality, business model sustainability
            • External Risk: Economic sensitivity, geopolitical factors
            
            Assessment requirements:
            1. Provide a risk rating from 1 (very low risk) to 10 (extremely high risk)
            2. Identify the primary risk factors
            3. Compare risk level to industry peers
            4. Suggest risk mitigation considerations for investors
            """,
            expected_output="""
            A risk assessment report (150-200 words) that includes:
            • Overall risk rating (1-10 scale) with clear justification
            • Primary risk factors identified and categorized
            • Comparison to industry/sector risk levels
            • Key risk considerations for different investor types
            • Risk summary in 5-7 concise bullet points
            """,
            agent=risk_manager
        )
        
        risk_crew = Crew(
            agents=[risk_manager],
            tasks=[risk_assessment_task],
            process=Process.sequential,
            verbose=True,
        )
        
        return risk_crew
        
    except Exception as e:
        print(f"Error creating risk crew: {str(e)}")
        return create_fallback_crew("risk assessment")