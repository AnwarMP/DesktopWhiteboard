import { useRef, useEffect, useState } from 'react';
import TldrawWrapper from './tldrawwrapper';
import 'tldraw/tldraw.css';
import { analyzeCanvasData } from './utils';
import html2canvas from 'html2canvas'; // Ensure you have html2canvas installed

export default function App() {
  const tldrawRef = useRef(null);
  const [canvasData, setCanvasData] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    const handleKeyPress = async (event) => {
      if (event.key === 'k' || event.key === 'K') {
        await handleAnalyzeCanvas();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [canvasData]);

  useEffect(() => {
    if (tldrawRef.current) {
      const tldrawApp = tldrawRef.current.getCanvasElement();
      if (tldrawApp) {
        // Assuming `tldrawApp` provides the state object
        const currentFrame = tldrawApp.state?.document.page.states[tldrawApp.state?.appState.currentPageId];
        setCanvasData(currentFrame);
      }
    }
  }, [tldrawRef]);

  const handleAnalyzeCanvas = async () => {
    if (canvasData) {
      try {
        const canvasElement = tldrawRef.current.getCanvasElement(); // Assume getCanvasElement() gets the canvas DOM element
        const canvasImage = await html2canvas(canvasElement);
        const dataURL = canvasImage.toDataURL('image/png');
        const result = await analyzeCanvasData(dataURL);
        setAnalysisResult(result); // Update state with analysis result
        console.log('Analysis Result:', result);
      } catch (error) {
        console.error('Error sending canvas data to Google Gemini Flash 1.5:', error);
      }
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <TldrawWrapper ref={tldrawRef} />
      {analysisResult && <p>Analysis: {analysisResult}</p>}  {/* Display analysis result */}
    </div>
  );
}
