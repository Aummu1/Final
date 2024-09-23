'use client'

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function UrlCamera() {
    const [username, setUsername] = useState(''); // State for username
    const [password, setPassword] = useState(''); // State for password
    const [ip, setIp] = useState(''); // State for IP address
    const [streamUrl, setStreamUrl] = useState('');
    const canvasRef = useRef(null);
    const [dataJson, setDataJson] = useState([]);
    const [drawing, setDrawing] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [saved, setSaved] = useState(false);

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleIpChange = (event) => {
        setIp(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (username && password && ip) {
            const rtspUrl = `rtsp://${username}:${password}@${ip}/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif`;
            setStreamUrl(`http://localhost:5000/video_feed?url=${encodeURIComponent(rtspUrl)}`);
        } else {
            alert('Please enter username, password, and IP address.');
        }
    };

    const handleMouseDown = (event) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = Math.round(event.clientX - rect.left);
        const mouseY = Math.round(event.clientY - rect.top);

        setStartPos({ x: mouseX, y: mouseY });
        setDrawing(true);
    };

    const handleMouseMove = (event) => {
        if (!drawing) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const mouseX = Math.round(event.clientX - rect.left);
        const mouseY = Math.round(event.clientY - rect.top);

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        for (const line of dataJson) {
            const { dataX1, dataY1, dataX2, dataY2 } = line;
            for (let i = 0; i < dataX1.length; i++) {
                ctx.moveTo(dataX1[i], dataY1[i]);
                ctx.lineTo(dataX2[i], dataY2[i]);
            }
        }
        ctx.stroke();
        ctx.closePath();

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
        const mouseX = Math.round(event.clientX - rect.left);
        const mouseY = Math.round(event.clientY - rect.top);

        setDrawing(false);

        setDataJson((prevState) => [
            ...prevState,
            {
                dataX1: [startPos.x],
                dataY1: [startPos.y],
                dataX2: [mouseX],
                dataY2: [mouseY]
            }
        ]);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (canvas) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;

            for (const line of dataJson) {
                const { dataX1, dataY1, dataX2, dataY2 } = line;
                for (let i = 0; i < dataX1.length; i++) {
                    ctx.moveTo(dataX1[i], dataY1[i]);
                    ctx.lineTo(dataX2[i], dataY2[i]);
                }
            }
            ctx.stroke();
            ctx.closePath();
        }
    }, [dataJson]);

    const handleSave = async () => {
        try {
            const parkingLotResponse = await axios.get('http://localhost:2546/api/user/getParkingLotID');
            const parkingLotID = parkingLotResponse.data.ParkingLot_ID;

            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            await axios.post('http://localhost:2546/api/user/save-data', {
                url: `rtsp://${username}:${password}@${ip}/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif`,
                lines: dataJson.map(line => ({
                    x1: line.dataX1[0],
                    y1: line.dataY1[0],
                    x2: line.dataX2[0],
                    y2: line.dataY2[0]
                })),
                parkingLotID,
                size: `${screenWidth}x${screenHeight}`
            });

            alert('Lines and RTSP URL saved successfully!');
            setSaved(true);
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Failed to save data.');
        }
    };

    return (
        <div className="App">
            <h1 className='mb-4 mt-3'>Camera for detect license plates</h1>
            <p>rtsp://admin:Admin123456@192.168.1.104:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif</p>
            <form onSubmit={handleSubmit} className="form-inline">
                <input
                    type="text"
                    placeholder="Enter Username"
                    value={username}
                    onChange={handleUsernameChange}
                    className="form-control mr-2"
                    required
                />
                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="form-control mr-2"
                    required
                />
                <input
                    type="text"
                    placeholder="Enter IP Address"
                    value={ip}
                    onChange={handleIpChange}
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
                        style={{ width: "1280px", height: "720px" }}
                    ></img>
                )}
            </div>

            <button onClick={handleSave} className="btn btn-success mt-4">
                Save Lines
            </button>

            <a href="Urlcamera2" className={`btn btn-info mt-4 ${!saved ? 'disabled' : ''}`}>
                <span className="text nav-text">Next</span>
            </a>

            <p className='mt-4'>{JSON.stringify(dataJson)}</p>
        </div>
    );
}

export default UrlCamera;
