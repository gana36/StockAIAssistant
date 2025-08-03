// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import StockChart from './components/StockChart';
// import StockTable from './components/StockTable';
// import ChatWindow from './components/ChatWindow';
// import AdvancedAnalysis from './components/AdvancedAnalysis';
// import { MessageSquare, X } from 'lucide-react';

// const API_BASE_URL = 'http://localhost:5000/api';

// function App() {
//   const [ticker, setTicker] = useState('');
//   const [stockData, setStockData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [analysisLoading, setAnalysisLoading] = useState(false);
//   const [advancedAnalysisData, setAdvancedAnalysisData] = useState(null);
//   const [advancedAnalysisLoading, setAdvancedAnalysisLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [chatVisible, setChatVisible] = useState(false);

//   // Debug effect for advanced analysis data
//   useEffect(() => {
//     console.log("App - advancedAnalysisData updated:", advancedAnalysisData);
//   }, [advancedAnalysisData]);

//   // Add initial welcome message
//   useEffect(() => {
//     setMessages([
//       { 
//         id: Date.now(), 
//         type: 'system', 
//         text: 'Welcome to Stock Analyzer! Enter a ticker symbol to begin analysis.' 
//       }
//     ]);
//   }, []);

//   // Function to fetch stock data
//   const fetchStockData = async (symbol) => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       const response = await axios.get(`${API_BASE_URL}/stock-data`, {
//         params: { ticker: symbol }
//       });
      
//       setStockData(response.data.data);
//       addMessage('system', `Successfully loaded data for ${symbol}`);
      
//     } catch (err) {
//       console.error('Error fetching stock data:', err);
//       setError(`Failed to fetch data for ${symbol}: ${err.response?.data?.error || err.message}`);
//       addMessage('system', `Error: Could not retrieve data for ${symbol}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to analyze the stock based on a question
//   const analyzeStock = async (question) => {
//     if (!ticker) {
//       addMessage('system', 'Please enter a ticker symbol first before asking questions.');
//       return;
//     }
    
//     setAnalysisLoading(true);
    
//     try {
//       addMessage('system', `Analyzing ${ticker} based on your question...`);
      
//       const response = await axios.post(`${API_BASE_URL}/analyze`, {
//         ticker: ticker,
//         question: question
//       });
      
//       addMessage('system', response.data.result);
      
//     } catch (err) {
//       console.error('Error analyzing stock:', err);
//       addMessage('system', `Error during analysis: ${err.response?.data?.error || err.message}`);
//     } finally {
//       setAnalysisLoading(false);
//     }
//   };

//   // Function to fetch advanced analysis with better error handling and state management
//   const fetchAdvancedAnalysis = async (analysisType) => {
//     if (!ticker) {
//       return;
//     }
    
//     console.log(`Fetching ${analysisType} analysis for ${ticker}...`);
//     setAdvancedAnalysisLoading(true);
    
//     try {
//       let endpoint;
      
//       if (analysisType === 'all') {
//         endpoint = 'full-analysis';
//       } else if (analysisType === 'sentiment') {
//         endpoint = 'sentiment-analysis';
//       } else if (analysisType === 'technical') {
//         endpoint = 'technical-analysis';
//       } else if (analysisType === 'quantitative') {
//         endpoint = 'quantitative-analysis';
//       } else if (analysisType === 'risk') {
//         endpoint = 'risk-assessment';
//       }
      
//       addMessage('system', `Performing ${analysisType} analysis for ${ticker}...`);
      
//       const response = await axios.post(`${API_BASE_URL}/${endpoint}`, {
//         ticker: ticker
//       });
      
//       console.log(`${analysisType} API response:`, response.data);
      
//       if (response.data) {
//         // Update state with new data while preserving existing data
//         if (analysisType === 'all') {
//           // For full analysis, replace the entire object
//           setAdvancedAnalysisData(response.data);
//         } else {
//           // For individual analyses, update just that portion
//           setAdvancedAnalysisData(prevData => {
//             // Initialize if null
//             const newData = prevData || {};
            
