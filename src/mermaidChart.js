import React, { useEffect, useRef, useState } from "react"
import mermaid from "mermaid"

const DEFAULT_CONFIG = {
  startOnLoad: true,
  theme: "forest",
  logLevel: "fatal",
  securityLevel: "strict",
  arrowMarkerAbsolute: false,
  flowchart: {
    htmlLabels: true,
    curve: "linear",
  },
  sequence: {
    diagramMarginX: 50,
    diagramMarginY: 10,
    actorMargin: 50,
    width: 150,
    height: 65,
    boxMargin: 10,
    boxTextMargin: 5,
    noteMargin: 10,
    messageMargin: 35,
    mirrorActors: true,
    bottomMarginAdj: 1,
    useMaxWidth: true,
    rightAngles: false,
    showSequenceNumbers: false,
  },
  gantt: {
    titleTopMargin: 25,
    barHeight: 20,
    barGap: 4,
    topPadding: 50,
    leftPadding: 75,
    gridLineStartPadding: 35,
    fontSize: 11,
    fontFamily: '"Open-Sans", "sans-serif"',
    numberSectionStyles: 4,
    axisFormat: "%Y-%m-%d",
  },
}

// Method 1: Using mermaid.render() API (Recommended)
const MermaidChart = ({ name, chart, config = {} }) => {
  const ref = useRef(null);
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize mermaid with config
    mermaid.initialize({ 
      ...DEFAULT_CONFIG, 
      ...config,
      startOnLoad: false // Important: prevent auto-initialization
    });
  }, [config]);

  useEffect(() => {
    const renderChart = async () => {
      if (!chart || !ref.current) return;

      setIsLoading(true);
      setError(null);

      try {
        // Generate unique ID for each render
        const id = `mermaid-${name}-${Date.now()}`;
        
        // Clear previous content
        ref.current.innerHTML = '';
        
        // Use mermaid.render() API
        const { svg: renderedSvg } = await mermaid.render(id, chart);
        
        // Set the rendered SVG
        setSvg(renderedSvg);
        
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError(err.message || 'Failed to render diagram');
        setSvg('');
      } finally {
        setIsLoading(false);
      }
    };

    renderChart();
  }, [chart, name]);

  // Update DOM when SVG changes
  useEffect(() => {
    if (ref.current && svg) {
      ref.current.innerHTML = svg;
    }
  }, [svg]);

  if (!chart) return null;

  return (
    <div className="mermaid-container">
      {isLoading && (
        <div className="mermaid-loading">
          <div className="spinner">Loading diagram...</div>
        </div>
      )}
      
      {error && (
        <div className="mermaid-error">
          <p>Error rendering diagram: {error}</p>
          <details>
            <summary>Chart Definition</summary>
            <pre>{chart}</pre>
          </details>
        </div>
      )}
      
      <div 
        ref={ref} 
        className="mermaid-chart"
        style={{ 
          visibility: isLoading ? 'hidden' : 'visible',
          minHeight: error ? 'auto' : '200px'
        }}
      />
    </div>
  );
};


export default MermaidChart
