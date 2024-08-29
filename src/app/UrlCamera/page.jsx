'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';

function UrlCamera() {
  const [url, setUrl] = useState('');
  const [streamUrl, setStreamUrl] = useState('');

  const handleChange = (event) => {
    setUrl(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setStreamUrl(`http://localhost:5000/video_feed?url=${encodeURIComponent(url)}`);
  };

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
      {streamUrl && (
        <iframe
          src={streamUrl}
          title="RTSP Stream"
          frameBorder="0"
          style={{ width: '100%', height: '1000px', marginTop: '20px' }}
        ></iframe>
      )}
    </div>
  );
}

export default UrlCamera;