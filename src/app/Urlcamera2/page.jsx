'use client'

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function UrlCamera2() {
    const [url, setUrl] = useState('');
    const [streamUrl, setStreamUrl] = useState('');
    const canvasRef = useRef(null);
    const [points, setPoints] = useState([]);
    const [shapes, setShapes] = useState([]);

    const maxPoints = 4; // จำนวนจุดสูงสุดที่ต้องการ

    const handleChange = (event) => {
        setUrl(event.target.value);
    };

    const handleStreamLoad = async (event) => {
        event.preventDefault();
        if (url.startsWith('rtsp://')) {
            setStreamUrl(`http://localhost:5000/video_feed?url=${encodeURIComponent(url)}`);
            
            // Save camera data here
            try {
                const parkingLotResponse = await axios.get('http://localhost:2546/api/user/getParkingLotID');
                const parkingLotID = parkingLotResponse.data.ParkingLot_ID;
                
                const cameraFunctions = 'Detect space';
                await axios.post('http://localhost:2546/api/user/save-camera', {
                    url,
                    parkingLotID,
                    cameraFunctions
                }); 
                
            } catch (error) {
                console.error('Error saving camera data:', error);
                alert('Failed to save camera data.');
            }
        } else {
            alert('Please enter a valid RTSP URL.');
        }
    };

    const handleMouseDown = (event) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = Math.round(event.clientX - rect.left);
        const mouseY = Math.round(event.clientY - rect.top);

        const newPoints = [...points, { x: mouseX, y: mouseY }];
        setPoints(newPoints);

        if (newPoints.length === maxPoints) {
            // วาดกรอบเมื่อครบ 4 จุด
            const newShape = [...newPoints, newPoints[0]]; // วาดรูปร่างปิด
            setShapes((prevShapes) => [...prevShapes, newShape]);
            setPoints([]); // รีเซ็ตจุดสำหรับการวาดต่อไป
        }
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

            // วาดเส้นที่มีอยู่
            for (const shape of shapes) {
                ctx.moveTo(shape[0].x, shape[0].y);
                for (let i = 1; i < shape.length; i++) {
                    ctx.lineTo(shape[i].x, shape[i].y);
                }
                ctx.closePath();
            }
            ctx.stroke();

            // วาดเส้นที่กำลังวาด
            ctx.beginPath();
            if (points.length > 0) {
                ctx.moveTo(points[0].x, points[0].y);
                for (let i = 1; i < points.length; i++) {
                    ctx.lineTo(points[i].x, points[i].y);
                }
            }
            ctx.stroke();
            ctx.closePath();
        }
    }, [points, shapes]);

    const handleSave = async () => {
        try {
            const parkingLotResponse = await axios.get('http://localhost:2546/api/user/getParkingLotID');
            const parkingLotID = parkingLotResponse.data.ParkingLot_ID;
    
            if (shapes.length > 0) {
                // ช่องแรก (shape แรก) เก็บทั้งหมดใน Enter
                const enterData = shapes[0]; // เก็บข้อมูลทั้งหมดของ shape แรก (ช่องที่ 1)
    
                // ช่องที่ 2 และต่อไปเก็บใน points_data
                const pointsData = shapes.slice(1).map(shape => shape.map(point => [point.x, point.y]));
    
                // ส่งข้อมูลทั้งหมดในคำขอเดียว
                await axios.post('http://localhost:2546/api/user/save-enter-and-parkingspace', {
                    enterData,  // ช่องที่ 1
                    pointsData, // ช่องที่ 2 และต่อไป
                    parkingLotID
                });
    
                alert('Lines and points saved successfully!');
            }
    
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Failed to save data.');
        }
    };          

    return (
        <div className="App">
            <h1 className='mb-4 mt-3'>Camera for detect space</h1>
            <p>rtsp://admin:Admin123456@192.168.1.107:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif</p>
            <form onSubmit={handleStreamLoad} className="form-inline">
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
                    width="1920px" // กำหนดความกว้างเป็น 640px
                    height="1080px" // กำหนดความสูงเป็น 480px
                    onMouseDown={handleMouseDown}
                ></canvas>
    
                {streamUrl && (
                    <img
                        src={streamUrl}
                        title="RTSP Stream"
                        className="iframe-stream"
                        width="1920px" // กำหนดความกว้างเป็น 640px
                        height="1080px" // กำหนดความสูงเป็น 480px
                    ></img>
                )}
            </div>
    
            <button onClick={handleSave} className="btn btn-success mt-4">
                <a className='text-decoration-none text-white' href="AdminPage">Save Lines</a>
            </button>
    
            {/* การแสดงผลจุดในรูปแบบที่ต้องการ */}
            <div className='mt-4 d-flex'>
                {shapes.map((shape, shapeIndex) => (
                    <div className='mr-5' key={shapeIndex}>
                        <h3>ช่องที่ {shapeIndex + 1}</h3>
                        {shape.map((point, pointIndex) => (
                            <p key={pointIndex}>
                                จุดที่ {pointIndex + 1} : {"{"} "x": {point.x}, "y": {point.y} {"}"}
                            </p>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UrlCamera2;
