

# =====================================================================
# run.py - Production Runner Script
# =====================================================================

import os
import sys
from app import app

def check_environment():
    """Check if all required environment variables are set"""
    required_vars = ['SERPER_API_KEY', 'OPENAI_API_KEY']
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print("❌ Missing required environment variables:")
        for var in missing_vars:
            print(f"  - {var}")
        print("\nPlease set these in your .env file or environment.")
        return False
    
    print("✅ All required environment variables are set.")
    return True

def run_server():
    """Run the Flask server with proper configuration"""
    if not check_environment():
        sys.exit(1)
    
    print("🚀 Starting Stock Analyzer API Server...")
    print("📍 Server URL: http://localhost:5000")
    print("🏥 Health Check: http://localhost:5000/")
    print("📚 API Documentation available in README.md")
    print("-" * 60)
    
    try:
        app.run(
            host='0.0.0.0',
            port=5000,
            debug=os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
        )
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user.")
    except Exception as e:
        print(f"❌ Server error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    run_server()