//             if (response.data.result) {
//               // Store individual analysis result
//               return {
//                 ...newData,
//                 [`${analysisType}_analysis`]: response.data.result
//               };
//             } else {
//               // Handle unexpected response format
//               return {
//                 ...newData,
//                 [`${analysisType}_analysis`]: "Error: Unexpected response format from server"
//               };
//             }
//           });
//         }
        
//         addMessage('system', `${analysisType.charAt(0).toUpperCase() + analysisType.slice(1)} analysis completed for ${ticker}.`);
//       } else {
//         // Handle empty response
//         const errorMessage = `Failed to receive valid data for ${analysisType} analysis`;
//         console.error(errorMessage);
        
//         setAdvancedAnalysisData(prevData => {
//           const newData = prevData || {};
          
//           if (analysisType === 'all') {
//             return {
//               ...newData,
//               sentiment_analysis: errorMessage,
//               technical_analysis: errorMessage,
//               quantitative_analysis: errorMessage,
//               risk_assessment: errorMessage
//             };
//           } else {
//             return {
//               ...newData,
//               [`${analysisType}_analysis`]: errorMessage
//             };
//           }
//         });
        
//         addMessage('system', `Error: ${errorMessage}`);
//       }
      
//     } catch (err) {
//       console.error(`Error fetching ${analysisType} analysis:`, err);
      
//       // Create a user-friendly error message
//       const errorMessage = err.response?.data?.error || err.message || `Failed to perform ${analysisType} analysis`;
      
//       // Update state with the error message
//       setAdvancedAnalysisData(prevData => {
//         const newData = prevData || {};
        
//         if (analysisType === 'all') {
//           return {
//             ...newData,
//             sentiment_analysis: `Error: ${errorMessage}`,
//             technical_analysis: `Error: ${errorMessage}`,
//             quantitative_analysis: `Error: ${errorMessage}`,
//             risk_assessment: `Error: ${errorMessage}`
//           };
//         } else {
//           return {
//             ...newData,
//             [`${analysisType}_analysis`]: `Error: ${errorMessage}`
//           };
//         }
//       });
      
//       addMessage('system', `Error: Failed to perform ${analysisType} analysis for ${ticker}.`);
//     } finally {
//       setAdvancedAnalysisLoading(false);
//     }
//   };

//   // Function to add a message to the chat
//   const addMessage = (type, text) => {
//     setMessages(prevMessages => [
//       ...prevMessages,
//       { id: Date.now(), type, text }
//     ]);
//   };

//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!ticker) return;
    
//     addMessage('user', `Searching for stock data: ${ticker}`);
//     fetchStockData(ticker);
//     setAdvancedAnalysisData(null); // Reset advanced analysis data when changing ticker
//   };

//   // Handle chat message submission - FIXED
//   const handleChatSubmit = (message) => {
//     addMessage('user', message);
    
//     const lowerMessage = message.toLowerCase();
    
//     // Improved ticker symbol request detection
//     if ((lowerMessage.includes('search for ticker') || 
//          lowerMessage.includes('find ticker') ||
//          lowerMessage.includes('get ticker') ||
//          lowerMessage.includes('lookup ticker')) && 
//         !lowerMessage.includes('price') && // Prevent "price" from being recognized as a ticker
//         !lowerMessage.includes('rollercoaster')) {
        
//       // Extract potential ticker - look for the word after "ticker"
//       const tickerMatch = lowerMessage.match(/ticker\s+([a-zA-Z]+)/i);
//       let potentialTicker = '';
      
//       if (tickerMatch && tickerMatch[1]) {
//         potentialTicker = tickerMatch[1].toUpperCase();
//       } else {
//         // Fall back to last word if no clear ticker indicator
//         const words = message.split(' ');
//         potentialTicker = words[words.length - 1].toUpperCase();
//       }
      
//       if (potentialTicker.length <= 5 && potentialTicker.match(/^[A-Z]+$/) &&
//           !['PRICE', 'STOCK', 'DATA', 'INFO', 'VALUE'].includes(potentialTicker)) {
//         setTicker(potentialTicker);
//         fetchStockData(potentialTicker);
//         setAdvancedAnalysisData(null); // Reset advanced analysis data
//       } else {
//         // Assume it's an analysis question
//         analyzeStock(message);
//       }
//     } else {
//       // Assume it's an analysis question
//       analyzeStock(message);
//     }
//   };

