
# =====================================================================
# crew.py - Alternative Crew Implementation (Optional)
# =====================================================================

from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai_tools import SerperDevTool, ScrapeWebsiteTool
from dotenv import load_dotenv
import os

load_dotenv()

@CrewBase
class FinanceAssistant():
    """FinanceAssistant crew that uses web search and scraping instead of file operations"""
    agents_config = 'config/agents.yaml'
    tasks_config = 'config/tasks.yaml'

    @agent
    def researcher(self) -> Agent:
        return Agent(
            config=self.agents_config['researcher'],
            verbose=True,
            tools=[SerperDevTool()]
        )

    @agent
    def webreader(self) -> Agent:
        return Agent(
            config=self.agents_config['webreader'],
            verbose=True,
            tools=[ScrapeWebsiteTool()]
        )
    
    @agent
    def reporting_analyst(self) -> Agent:
        return Agent(
            config=self.agents_config['reporting_analyst'],
            verbose=True,
            tools=[SerperDevTool(), ScrapeWebsiteTool()]
        )

    @agent
    def sentiment_analyst(self) -> Agent:
        return Agent(
            config=self.agents_config['sentiment_analyst'],
            verbose=True,
            tools=[SerperDevTool(), ScrapeWebsiteTool()]
        )

    @agent
    def technical_analyst(self) -> Agent:
        return Agent(
            config=self.agents_config['technical_analyst'],
            verbose=True,
            tools=[SerperDevTool(), ScrapeWebsiteTool()]
        )

    @agent
    def quantitative_analyst(self) -> Agent:
        return Agent(
            config=self.agents_config['quantitative_analyst'],
            verbose=True,
            tools=[SerperDevTool(), ScrapeWebsiteTool()]
        )

    @agent
    def risk_manager(self) -> Agent:
        return Agent(
            config=self.agents_config['risk_manager'],
            verbose=True,
            tools=[SerperDevTool(), ScrapeWebsiteTool()]
        )
    
    @task
    def research_task(self) -> Task:
        return Task(
            config=self.tasks_config['research_task'],
        )

    @task
    def reporting_task(self) -> Task:
        return Task(
            config=self.tasks_config['reporting_task'],
        )

    @task
    def sentiment_analysis_task(self) -> Task:
        return Task(
            config=self.tasks_config['sentiment_analysis_task'],
        )

    @task
    def technical_analysis_task(self) -> Task:
        return Task(
            config=self.tasks_config['technical_analysis_task'],
        )

    @task
    def quantitative_analysis_task(self) -> Task:
        return Task(
            config=self.tasks_config['quantitative_analysis_task'],
        )

    @task
    def risk_assessment_task(self) -> Task:
        return Task(
            config=self.tasks_config['risk_assessment_task'],
        )
    
    @crew
    def crew(self) -> Crew:
        """Creates the main FinanceAssistant crew"""
        return Crew(
            agents=self.agents,  # Automatically created by the @agent decorator
            tasks=self.tasks,    # Automatically created by the @task decorator
            process=Process.sequential,
            verbose=True,
        )
