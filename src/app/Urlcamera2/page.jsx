'use client'

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function UrlCamera() {
    const [url, setUrl] = useState('');
    const [streamUrl, setStreamUrl] = useState('');
    const canvasRef = useRef(null);
    const [dataJson, setDataJson] = useState([]);
    const [drawing, setDrawing] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });

    const handleChange = (event) => {
        setUrl(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (url.startsWith('rtsp://')) {
            setStreamUrl(`http://localhost:5000/video_feed?url=${encodeURIComponent(url)}`);
        } else {
            alert('Please enter a valid RTSP URL.');
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
        const ctx = canvas.getContext('2d');
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
            // ดึงข้อมูล ParkingLot_ID ล่าสุด
            const parkingLotResponse = await axios.get('http://localhost:2546/api/user/getParkingLotID');
            const parkingLotID = parkingLotResponse.data.ParkingLot_ID;
    
            // บันทึกข้อมูล RTSP URL และเส้นที่วาดพร้อม ParkingLot_ID
            await axios.post('http://localhost:2546/api/user/save-data', {
                url,
                lines: dataJson.map(line => ({
                    x1: line.dataX1[0],
                    y1: line.dataY1[0],
                    x2: line.dataX2[0],
                    y2: line.dataY2[0]
                })),
                parkingLotID // ส่งค่า ParkingLot_ID ไปพร้อมกับข้อมูลที่บันทึก
            });
    
            alert('Lines and RTSP URL saved successfully!');
    
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Failed to save data.');
        }
    };

    return (
        <div className="App">
            <h1 className='mb-4 mt-3'>Camera for detect license plates</h1>
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

            <button onClick={handleSave} className="btn btn-success mt-4">
                <a href="AdminPage">Save Lines</a>
            </button>

            <p className='mt-4'>{JSON.stringify(dataJson)}</p>
        </div>
    );
}

export default UrlCamera;