//   // Toggle chat visibility
//   const toggleChat = () => {
//     setChatVisible(!chatVisible);
//   };

//   return (
//     <div className="app">
//       <header>
//         <h1>Stock Analyzer</h1>
//         <form onSubmit={handleSubmit} className="ticker-form">
//           <input
//             type="text"
//             value={ticker}
//             onChange={(e) => setTicker(e.target.value.toUpperCase())}
//             placeholder="Enter ticker symbol (e.g., AAPL)"
//           />
//           <button type="submit" disabled={loading}>
//             {loading ? 'Loading...' : 'Search'}
//           </button>
//         </form>
//       </header>
      
//       <main>
//         <div className="data-visualization">
//           <section className="chart-container">
//             <h2>{ticker ? `${ticker} Price History` : 'Stock Price Chart'}</h2>
//             <StockChart data={stockData} loading={loading} />
//           </section>
          
//           <section className="table-container">
//             <h2>{ticker ? `${ticker} Recent Data` : 'Stock Data Table'}</h2>
//             <StockTable data={stockData} loading={loading} />
//           </section>
          
//           <section className="analysis-container">
//             <AdvancedAnalysis 
//               ticker={ticker} 
//               onAnalysisRequest={fetchAdvancedAnalysis} 
//               analysisData={advancedAnalysisData} 
//               loading={advancedAnalysisLoading} 
//             />
//           </section>
//         </div>
        
