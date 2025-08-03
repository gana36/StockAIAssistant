// import React, { useState, useEffect } from 'react';

// const AdvancedAnalysis = ({ ticker, onAnalysisRequest, analysisData, loading }) => {
//   const [activeTab, setActiveTab] = useState('sentiment');
//   const [errorState, setErrorState] = useState(null);
//   const [lastAnalysisTime, setLastAnalysisTime] = useState({});
  
//   // Reset error state when ticker changes
//   useEffect(() => {
//     setErrorState(null);
//     // Reset last analysis time when ticker changes
//     setLastAnalysisTime({});
//   }, [ticker]);
  
//   // Reset error state when analysis data changes
//   useEffect(() => {
//     if (analysisData) {
//       setErrorState(null);
//     }
//   }, [analysisData]);

//   if (!ticker) {
//     return (
//       <div className="empty-analysis">
//         Enter a ticker symbol to view advanced analysis
//       </div>
//     );
//   }

//   const renderAnalysisContent = () => {
//     if (loading) {
//       return (
//         <div className="loading-analysis">
//           <div className="loading-spinner">
//             <div className="spinner"></div>
//           </div>
//           <p>Analyzing {ticker}...</p>
//           <p className="loading-subtext">This may take up to 2 minutes. We're gathering data from financial sources.</p>
//         </div>
//       );
//     }

//     if (errorState) {
//       return (
//         <div className="error-analysis">
//           <p>An error occurred: {errorState}</p>
//           <button 
//             className="retry-button"
//                           onClick={() => {
//               // Don't retry if already loading
//               if (loading) return;
              
//               setErrorState(null);
              
//               // Add debounce for retry button too
//               const currentTime = Date.now();
//               const lastClickTime = lastAnalysisTime[`${activeTab}_retry_click`] || 0;
//               const debounceTime = 1000; // 1 second debounce
              
//               if (currentTime - lastClickTime > debounceTime) {
//                 // Update click time first
//                 setLastAnalysisTime(prev => ({
//                   ...prev,
//                   [`${activeTab}_retry_click`]: currentTime
//                 }));
                
//                 onAnalysisRequest(activeTab)
//                   .then(() => {
//                     // Update last analysis time
//                     setLastAnalysisTime(prev => ({
//                       ...prev,
//                       [activeTab]: Date.now()
//                     }));
//                   });
//               }
//             }}
//           >
//             Retry {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Analysis
//           </button>
//         </div>
//       );
//     }

//     if (!analysisData) {
//       return (
//         <div className="no-analysis-data">
//           <p>Click on any analysis type to generate insights for {ticker}</p>
//         </div>
//       );
//     }
    
//     // Check if the result contains error messages
//     let currentData;
//     let isError = false;
    
//     // Get the appropriate data based on the active tab
//     if (analysisData[`${activeTab}_analysis`]) {
//       // First check for tab_analysis format (most common)
//       currentData = analysisData[`${activeTab}_analysis`];
//     } else if (analysisData.result && activeTab === Object.keys(lastAnalysisTime).find(key => 
//       lastAnalysisTime[key] === Math.max(...Object.values(lastAnalysisTime)))) {
//       // Check if result might be from the most recently requested tab
//       currentData = analysisData.result;
//     } else if (analysisData[activeTab]) {
//       // Legacy format
//       currentData = analysisData[activeTab];
//     }
    
//     // Check if the data contains an error message
//     if (currentData && typeof currentData === 'string') {
//       isError = currentData.toLowerCase().includes("error") || 
//                 currentData.toLowerCase().includes("could not be completed") ||
//                 currentData.toLowerCase().includes("timed out");
//     }

//     if (!currentData) {
//       return (
//         <div className="no-analysis-data">
//           <p>No {activeTab} analysis data available for {ticker}</p>
//           <button 
//             className="retry-button"
//             onClick={() => {
//               onAnalysisRequest(activeTab);
//               // Update last analysis time
//               setLastAnalysisTime(prev => ({
//                 ...prev,
//                 [activeTab]: Date.now()
//               }));
//             }}
//           >
//             Generate {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Analysis
//           </button>
//         </div>
//       );
//     }

