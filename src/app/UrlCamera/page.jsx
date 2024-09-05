'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useRef, useEffect } from 'react';

function UrlCamera() {
  const [url, setUrl] = useState('rtsp://admin:Admin123456@192.168.1.105:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif');
  const [streamUrl, setStreamUrl] = useState('');
  const canvasRef = useRef(null);
  const [dataJson, setDataJson] = useState({
    dataX1: [],
    dataY1: [],
    dataX2: [],
    dataY2: []
  });
  const [drawing, setDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleChange = (event) => {
    setUrl(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setStreamUrl(`http://localhost:5000/video_feed?url=${encodeURIComponent(url)}`);
  };

  const handleMouseDown = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    setStartPos({ x: mouseX, y: mouseY });
    setDrawing(true);
  };

  const handleMouseMove = (event) => {
    if (!drawing) return;
  
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
  
    // Draw the previous lines
    ctx.beginPath();
    ctx.strokeStyle = 'black'; // Line color
    ctx.lineWidth = 2; // Line width
    for (let i = 0; i < dataJson.dataX1.length; i++) {
      ctx.moveTo(dataJson.dataX1[i], dataJson.dataY1[i]);
      ctx.lineTo(dataJson.dataX2[i], dataJson.dataY2[i]);
    }
    ctx.stroke();
    ctx.closePath();
  
    // Draw the current line
    ctx.beginPath();
    ctx.moveTo(startPos.x, startPos.y);
    ctx.lineTo(mouseX, mouseY);
    ctx.stroke();
    ctx.closePath();
  };
  
  const handleMouseUp = (event) => {
    if (!drawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    setDrawing(false);
    setDataJson((prevState) => ({
      ...prevState,
      dataX1: [...prevState.dataX1, startPos.x],
      dataY1: [...prevState.dataY1, startPos.y],
      dataX2: [...prevState.dataX2, mouseX],
      dataY2: [...prevState.dataY2, mouseY]
    }));
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    const handleWheel = (event) => {
      if (!drawing) {
        return;
      }
      event.preventDefault();
    };

    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('wheel', handleWheel);
      }
    };
  }, [drawing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    }
  }, [streamUrl]);

  return (
    <div className="App">
      <h1>RTSP Stream Viewer</h1>
      <form onSubmit={handleSubmit} className="form-inline">
        <input
          type="text"
          placeholder="Enter RTSP URL"
          value={url}
          onChange={handleChange}
          className="form-control mr-2"
          required
        />
        <button type="submit" className="btn btn-primary">
          Load Stream
        </button>
      </form>
      
      <div className="video-container">
        <canvas
          ref={canvasRef}
          id="lineCanvas"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        ></canvas>
        
        {streamUrl && (
          <img
            src={streamUrl}
            title="RTSP Stream"
            className="iframe-stream"
          ></img>
        )}
      </div>

      <p>{JSON.stringify(dataJson)}</p>
    </div>
  );
}

export default UrlCamera;