//         {/* Chat section */}
//         <section className="chat-section">
//           <ChatWindow 
//             messages={messages} 
//             onSendMessage={handleChatSubmit} 
//             isLoading={analysisLoading} 
//           />
//         </section>
//       </main>
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StockChart from './components/StockChart';
import StockTable from './components/StockTable';
import ChatWindow from './components/ChatWindow';
import AdvancedAnalysis from './components/AdvancedAnalysis';
import AnimatedBackground from './components/AnimatedBackground';
import { MessageSquare, X } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [ticker, setTicker] = useState('');
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [advancedAnalysisData, setAdvancedAnalysisData] = useState(null);
  const [advancedAnalysisLoading, setAdvancedAnalysisLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatVisible, setChatVisible] = useState(false);

  // Debug effect for advanced analysis data
  useEffect(() => {
    console.log("App - advancedAnalysisData updated:", advancedAnalysisData);
  }, [advancedAnalysisData]);

  // Add initial welcome message
  useEffect(() => {
    setMessages([
      { 
        id: Date.now(), 
        type: 'system', 
        text: 'Welcome to Stock Analyzer! Enter a ticker symbol to begin analysis.' 
      }
    ]);
  }, []);

  // Function to fetch stock data
  const fetchStockData = async (symbol) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/stock-data`, {
        params: { ticker: symbol }
      });
      
      setStockData(response.data.data);
      addMessage('system', `Successfully loaded data for ${symbol}`);
      
      // Trigger full analysis after loading stock data
      fetchAllAnalyses(symbol);
      
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError(`Failed to fetch data for ${symbol}: ${err.response?.data?.error || err.message}`);
      addMessage('system', `Error: Could not retrieve data for ${symbol}`);
    } finally {
      setLoading(false);
    }
  };

  // New function to fetch all analyses at once
  const fetchAllAnalyses = async (symbolToAnalyze) => {
    if (!symbolToAnalyze) return;
    
    setAdvancedAnalysisLoading(true);
    addMessage('system', `Loading comprehensive analysis for ${symbolToAnalyze}...`);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/full-analysis`, {
        ticker: symbolToAnalyze
      });
      
      console.log("Full analysis response:", response.data);
      
      // Update the advanced analysis data state
      setAdvancedAnalysisData(response.data);
      
      addMessage('system', `Analysis complete. Ask me questions about ${symbolToAnalyze} in the chat!`);
      
    } catch (err) {
      console.error('Error fetching full analysis:', err);
      addMessage('system', `Error: Could not complete full analysis for ${symbolToAnalyze}`);
    } finally {
      setAdvancedAnalysisLoading(false);
    }
  };

  // Function to analyze the stock based on a question
  const analyzeStock = async (question) => {
    if (!ticker) {
      addMessage('system', 'Please enter a ticker symbol first before asking questions.');
      return;
    }
    
    setAnalysisLoading(true);
    
    try {
      addMessage('system', `Analyzing ${ticker} based on your question...`);
      
      // Send the pre-loaded analyses to the backend
      const response = await axios.post(`${API_BASE_URL}/analyze`, {
        ticker: ticker,
        question: question,
        preloadedAnalysis: advancedAnalysisData ? {
          sentiment: advancedAnalysisData.sentiment_analysis,
          technical: advancedAnalysisData.technical_analysis,
          quantitative: advancedAnalysisData.quantitative_analysis,
          risk: advancedAnalysisData.risk_assessment
        } : null
      });
      
      addMessage('system', response.data.result);
      
    } catch (err) {
      console.error('Error analyzing stock:', err);
      addMessage('system', `Error during analysis: ${err.response?.data?.error || err.message}`);
    } finally {
      setAnalysisLoading(false);
    }
  };

  // Function to fetch advanced analysis with better error handling and state management
  const fetchAdvancedAnalysis = async (analysisType) => {
    if (!ticker) {
      return;
    }
    
    // If we already have this analysis loaded, just return
    if (advancedAnalysisData && advancedAnalysisData[`${analysisType}_analysis`]) {
      console.log(`Using cached ${analysisType} analysis for ${ticker}`);
      return Promise.resolve();
    }
    
    console.log(`Fetching ${analysisType} analysis for ${ticker}...`);
    setAdvancedAnalysisLoading(true);
    
    try {
      let endpoint;
      
      if (analysisType === 'all') {
        endpoint = 'full-analysis';
      } else if (analysisType === 'sentiment') {
        endpoint = 'sentiment-analysis';
      } else if (analysisType === 'technical') {
        endpoint = 'technical-analysis';
      } else if (analysisType === 'quantitative') {
        endpoint = 'quantitative-analysis';
      } else if (analysisType === 'risk') {
        endpoint = 'risk-assessment';
      }
      
      addMessage('system', `Performing ${analysisType} analysis for ${ticker}...`);
      
      const response = await axios.post(`${API_BASE_URL}/${endpoint}`, {
        ticker: ticker
      });
      
      console.log(`${analysisType} API response:`, response.data);
      
      if (response.data) {
        // Update state with new data while preserving existing data
        if (analysisType === 'all') {
          // For full analysis, replace the entire object
          setAdvancedAnalysisData(response.data);
        } else {
          // For individual analyses, update just that portion
          setAdvancedAnalysisData(prevData => {
            // Initialize if null
            const newData = prevData || {};
            
            if (response.data.result) {
              // Store individual analysis result
              return {
                ...newData,
                [`${analysisType}_analysis`]: response.data.result
              };
            } else {
              // Handle unexpected response format
              return {
                ...newData,
                [`${analysisType}_analysis`]: "Error: Unexpected response format from server"
              };
            }
          });
        }
        
        addMessage('system', `${analysisType.charAt(0).toUpperCase() + analysisType.slice(1)} analysis completed for ${ticker}.`);
      } else {
        // Handle empty response
        const errorMessage = `Failed to receive valid data for ${analysisType} analysis`;
        console.error(errorMessage);
        
        setAdvancedAnalysisData(prevData => {
          const newData = prevData || {};
          
          if (analysisType === 'all') {
            return {
              ...newData,
              sentiment_analysis: errorMessage,
              technical_analysis: errorMessage,
              quantitative_analysis: errorMessage,
              risk_assessment: errorMessage
            };
          } else {
            return {
              ...newData,
              [`${analysisType}_analysis`]: errorMessage
            };
          }
        });
        
        addMessage('system', `Error: ${errorMessage}`);
      }
      
    } catch (err) {
      console.error(`Error fetching ${analysisType} analysis:`, err);
      
      // Create a user-friendly error message
      const errorMessage = err.response?.data?.error || err.message || `Failed to perform ${analysisType} analysis`;
      
      // Update state with the error message
      setAdvancedAnalysisData(prevData => {
        const newData = prevData || {};
        
        if (analysisType === 'all') {
          return {
            ...newData,
            sentiment_analysis: `Error: ${errorMessage}`,
            technical_analysis: `Error: ${errorMessage}`,
            quantitative_analysis: `Error: ${errorMessage}`,
            risk_assessment: `Error: ${errorMessage}`
          };
        } else {
          return {
            ...newData,
            [`${analysisType}_analysis`]: `Error: ${errorMessage}`
          };
        }
      });
      
      addMessage('system', `Error: Failed to perform ${analysisType} analysis for ${ticker}.`);
    } finally {
      setAdvancedAnalysisLoading(false);
    }
    
    return Promise.resolve();
  };

  // Function to add a message to the chat
  const addMessage = (type, text) => {
    setMessages(prevMessages => [
      ...prevMessages,
      { id: Date.now(), type, text }
    ]);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ticker) return;
    
    addMessage('user', `Searching for stock data: ${ticker}`);
    fetchStockData(ticker);
    setAdvancedAnalysisData(null); // Reset advanced analysis data when changing ticker
  };

  // Handle chat message submission
  const handleChatSubmit = (message) => {
    addMessage('user', message);
    
    const lowerMessage = message.toLowerCase();
    
    // Improved ticker symbol request detection
    if ((lowerMessage.includes('search for ticker') || 
         lowerMessage.includes('find ticker') ||
         lowerMessage.includes('get ticker') ||
         lowerMessage.includes('lookup ticker')) && 
        !lowerMessage.includes('price') && // Prevent "price" from being recognized as a ticker
        !lowerMessage.includes('rollercoaster')) {
        
      // Extract potential ticker - look for the word after "ticker"
      const tickerMatch = lowerMessage.match(/ticker\s+([a-zA-Z]+)/i);
      let potentialTicker = '';
      
      if (tickerMatch && tickerMatch[1]) {
        potentialTicker = tickerMatch[1].toUpperCase();
      } else {
        // Fall back to last word if no clear ticker indicator
        const words = message.split(' ');
        potentialTicker = words[words.length - 1].toUpperCase();
      }
      
      if (potentialTicker.length <= 5 && potentialTicker.match(/^[A-Z]+$/) &&
          !['PRICE', 'STOCK', 'DATA', 'INFO', 'VALUE'].includes(potentialTicker)) {
        setTicker(potentialTicker);
        fetchStockData(potentialTicker);
        setAdvancedAnalysisData(null); // Reset advanced analysis data
      } else {
        // Assume it's an analysis question
        analyzeStock(message);
      }
    } else {
      // Assume it's an analysis question
      analyzeStock(message);
    }
  };

  // Toggle chat visibility
  const toggleChat = () => {
    setChatVisible(!chatVisible);
  };

  return (
    <div className="app">
      <AnimatedBackground />
      <header>
        <h1>Stock Analyzer</h1>
        <form onSubmit={handleSubmit} className="ticker-form">
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="Enter ticker symbol (e.g., AAPL)"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Search'}
          </button>
        </form>
      </header>
      
      <main>
        <div className="data-visualization">
          <section className="chart-container">
            <h2>{ticker ? `${ticker} Price History` : 'Stock Price Chart'}</h2>
            <StockChart data={stockData} loading={loading} />
          </section>
          
          <section className="table-container">
            <h2>{ticker ? `${ticker} Recent Data` : 'Stock Data Table'}</h2>
            <StockTable data={stockData} loading={loading} />
          </section>
          
          <section className="analysis-container">
            <AdvancedAnalysis 
              ticker={ticker} 
              onAnalysisRequest={fetchAdvancedAnalysis} 
              analysisData={advancedAnalysisData} 
              loading={advancedAnalysisLoading} 
            />
          </section>
        </div>
        
        {/* Chat section */}
        <section className="chat-section">
          <ChatWindow 
            messages={messages} 
            onSendMessage={handleChatSubmit} 
            isLoading={analysisLoading || advancedAnalysisLoading} 
          />
        </section>
      </main>
    </div>
  );
}