//     if (isError) {
//       return (
//         <div className="error-analysis">
//           <p>{currentData}</p>
//           <button 
//             className="retry-button"
//             onClick={() => {
//               onAnalysisRequest(activeTab);
//               // Update last analysis time
//               setLastAnalysisTime(prev => ({
//                 ...prev,
//                 [activeTab]: Date.now()
//               }));
//             }}
//           >
//             Retry {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Analysis
//           </button>
//         </div>
//       );
//     }

//     // Enhanced formatting for the analysis content with metrics extraction
//     const formatAnalysisContent = (content) => {
//       if (!content) return '';
      
//       // First pass: Extract sections for potential metrics
//       const sections = {};
//       let currentSection = 'main';
//       sections[currentSection] = [];
      
//       const lines = content.split('\n');
      
//       lines.forEach(line => {
//         if (line.startsWith('# ')) {
//           currentSection = 'title';
//           sections[currentSection] = line.substring(2);
//         } else if (line.startsWith('## ')) {
//           currentSection = line.substring(3).toLowerCase().replace(/\s+/g, '_');
//           sections[currentSection] = [];
//         } else if (currentSection !== 'title') {
//           sections[currentSection].push(line);
//         }
//       });
      
//       // Extract metrics if this is a quantitative or technical or risk analysis
//       let metricsHtml = '';
//       if (activeTab === 'technical' || activeTab === 'quantitative' || activeTab === 'risk') {
//         const metrics = [];
        
//         // Look for metrics in various sections
//         Object.keys(sections).forEach(section => {
//           if (Array.isArray(sections[section])) {
//             sections[section].forEach(line => {
//               // Match bullet points with metric values like "- **Beta:** 1.2"
//               const metricMatch = line.match(/[-*]\s+\*\*(.*?):\*\*\s+(.*)/);
//               if (metricMatch) {
//                 const [_, name, value] = metricMatch;
                
//                 // Determine if it's a positive, negative, or neutral metric
//                 let valueClass = 'neutral';
//                 if (value.includes('+') || 
//                     value.toLowerCase().includes('positive') || 
//                     value.toLowerCase().includes('strong buy') ||
//                     value.toLowerCase().includes('low risk')) {
//                   valueClass = 'positive';
//                 } else if (value.includes('-') || 
//                            value.toLowerCase().includes('negative') || 
//                            value.toLowerCase().includes('sell') ||
//                            value.toLowerCase().includes('high risk')) {
//                   valueClass = 'negative';
//                 }
                
//                 metrics.push({ name, value, class: valueClass });
//               }
//             });
//           }
//         });
        
//         if (metrics.length > 0) {
//           metricsHtml = `<div class="metrics-container">
//             ${metrics.map(metric => `
//               <div class="metric-card">
//                 <div class="metric-title">${metric.name}</div>
//                 <div class="metric-value ${metric.class}">${metric.value}</div>
//               </div>
//             `).join('')}
//           </div>`;
//         }
//       }
      
//       // Create sentiment indicator for sentiment analysis
//       let sentimentHtml = '';
//       if (activeTab === 'sentiment') {
//         const sentimentMatch = content.match(/Sentiment Score:\s*([-+]?\d+)/i);
//         const sentimentTextMatch = content.match(/Overall.+Sentiment:\s*([A-Za-z\s]+)/i);
        
//         if (sentimentMatch && sentimentTextMatch) {
//           const score = parseInt(sentimentMatch[1]);
//           const sentimentText = sentimentTextMatch[1].trim();
          
//           let sentimentClass = 'neutral';
//           if (score > 20) sentimentClass = 'positive';
//           else if (score < -20) sentimentClass = 'negative';
          
//           sentimentHtml = `<div class="sentiment-indicator">
//             <div class="metric-card">
//               <div class="metric-title">Sentiment Score</div>
//               <div class="metric-value ${sentimentClass}">${score}</div>
//             </div>
//             <div class="metric-card">
//               <div class="metric-title">Overall Sentiment</div>
//               <div class="metric-value ${sentimentClass}">${sentimentText}</div>
//             </div>
//           </div>`;
//         }
//       }
      
