
# =====================================================================
# setup.py - Installation Script
# =====================================================================

from setuptools import setup, find_packages

setup(
    name="stock-analyzer-backend",
    version="1.0.0",
    description="AI-powered stock analysis backend using CrewAI",
    author="Your Name",
    author_email="your.email@example.com",
    packages=find_packages(),
    install_requires=[
        "flask>=3.0.0",
        "flask-cors>=4.0.0",
        "python-dotenv>=1.0.0",
        "requests>=2.31.0",
        "pandas>=2.1.4",
        "yfinance>=0.2.28",
        "crewai>=0.41.1",
        "crewai-tools>=0.4.26",
        "agentops>=0.2.7",
    ],
    python_requires=">=3.8",
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Financial and Insurance Industry",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
    ],
)