export default App;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import StockChart from './components/StockChart';
// import StockTable from './components/StockTable';
// import ChatWindow from './components/ChatWindow';
// import AdvancedAnalysis from './components/AdvancedAnalysis';
// import { MessageSquare, X } from 'lucide-react';

// const API_BASE_URL = 'http://localhost:5000/api';

// function App() {
//   const [ticker, setTicker] = useState('');
//   const [stockData, setStockData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [analysisLoading, setAnalysisLoading] = useState(false);
//   const [advancedAnalysisData, setAdvancedAnalysisData] = useState(null);
//   const [advancedAnalysisLoading, setAdvancedAnalysisLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [chatVisible, setChatVisible] = useState(false);

//   // Debug effect for advanced analysis data
//   useEffect(() => {
//     console.log("App - advancedAnalysisData updated:", advancedAnalysisData);
//   }, [advancedAnalysisData]);

//   // Add initial welcome message
//   useEffect(() => {
//     setMessages([
//       { 
//         id: Date.now(), 
//         type: 'system', 
//         text: 'Welcome to Stock Analyzer! Enter a ticker symbol to begin analysis.' 
//       }
//     ]);
//   }, []);

//   // Function to fetch stock data
//   const fetchStockData = async (symbol) => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       const response = await axios.get(`${API_BASE_URL}/stock-data`, {
//         params: { ticker: symbol }
//       });
      