//       // Second pass: Convert Markdown to HTML with enhanced styling
//       // Convert Markdown-style headers
//       let formattedContent = content
//         .replace(/^#\s+(.*$)/gm, '<h2>$1</h2>')
//         .replace(/^##\s+(.*$)/gm, '<h3>$1</h3>')
//         .replace(/^###\s+(.*$)/gm, '<h4>$1</h4>');
      
//       // Convert Markdown-style lists
//       formattedContent = formattedContent
//         .replace(/^[-*]\s+(.*$)/gm, '<li>$1</li>')
//         .replace(/(<li>.*<\/li>\n)+/g, '<ul>$&</ul>');
      
//       // Convert line breaks to paragraphs, but preserve lists
//       formattedContent = formattedContent
//         .replace(/(?:\r\n|\r|\n){2,}/g, '</p><p>')
//         .replace(/(?:\r\n|\r|\n)/g, '<br>');
      
//       // Wrap in paragraph tags if not already
//       const wrapped = formattedContent.startsWith('<p>') 
//         ? formattedContent 
//         : `<p>${formattedContent}</p>`;
      
//       // Insert metrics or sentiment HTML in appropriate places
//       let finalContent = wrapped;
      
//       // Add metrics below the first h3 (which is usually the key metrics section)
//       if (metricsHtml) {
//         const firstH3Index = finalContent.indexOf('</h3>');
//         if (firstH3Index !== -1) {
//           finalContent = finalContent.substring(0, firstH3Index + 5) + 
//                        metricsHtml + 
//                        finalContent.substring(firstH3Index + 5);
//         } else {
//           // If no h3 found, add metrics after the first h2
//           const firstH2Index = finalContent.indexOf('</h2>');
//           if (firstH2Index !== -1) {
//             finalContent = finalContent.substring(0, firstH2Index + 5) + 
//                          metricsHtml + 
//                          finalContent.substring(firstH2Index + 5);
//           }
//         }
//       }
      
//       // Add sentiment indicator below the first h2 for sentiment analysis
//       if (sentimentHtml) {
//         const firstH2Index = finalContent.indexOf('</h2>');
//         if (firstH2Index !== -1) {
//           finalContent = finalContent.substring(0, firstH2Index + 5) + 
//                        sentimentHtml + 
//                        finalContent.substring(firstH2Index + 5);
//         }
//       }
      
//       return finalContent;
//     };

//     return (
//       <div className="analysis-content">
//         {analysisData.basic_summary && activeTab === 'sentiment' && (
//           <div className="basic-summary" dangerouslySetInnerHTML={{ __html: formatAnalysisContent(analysisData.basic_summary) }} />
//         )}
//         <div className="analysis-text" dangerouslySetInnerHTML={{ __html: formatAnalysisContent(currentData) }} />
//       </div>
//     );
//   };

//   // FIXED - Improved tab click handler with proper data caching and in-progress check
//   const handleTabClick = (tab) => {
//     setActiveTab(tab);
    
//     // Don't make a request if we're already loading
//     if (loading) {
//       console.log(`Ignoring ${tab} analysis request - another analysis is already in progress`);
//       return;
//     }
    
//     // Improved data existence check
//     const hasData = 
//       analysisData && 
//       (analysisData[`${tab}_analysis`] || analysisData[tab]);
    
//     // Add cache expiry - don't request new data if it was fetched in the last 10 minutes
//     const cacheTime = 10 * 60 * 1000; // 10 minutes in milliseconds
//     const isDataFresh = lastAnalysisTime[tab] && 
//                        (Date.now() - lastAnalysisTime[tab] < cacheTime);
    
//     if (!hasData && !isDataFresh) {
//       // Add a debounce flag in the component state to prevent multiple rapid clicks
//       const currentTime = Date.now();
//       const lastClickTime = lastAnalysisTime[`${tab}_click`] || 0;
//       const debounceTime = 1000; // 1 second debounce
      
//       if (currentTime - lastClickTime > debounceTime) {
//         // Update click time first to prevent race conditions
//         setLastAnalysisTime(prev => ({
//           ...prev,
//           [`${tab}_click`]: currentTime
//         }));
        
