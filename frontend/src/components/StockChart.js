import React, { useState } from 'react';

// Fallback chart using SVG in case Plotly fails to load
const FallbackChart = ({ data }) => {
  // Chart dimensions
  const width = 800;
  const height = 300;
  const padding = { top: 20, right: 30, bottom: 30, left: 50 };
  
  // Calculate chart area dimensions
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  // Get min/max values for scaling
  const minPrice = Math.min(...data.map(d => d.low));
  const maxPrice = Math.max(...data.map(d => d.high));
  
  // Scale functions
  const xScale = (index) => padding.left + (index * chartWidth / (data.length - 1));
  const yScale = (price) => padding.top + chartHeight - ((price - minPrice) * chartHeight / (maxPrice - minPrice));
  
  // Generate path for price line
  const linePath = `M ${data.map((d, i) => `${xScale(i)},${yScale(d.close)}`).join(' L ')}`;
  
  // Format date for tooltip
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };
  
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      {/* Y-axis */}
      <line 
        x1={padding.left} 
        y1={padding.top} 
        x2={padding.left} 
        y2={height - padding.bottom} 
        stroke="#ccc" 
      />
      
      {/* X-axis */}
      <line 
        x1={padding.left} 
        y1={height - padding.bottom} 
        x2={width - padding.right} 
        y2={height - padding.bottom} 
        stroke="#ccc" 
      />
      
      {/* Price line */}
      <path 
        d={linePath} 
        fill="none" 
        stroke="#4299e1" 
        strokeWidth="2" 
        strokeLinejoin="round" 
      />
      
      {/* Price points */}
      {data.map((d, i) => (
        <circle 
          key={i} 
          cx={xScale(i)} 
          cy={yScale(d.close)} 
          r="3" 
          fill="#4299e1" 
        >
          <title>{formatDate(d.date)}: ${d.close.toFixed(2)}</title>
        </circle>
      ))}
      
      {/* Y-axis labels */}
      <text x={padding.left - 10} y={padding.top} textAnchor="end" fontSize="12" fill="#718096">
        ${maxPrice.toFixed(2)}
      </text>
      <text x={padding.left - 10} y={height - padding.bottom} textAnchor="end" fontSize="12" fill="#718096">
        ${minPrice.toFixed(2)}
      </text>
      
      {/* X-axis labels (first, middle, last) */}
      <text x={padding.left} y={height - padding.bottom + 20} fontSize="12" fill="#718096" textAnchor="middle">
        {formatDate(data[0].date)}
      </text>
      <text x={padding.left + chartWidth/2} y={height - padding.bottom + 20} fontSize="12" fill="#718096" textAnchor="middle">
        {formatDate(data[Math.floor(data.length/2)].date)}
      </text>
      <text x={width - padding.right} y={height - padding.bottom + 20} fontSize="12" fill="#718096" textAnchor="middle">
        {formatDate(data[data.length-1].date)}
      </text>
    </svg>
  );
};