//       setStockData(response.data.data);
//       addMessage('system', `Successfully loaded data for ${symbol}`);
      
//       // Trigger full analysis after loading stock data
//       fetchAllAnalyses(symbol);
      
//     } catch (err) {
//       console.error('Error fetching stock data:', err);
//       setError(`Failed to fetch data for ${symbol}: ${err.response?.data?.error || err.message}`);
//       addMessage('system', `Error: Could not retrieve data for ${symbol}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // New function to fetch all analyses at once
//   const fetchAllAnalyses = async (symbolToAnalyze) => {
//     if (!symbolToAnalyze) return;
    
//     setAdvancedAnalysisLoading(true);
//     addMessage('system', `Loading comprehensive analysis for ${symbolToAnalyze}...`);
    
//     try {
//       const response = await axios.post(`${API_BASE_URL}/full-analysis`, {
//         ticker: symbolToAnalyze
//       });
      
//       console.log("Full analysis response:", response.data);
      
//       // Update the advanced analysis data state
//       setAdvancedAnalysisData(response.data);
      
//       addMessage('system', `Analysis complete. Ask me questions about ${symbolToAnalyze} in the chat!`);
      
//     } catch (err) {
//       console.error('Error fetching full analysis:', err);
//       addMessage('system', `Error: Could not complete full analysis for ${symbolToAnalyze}`);
//     } finally {
//       setAdvancedAnalysisLoading(false);
//     }
//   };

//   // Function to analyze the stock based on a question
//   const analyzeStock = async (question) => {
//     if (!ticker) {
//       addMessage('system', 'Please enter a ticker symbol first before asking questions.');
//       return;
//     }
    
//     setAnalysisLoading(true);
    
//     try {
//       addMessage('system', `Analyzing ${ticker} based on your question...`);
      
//       // Send the pre-loaded analyses to the backend
//       const response = await axios.post(`${API_BASE_URL}/analyze`, {
//         ticker: ticker,
//         question: question,
//         preloadedAnalysis: advancedAnalysisData ? {
//           sentiment: advancedAnalysisData.sentiment_analysis,
//           technical: advancedAnalysisData.technical_analysis,
//           quantitative: advancedAnalysisData.quantitative_analysis,
//           risk: advancedAnalysisData.risk_assessment
//         } : null
//       });
      
//       addMessage('system', response.data.result);
      