//         onAnalysisRequest(tab)
//           .then(() => {
//             // Update the time this analysis was last run
//             setLastAnalysisTime(prev => ({
//               ...prev,
//               [tab]: Date.now()
//             }));
//           })
//           .catch(error => {
//             setErrorState(error.message || "Failed to fetch analysis");
//           });
//       } else {
//         console.log(`Ignoring ${tab} analysis request - too soon after previous click`);
//       }
//     }
//   };

//   return (
//     <div className="advanced-analysis">
//       <div className="analysis-header">
//         <h2>Advanced Analysis for {ticker}</h2>
//         <div className="tab-container">
//           <button
//             className={`tab-button ${activeTab === 'sentiment' ? 'active' : ''}`}
//             onClick={() => handleTabClick('sentiment')}
//           >
//             Sentiment
//           </button>
//           <button
//             className={`tab-button ${activeTab === 'technical' ? 'active' : ''}`}
//             onClick={() => handleTabClick('technical')}
//           >
//             Technical
//           </button>
//           <button
//             className={`tab-button ${activeTab === 'quantitative' ? 'active' : ''}`}
//             onClick={() => handleTabClick('quantitative')}
//           >
//             Quantitative
//           </button>
//           <button
//             className={`tab-button ${activeTab === 'risk' ? 'active' : ''}`}
//             onClick={() => handleTabClick('risk')}
//           >
//             Risk
//           </button>
//           <button
//             className="run-all-button"
//             onClick={() => {
//               // Prevent multiple "Run All" clicks while loading
//               if (loading) {
//                 console.log("Ignoring 'Run All' request - analysis already in progress");
//                 return;
//               }
              
//               // Add debounce for "Run All" button too
//               const currentTime = Date.now();
//               const lastClickTime = lastAnalysisTime[`all_click`] || 0;
//               const debounceTime = 1000; // 1 second debounce
              
//               if (currentTime - lastClickTime > debounceTime) {
//                 // Update click time first
//                 setLastAnalysisTime(prev => ({
//                   ...prev,
//                   [`all_click`]: currentTime
//                 }));
                
//                 setErrorState(null);
//                 onAnalysisRequest('all')
//                   .then(() => {
//                     // Update all analysis times
//                     const now = Date.now();
//                     setLastAnalysisTime(prev => ({
//                       ...prev,
//                       sentiment: now,
//                       technical: now,
//                       quantitative: now,
//                       risk: now,
//                       all: now
//                     }));
//                   })
//                   .catch(error => {
//                     setErrorState(error.message || "Failed to fetch analysis");
//                   });
//               } else {
//                 console.log("Ignoring 'Run All' request - too soon after previous click");
//               }
//             }}
//             disabled={loading}
//           >
//             {/* Run All */}
//           </button>
//         </div>
//       </div>
//       {renderAnalysisContent()}
//     </div>
//   );
// };

// export default AdvancedAnalysis;

import React, { useState, useEffect } from 'react';