const StockChart = ({ data, loading }) => {
  const [useFallback, setUseFallback] = useState(false);
  const [chartError, setChartError] = useState(null);
  
  // Use useEffect to dynamically import Plotly
  React.useEffect(() => {
    // Only try to load Plotly if we have data and aren't already using fallback
    if (data && data.length > 0 && !useFallback && !loading) {
      import('react-plotly.js')
        .then(() => import('plotly.js-basic-dist-min'))
        .catch(error => {
          console.error('Failed to load Plotly:', error);
          setChartError('Failed to load chart library. Using simple chart instead.');
          setUseFallback(true);
        });
    }
  }, [data, useFallback, loading]);

  if (loading) {
    return <div className="loading-chart">Loading chart data...</div>;
  }
  
  if (!data || data.length === 0) {
    return <div className="empty-chart">Enter a ticker symbol to view price history</div>;
  }
  
  // Prepare the chart data
  const chartData = [...data].reverse(); // Reverse to show oldest first
  
  // If Plotly failed to load, use the fallback chart
  if (useFallback) {
    return (
      <div className="stock-chart">
        {chartError && <div className="chart-error">{chartError}</div>}
        <FallbackChart data={chartData} />
      </div>
    );
  }
  
  // Attempt to use the Plotly component if available
  try {
    // Dynamically import the Plotly components to avoid issues if it's not available
    const Plot = require('react-plotly.js').default;
    
    // Calculate price bounds for the y-axis (with padding)
    const minPrice = Math.min(...chartData.map(d => d.low)) * 0.99;
    const maxPrice = Math.max(...chartData.map(d => d.high)) * 1.01;
    
    // Calculate volume colors
    const volumeColors = chartData.map(d => 
      d.close > d.open ? 'rgba(0, 150, 136, 0.4)' : 'rgba(239, 83, 80, 0.4)'
    );
    
    // Candlestick trace
    const candlestick = {
      x: chartData.map(d => d.date),
      open: chartData.map(d => d.open),
      high: chartData.map(d => d.high),
      low: chartData.map(d => d.low),
      close: chartData.map(d => d.close),
      increasing: { line: { color: 'rgb(0, 150, 136)' }, fillcolor: 'rgba(0, 150, 136, 0.7)' },
      decreasing: { line: { color: 'rgb(239, 83, 80)' }, fillcolor: 'rgba(239, 83, 80, 0.7)' },
      type: 'candlestick',
      name: 'Price',
      yaxis: 'y',
    };
    
    // Volume trace
    const volumeTrace = {
      x: chartData.map(d => d.date),
      y: chartData.map(d => d.volume),
      marker: {
        color: volumeColors,
      },
      type: 'bar',
      name: 'Volume',
      yaxis: 'y2',
    };
    
    // Layout configuration
    const layout = {
      dragmode: 'zoom',
      showlegend: false,
      autosize: true,
      xaxis: {
        rangeslider: {
          visible: false
        },
        type: 'date',
        title: 'Date'
      },
      yaxis: {
        domain: [0.25, 1],
        autorange: true,
        title: 'Price',
        tickformat: '$.2f',
      },
      yaxis2: {
        domain: [0, 0.2],
        autorange: true,
        title: 'Volume',
        showgrid: false,
        showticklabels: false,
      },
      margin: {
        r: 10,
        t: 10,
        b: 40,
        l: 60
      },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      grid: {
        'rows': 2,
        'columns': 1,
        'pattern': 'independent',
        'roworder': 'top to bottom'
      },
      hovermode: 'closest',
    };
    
    // Config for chart interactions
    const config = {
      responsive: true,
      displayModeBar: true,
      displaylogo: false,
      modeBarButtonsToRemove: [
        'select2d', 
        'lasso2d', 
        'autoScale2d', 
        'hoverCompareCartesian',
        'hoverClosestCartesian',
        'toggleSpikelines',
      ],
      modeBarButtonsToAdd: [
        'drawline',
        'drawopenpath',
        'eraseshape'
      ],
      toImageButtonOptions: {
        format: 'png',
        filename: `stock-chart-${chartData[0]?.date}`,
        height: 500,
        width: 700,
        scale: 2
      }
    };
    
    return (
      <div className="stock-chart">
        <Plot
          data={[candlestick, volumeTrace]}
          layout={layout}
          config={config}
          style={{ width: '100%', height: 400 }}
          useResizeHandler={true}
        />
      </div>
    );
  } catch (error) {
    // If there's any error rendering the Plotly chart, use the fallback
    console.error('Error rendering Plotly chart:', error);
    setUseFallback(true);
    return (
      <div className="stock-chart">
        <div className="chart-error">Error loading chart. Using simple chart instead.</div>
        <FallbackChart data={chartData} />
      </div>
    );
  }
};

export default StockChart;