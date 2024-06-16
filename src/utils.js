export async function analyzeCanvasData(dataURL) {
    const response = await fetch('http://localhost:3001/upload', {
      method: 'POST',
      body: JSON.stringify({ dataURL }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    const result = await response.json();
    return result.response;
  }
    