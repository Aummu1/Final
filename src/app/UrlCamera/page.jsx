'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';

function UrlCamera() {
  const [url, setUrl] = useState('');

  const handleChange = (event) => {
    setUrl(event.target.value);
  };

  const loadURL = () => {
    document.getElementById('displayFrame').src = url;
  };

  return (
    <div className="container">
      <h1>Load URL in iFrame</h1>
      <input
        type="text"
        id="urlInput"
        placeholder="Enter URL here"
        value={url}
        onChange={handleChange}
        className="form-control"
      />
      <button onClick={loadURL} className="btn btn-primary mt-2">
        Load
      </button>
      <iframe
        id="displayFrame"
        src=""
        frameBorder="0"
        style={{ width: '100%', height: '600px', marginTop: '20px' }}
      ></iframe>
    </div>
  );
}

export default UrlCamera;