//     } catch (err) {
//       console.error('Error analyzing stock:', err);
//       addMessage('system', `Error during analysis: ${err.response?.data?.error || err.message}`);
//     } finally {
//       setAnalysisLoading(false);
//     }
//   };

//   // Function to fetch advanced analysis with better error handling and state management
//   const fetchAdvancedAnalysis = async (analysisType) => {
//     if (!ticker) {
//       return;
//     }
    
//     // If we already have this analysis loaded, just return
//     if (advancedAnalysisData && advancedAnalysisData[`${analysisType}_analysis`]) {
//       console.log(`Using cached ${analysisType} analysis for ${ticker}`);
//       return Promise.resolve();
//     }
    
//     console.log(`Fetching ${analysisType} analysis for ${ticker}...`);
//     setAdvancedAnalysisLoading(true);
    
//     try {
//       let endpoint;
      
//       if (analysisType === 'all') {
//         endpoint = 'full-analysis';
//       } else if (analysisType === 'sentiment') {
//         endpoint = 'sentiment-analysis';
//       } else if (analysisType === 'technical') {
//         endpoint = 'technical-analysis';
//       } else if (analysisType === 'quantitative') {
//         endpoint = 'quantitative-analysis';
//       } else if (analysisType === 'risk') {
//         endpoint = 'risk-assessment';
//       }
      
//       addMessage('system', `Performing ${analysisType} analysis for ${ticker}...`);
      
//       const response = await axios.post(`${API_BASE_URL}/${endpoint}`, {
//         ticker: ticker
//       });
      
//       console.log(`${analysisType} API response:`, response.data);
      
//       if (response.data) {
//         // Update state with new data while preserving existing data
//         if (analysisType === 'all') {
//           // For full analysis, replace the entire object
//           setAdvancedAnalysisData(response.data);
//         } else {
//           // For individual analyses, update just that portion
//           setAdvancedAnalysisData(prevData => {
//             // Initialize if null
//             const newData = prevData || {};
            
//             if (response.data.result) {
//               // Store individual analysis result
//               return {
//                 ...newData,
//                 [`${analysisType}_analysis`]: response.data.result
//               };
//             } else {
//               // Handle unexpected response format
//               return {
//                 ...newData,
//                 [`${analysisType}_analysis`]: "Error: Unexpected response format from server"
//               };
//             }
//           });
//         }
        
//         addMessage('system', `${analysisType.charAt(0).toUpperCase() + analysisType.slice(1)} analysis completed for ${ticker}.`);
//       } else {
//         // Handle empty response
//         const errorMessage = `Failed to receive valid data for ${analysisType} analysis`;
//         console.error(errorMessage);
        
//         setAdvancedAnalysisData(prevData => {
//           const newData = prevData || {};
          
//           if (analysisType === 'all') {
//             return {
//               ...newData,
//               sentiment_analysis: errorMessage,
//               technical_analysis: errorMessage,
//               quantitative_analysis: errorMessage,
//               risk_assessment: errorMessage
//             };
//           } else {
//             return {
//               ...newData,
//               [`${analysisType}_analysis`]: errorMessage
//             };
//           }
//         });
        
//         addMessage('system', `Error: ${errorMessage}`);
//       }
      
//     } catch (err) {
//       console.error(`Error fetching ${analysisType} analysis:`, err);
      
//       // Create a user-friendly error message
//       const errorMessage = err.response?.data?.error || err.message || `Failed to perform ${analysisType} analysis`;
      
//       // Update state with the error message
//       setAdvancedAnalysisData(prevData => {
//         const newData = prevData || {};
        
//         if (analysisType === 'all') {
//           return {
//             ...newData,
//             sentiment_analysis: `Error: ${errorMessage}`,
//             technical_analysis: `Error: ${errorMessage}`,
//             quantitative_analysis: `Error: ${errorMessage}`,
//             risk_assessment: `Error: ${errorMessage}`
//           };
//         } else {
//           return {
//             ...newData,
//             [`${analysisType}_analysis`]: `Error: ${errorMessage}`
//           };
//         }
//       });
      