const AdvancedAnalysis = ({ ticker, onAnalysisRequest, analysisData, loading }) => {
  const [activeTab, setActiveTab] = useState('sentiment');
  const [errorState, setErrorState] = useState(null);
  const [lastAnalysisTime, setLastAnalysisTime] = useState({});
  const [allTabsInitialized, setAllTabsInitialized] = useState(false);
  
  // Reset error state when ticker changes
  useEffect(() => {
    setErrorState(null);
    // Reset last analysis time when ticker changes
    setLastAnalysisTime({});
    setAllTabsInitialized(false);
  }, [ticker]);
  
  // Reset error state when analysis data changes
  useEffect(() => {
    if (analysisData) {
      setErrorState(null);
      
      // Check if all tabs have data
      const hasAllData = 
        analysisData.sentiment_analysis && 
        analysisData.technical_analysis && 
        analysisData.quantitative_analysis && 
        analysisData.risk_assessment;
      
      if (hasAllData) {
        setAllTabsInitialized(true);
        
        // Set last analysis time for all tabs
        const now = Date.now();
        setLastAnalysisTime({
          sentiment: now,
          technical: now,
          quantitative: now,
          risk: now,
          all: now
        });
      }
    }
  }, [analysisData]);

  if (!ticker) {
    return (
      <div className="empty-analysis">
        Enter a ticker symbol to view advanced analysis
      </div>
    );
  }

  const renderAnalysisContent = () => {
    if (loading) {
      return (
        <div className="loading-analysis">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
          <p>Analyzing {ticker}...</p>
          <p className="loading-subtext">This may take up to 2 minutes. We're gathering data from financial sources.</p>
        </div>
      );
    }

    if (errorState) {
      return (
        <div className="error-analysis">
          <p>An error occurred: {errorState}</p>
          <button 
            className="retry-button"
            onClick={() => {
              // Don't retry if already loading
              if (loading) return;
              
              setErrorState(null);
              
              // Add debounce for retry button too
              const currentTime = Date.now();
              const lastClickTime = lastAnalysisTime[`${activeTab}_retry_click`] || 0;
              const debounceTime = 1000; // 1 second debounce
              
              if (currentTime - lastClickTime > debounceTime) {
                // Update click time first
                setLastAnalysisTime(prev => ({
                  ...prev,
                  [`${activeTab}_retry_click`]: currentTime
                }));
                
                onAnalysisRequest(activeTab)
                  .then(() => {
                    // Update last analysis time
                    setLastAnalysisTime(prev => ({
                      ...prev,
                      [activeTab]: Date.now()
                    }));
                  });
              }
            }}
          >
            Retry {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Analysis
          </button>
        </div>
      );
    }

    if (!analysisData) {
      return (
        <div className="no-analysis-data">
          {allTabsInitialized ? (
            <p>Data is loading...</p>
          ) : (
            <p>Comprehensive analysis for {ticker} is being prepared automatically</p>
          )}
        </div>
      );
    }
    
    // Check if the result contains error messages
    let currentData;
    let isError = false;
    
    // Get the appropriate data based on the active tab
    if (analysisData[`${activeTab}_analysis`]) {
      // First check for tab_analysis format (most common)
      currentData = analysisData[`${activeTab}_analysis`];
    } else if (analysisData.result && activeTab === Object.keys(lastAnalysisTime).find(key => 
      lastAnalysisTime[key] === Math.max(...Object.values(lastAnalysisTime)))) {
      // Check if result might be from the most recently requested tab
      currentData = analysisData.result;
    } else if (analysisData[activeTab]) {
      // Legacy format
      currentData = analysisData[activeTab];
    }
    
    // Check if the data contains an error message
    if (currentData && typeof currentData === 'string') {
      isError = currentData.toLowerCase().includes("error") || 
                currentData.toLowerCase().includes("could not be completed") ||
                currentData.toLowerCase().includes("timed out");
    }

    if (!currentData) {
      return (
        <div className="no-analysis-data">
          <p>No {activeTab} analysis data available for {ticker}</p>
          <button 
            className="retry-button"
            onClick={() => {
              onAnalysisRequest(activeTab);
              // Update last analysis time
              setLastAnalysisTime(prev => ({
                ...prev,
                [activeTab]: Date.now()
              }));
            }}
          >
            Generate {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Analysis
          </button>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="error-analysis">
          <p>{currentData}</p>
          <button 
            className="retry-button"
            onClick={() => {
              onAnalysisRequest(activeTab);
              // Update last analysis time
              setLastAnalysisTime(prev => ({
                ...prev,
                [activeTab]: Date.now()
              }));
            }}
          >
            Retry {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Analysis
          </button>
        </div>
      );
    }

    // Enhanced formatting for the analysis content with metrics extraction
    const formatAnalysisContent = (content) => {
      if (!content) return '';
      
      // First pass: Extract sections for potential metrics
      const sections = {};
      let currentSection = 'main';
      sections[currentSection] = [];
      
      const lines = content.split('\n');
      
      lines.forEach(line => {
        if (line.startsWith('# ')) {
          currentSection = 'title';
          sections[currentSection] = line.substring(2);
        } else if (line.startsWith('## ')) {
          currentSection = line.substring(3).toLowerCase().replace(/\s+/g, '_');
          sections[currentSection] = [];
        } else if (currentSection !== 'title') {
          sections[currentSection].push(line);
        }
      });
      
      // Extract metrics if this is a quantitative or technical or risk analysis
      let metricsHtml = '';
      if (activeTab === 'technical' || activeTab === 'quantitative' || activeTab === 'risk') {
        const metrics = [];
        
        // Look for metrics in various sections
        Object.keys(sections).forEach(section => {
          if (Array.isArray(sections[section])) {
            sections[section].forEach(line => {
              // Match bullet points with metric values like "- **Beta:** 1.2"
              const metricMatch = line.match(/[-*]\s+\*\*(.*?):\*\*\s+(.*)/);
              if (metricMatch) {
                const [_, name, value] = metricMatch;
                
                // Determine if it's a positive, negative, or neutral metric
                let valueClass = 'neutral';
                if (value.includes('+') || 
                    value.toLowerCase().includes('positive') || 
                    value.toLowerCase().includes('strong buy') ||
                    value.toLowerCase().includes('low risk')) {
                  valueClass = 'positive';
                } else if (value.includes('-') || 
                           value.toLowerCase().includes('negative') || 
                           value.toLowerCase().includes('sell') ||
                           value.toLowerCase().includes('high risk')) {
                  valueClass = 'negative';
                }
                
                metrics.push({ name, value, class: valueClass });
              }
            });
          }
        });
        
        if (metrics.length > 0) {
          metricsHtml = `<div class="metrics-container">
            ${metrics.map(metric => `
              <div class="metric-card">
                <div class="metric-title">${metric.name}</div>
                <div class="metric-value ${metric.class}">${metric.value}</div>
              </div>
            `).join('')}
          </div>`;
        }
      }
      
      // Create sentiment indicator for sentiment analysis
      let sentimentHtml = '';
      if (activeTab === 'sentiment') {
        const sentimentMatch = content.match(/Sentiment Score:\s*([-+]?\d+)/i);
        const sentimentTextMatch = content.match(/Overall.+Sentiment:\s*([A-Za-z\s]+)/i);
        
        if (sentimentMatch && sentimentTextMatch) {
          const score = parseInt(sentimentMatch[1]);
          const sentimentText = sentimentTextMatch[1].trim();
          
          let sentimentClass = 'neutral';
          if (score > 20) sentimentClass = 'positive';
          else if (score < -20) sentimentClass = 'negative';
          
          sentimentHtml = `<div class="sentiment-indicator">
            <div class="metric-card">
              <div class="metric-title">Sentiment Score</div>
              <div class="metric-value ${sentimentClass}">${score}</div>
            </div>
            <div class="metric-card">
              <div class="metric-title">Overall Sentiment</div>
              <div class="metric-value ${sentimentClass}">${sentimentText}</div>
            </div>
          </div>`;
        }
      }
      
      // Second pass: Convert Markdown to HTML with enhanced styling
      // Convert Markdown-style headers
      let formattedContent = content
        .replace(/^#\s+(.*$)/gm, '<h2>$1</h2>')
        .replace(/^##\s+(.*$)/gm, '<h3>$1</h3>')
        .replace(/^###\s+(.*$)/gm, '<h4>$1</h4>');
      
      // Convert Markdown-style lists
      formattedContent = formattedContent
        .replace(/^[-*]\s+(.*$)/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>\n)+/g, '<ul>$&</ul>');
      
      // Convert line breaks to paragraphs, but preserve lists
      formattedContent = formattedContent
        .replace(/(?:\r\n|\r|\n){2,}/g, '</p><p>')
        .replace(/(?:\r\n|\r|\n)/g, '<br>');
      
      // Wrap in paragraph tags if not already
      const wrapped = formattedContent.startsWith('<p>') 
        ? formattedContent 
        : `<p>${formattedContent}</p>`;
      
      // Insert metrics or sentiment HTML in appropriate places
      let finalContent = wrapped;
      
      // Add metrics below the first h3 (which is usually the key metrics section)
      if (metricsHtml) {
        const firstH3Index = finalContent.indexOf('</h3>');
        if (firstH3Index !== -1) {
          finalContent = finalContent.substring(0, firstH3Index + 5) + 
                       metricsHtml + 
                       finalContent.substring(firstH3Index + 5);
        } else {
          // If no h3 found, add metrics after the first h2
          const firstH2Index = finalContent.indexOf('</h2>');
          if (firstH2Index !== -1) {
            finalContent = finalContent.substring(0, firstH2Index + 5) + 
                         metricsHtml + 
                         finalContent.substring(firstH2Index + 5);
          }
        }
      }
      
      // Add sentiment indicator below the first h2 for sentiment analysis
      if (sentimentHtml) {
        const firstH2Index = finalContent.indexOf('</h2>');
        if (firstH2Index !== -1) {
          finalContent = finalContent.substring(0, firstH2Index + 5) + 
                       sentimentHtml + 
                       finalContent.substring(firstH2Index + 5);
        }
      }
      
      return finalContent;
    };

    return (
      <div className="analysis-content">
        {analysisData.basic_summary && activeTab === 'sentiment' && (
          <div className="basic-summary" dangerouslySetInnerHTML={{ __html: formatAnalysisContent(analysisData.basic_summary) }} />
        )}
        <div className="analysis-text" dangerouslySetInnerHTML={{ __html: formatAnalysisContent(currentData) }} />
      </div>
    );
  };

  // FIXED - Improved tab click handler with proper data caching and in-progress check
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    
    // Don't make a request if we're already loading
    if (loading) {
      console.log(`Ignoring ${tab} analysis request - another analysis is already in progress`);
      return;
    }
    
    // Improved data existence check
    const hasData = 
      analysisData && 
      (analysisData[`${tab}_analysis`] || analysisData[tab]);
    
    // Add cache expiry - don't request new data if it was fetched in the last 10 minutes
    const cacheTime = 10 * 60 * 1000; // 10 minutes in milliseconds
    const isDataFresh = lastAnalysisTime[tab] && 
                       (Date.now() - lastAnalysisTime[tab] < cacheTime);
    
    if (!hasData && !isDataFresh) {
      // Add a debounce flag in the component state to prevent multiple rapid clicks
      const currentTime = Date.now();
      const lastClickTime = lastAnalysisTime[`${tab}_click`] || 0;
      const debounceTime = 1000; // 1 second debounce
      
      if (currentTime - lastClickTime > debounceTime) {
        // Update click time first to prevent race conditions
        setLastAnalysisTime(prev => ({
          ...prev,
          [`${tab}_click`]: currentTime
        }));
        
        onAnalysisRequest(tab)
          .then(() => {
            // Update the time this analysis was last run
            setLastAnalysisTime(prev => ({
              ...prev,
              [tab]: Date.now()
            }));
          })
          .catch(error => {
            setErrorState(error.message || "Failed to fetch analysis");
          });
      } else {
        console.log(`Ignoring ${tab} analysis request - too soon after previous click`);
      }
    }
  };

  return (
    <div className="advanced-analysis">
      <div className="analysis-header">
        <h2>Advanced Analysis for {ticker}</h2>
        <div className="tab-container">
          <button
            className={`tab-button ${activeTab === 'sentiment' ? 'active' : ''}`}
            onClick={() => handleTabClick('sentiment')}
          >
            Sentiment
          </button>
          <button
            className={`tab-button ${activeTab === 'technical' ? 'active' : ''}`}
            onClick={() => handleTabClick('technical')}
          >
            Technical
          </button>
          <button
            className={`tab-button ${activeTab === 'quantitative' ? 'active' : ''}`}
            onClick={() => handleTabClick('quantitative')}
          >
            Quantitative
          </button>
          <button
            className={`tab-button ${activeTab === 'risk' ? 'active' : ''}`}
            onClick={() => handleTabClick('risk')}
          >
            Risk
          </button>
          {!allTabsInitialized && (
            <div className="all-tabs-loading-indicator">
              <span className="loading-dot"></span>
              <span className="loading-dot"></span>
              <span className="loading-dot"></span>
            </div>
          )}
        </div>
      </div>
      {renderAnalysisContent()}
    </div>
  );
};

export default AdvancedAnalysis;