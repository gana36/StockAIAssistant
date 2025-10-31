# =====================================================================
# README.md - Documentation
# =====================================================================

"""
# Stock Analyzer Backend API

A powerful AI-driven stock analysis backend built with Flask and CrewAI.

## Features

- 📈 Real-time stock data fetching via Yahoo Finance
- 🤖 AI-powered analysis using CrewAI agents
- 📊 Comprehensive analysis types:
  - Sentiment Analysis
  - Technical Analysis  
  - Quantitative Analysis
  - Risk Assessment
- 💬 Intelligent chat interface
- 🔄 Full analysis automation
- 🚀 RESTful API with CORS support

## Quick Start

### 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd stock-analyzer-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configuration

Create a `.env` file in the root directory:

```env
SERPER_API_KEY=your_serper_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
AGENTOPS_API_KEY=your_agentops_api_key_here
FLASK_ENV=development
FLASK_DEBUG=True
```

### 3. Run the Server

```bash
python app.py
```

Server will be available at: http://localhost:5000

## API Endpoints

### Stock Data
- `GET /api/stock-data?ticker=AAPL` - Get historical stock data

### Analysis Endpoints
- `POST /api/sentiment-analysis` - Run sentiment analysis
- `POST /api/technical-analysis` - Run technical analysis
- `POST /api/quantitative-analysis` - Run quantitative analysis
- `POST /api/risk-assessment` - Run risk assessment
- `POST /api/full-analysis` - Run all analyses
- `POST /api/analyze` - AI chat analysis

### Health Check
- `GET /` - Health check endpoint

## Usage Examples

### Get Stock Data
```bash
curl "http://localhost:5000/api/stock-data?ticker=AAPL"
```

### Run Sentiment Analysis
```bash
curl -X POST "http://localhost:5000/api/sentiment-analysis" \
  -H "Content-Type: application/json" \
  -d '{"ticker": "AAPL"}'
```

### Chat Analysis
```bash
curl -X POST "http://localhost:5000/api/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "ticker": "AAPL",
    "question": "What is the current outlook for Apple stock?",
    "preloadedAnalysis": {...}
  }'
```

## Project Structure

```
backend/
├── app.py              # Main Flask application
├── crew_handlers.py    # CrewAI crew creation functions
├── requirements.txt    # Python dependencies
├── .env               # Environment variables
├── config/            # Configuration files
│   ├── agents.yaml    # Agent configurations
│   └── tasks.yaml     # Task configurations
├── main.py            # Test script
├── run.py             # Production runner
└── setup.py           # Installation script
```

## Development

### Running Tests
```bash
python main.py
```

### Production Deployment
```bash
python run.py
```

### Docker Deployment
```bash
docker-compose up -d
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
"""