//       addMessage('system', `Error: Failed to perform ${analysisType} analysis for ${ticker}.`);
//     } finally {
//       setAdvancedAnalysisLoading(false);
//     }
    
//     return Promise.resolve();
//   };

//   // Function to add a message to the chat
//   const addMessage = (type, text) => {
//     setMessages(prevMessages => [
//       ...prevMessages,
//       { id: Date.now(), type, text }
//     ]);
//   };

//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!ticker) return;
    
//     addMessage('user', `Searching for stock data: ${ticker}`);
//     fetchStockData(ticker);
//     setAdvancedAnalysisData(null); // Reset advanced analysis data when changing ticker
//   };

//   // Handle chat message submission
//   const handleChatSubmit = (message) => {
//     addMessage('user', message);
    
//     const lowerMessage = message.toLowerCase();
    
//     // Improved ticker symbol request detection
//     if ((lowerMessage.includes('search for ticker') || 
//          lowerMessage.includes('find ticker') ||
//          lowerMessage.includes('get ticker') ||
//          lowerMessage.includes('lookup ticker')) && 
//         !lowerMessage.includes('price') && // Prevent "price" from being recognized as a ticker
//         !lowerMessage.includes('rollercoaster')) {
        
//       // Extract potential ticker - look for the word after "ticker"
//       const tickerMatch = lowerMessage.match(/ticker\s+([a-zA-Z]+)/i);
//       let potentialTicker = '';
      
//       if (tickerMatch && tickerMatch[1]) {
//         potentialTicker = tickerMatch[1].toUpperCase();
//       } else {
//         // Fall back to last word if no clear ticker indicator
//         const words = message.split(' ');
//         potentialTicker = words[words.length - 1].toUpperCase();
//       }
      
//       if (potentialTicker.length <= 5 && potentialTicker.match(/^[A-Z]+$/) &&
//           !['PRICE', 'STOCK', 'DATA', 'INFO', 'VALUE'].includes(potentialTicker)) {
//         setTicker(potentialTicker);
//         fetchStockData(potentialTicker);
//         setAdvancedAnalysisData(null); // Reset advanced analysis data
//       } else {
//         // Assume it's an analysis question
//         analyzeStock(message);
//       }
//     } else {
//       // Assume it's an analysis question
//       analyzeStock(message);
//     }
//   };

//   // Toggle chat visibility
//   const toggleChat = () => {
//     setChatVisible(!chatVisible);
//   };

//   return (
//     <div className="app">
//       <header>
//         <h1>Stock Analyzer</h1>
//         <form onSubmit={handleSubmit} className="ticker-form">
//           <input
//             type="text"
//             value={ticker}
//             onChange={(e) => setTicker(e.target.value.toUpperCase())}
//             placeholder="Enter ticker symbol (e.g., AAPL)"
//           />
//           <button type="submit" disabled={loading}>
//             {loading ? 'Loading...' : 'Search'}
//           </button>
//         </form>
//       </header>
      
//       <main>
//         <div className="data-visualization">
//           <section className="chart-container">
//             <h2>{ticker ? `${ticker} Price History` : 'Stock Price Chart'}</h2>
//             <StockChart data={stockData} loading={loading} />
//           </section>
          
//           <section className="table-container">
//             <h2>{ticker ? `${ticker} Recent Data` : 'Stock Data Table'}</h2>
//             <StockTable data={stockData} loading={loading} />
//           </section>
          
//           <section className="analysis-container">
//             <AdvancedAnalysis 
//               ticker={ticker} 
//               onAnalysisRequest={fetchAdvancedAnalysis} 
//               analysisData={advancedAnalysisData} 
//               loading={advancedAnalysisLoading} 
//             />
//           </section>
//         </div>
        
//         {/* Chat section */}
//         <section className="chat-section">
//           <ChatWindow 
//             messages={messages} 
//             onSendMessage={handleChatSubmit} 
//             isLoading={analysisLoading || advancedAnalysisLoading} 
//           />
//         </section>
//       </main>
//     </div>
//   );
// }

// export default App;