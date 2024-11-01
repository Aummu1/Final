'use client';

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function UrlCamera2() {
    const [adminUsername, setAdminUsername] = useState('');
    const [adminCredentials, setAdminCredentials] = useState('');
    const [ipAddress, setIpAddress] = useState('');
    const [streamUrl, setStreamUrl] = useState('');
    const canvasRef = useRef(null);
    const [points, setPoints] = useState([]); //เก็บจุดที่วาด
    const [shapes, setShapes] = useState([]); //เก็บรูปร่างที่วาด
    const maxPoints = 4;

    const handleAdminUsernameChange = (event) => {
        setAdminUsername(event.target.value);
    };

    const handleAdminChange = (event) => {
        setAdminCredentials(event.target.value);
    };

    const handleIpChange = (event) => {
        setIpAddress(event.target.value);
    };

    const handleStreamLoad = async (event) => {
        event.preventDefault(); //event.preventDefault() ใช้เพื่อหยุดการรีเฟรชของฟอร์ม

        if (adminUsername && adminCredentials && ipAddress) {
            const rtspUrl = `rtsp://${adminUsername}:${adminCredentials}@${ipAddress}/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif`;
            setStreamUrl(`https://camera.bd2-cloud.net/video_feed?url=${encodeURIComponent(rtspUrl)}`);

            try {
                const parkingLotResponse = await axios.get('https://apib17.bd2-cloud.net/api/user/getParkingLotID');
                const parkingLotID = parkingLotResponse.data.ParkingLot_ID;

                const cameraFunctions = 'Detect space';

                const checkUrlResponse = await axios.post('https://apib17.bd2-cloud.net/api/user/check-rtsp-url', {
                    url: rtspUrl //ส่ง rtspUrl ไปยัง API เพื่อตรวจสอบว่ามีอยู่ในฐานข้อมูลหรือไม่
                });

                //บันทึกข้อมูลกล้อง
                if (checkUrlResponse.status === 200) {
                    console.log('RTSP URL is unique, proceeding to save camera data.');

                    const saveCameraResponse = await axios.post('https://apib17.bd2-cloud.net/api/user/save-camera', {
                        url: rtspUrl,
                        parkingLotID,
                        cameraFunctions
                    });

                    if (saveCameraResponse.status === 200) {
                        alert('Camera data saved successfully!');
                    }
                }
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    alert('RTSP URL already exists in the database.');
                } else {
                    console.error('Error:', error);
                    alert('Failed to save data.');
                }
            }
        } else {
            alert('Please enter Admin username, Admin password, and IP address.');
        }
    };


    //ฟังก์ชันนี้จะทำงานเมื่อผู้ใช้คลิกที่ canvas
    //คำนวณตำแหน่งของเมาส์ใน canvas
    const handleMouseDown = (event) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = Math.round(event.clientX - rect.left);
        const mouseY = Math.round(event.clientY - rect.top);

        //บันทึกจุดที่คลิก
        const newPoints = [...points, { x: mouseX, y: mouseY }];
        setPoints(newPoints);

        // วาดรูปปิดเมื่อถึงจำนวนจุดสูงสุด
        if (newPoints.length === maxPoints) {
            const newShape = [...newPoints, newPoints[0]]; // วาดรูปร่างปิด
            setShapes((prevShapes) => [...prevShapes, newShape]);
            setPoints([]); // รีเซ็ตจุดสำหรับการวาดต่อไป
        }
    };


    //เมื่อ points หรือ shapes เปลี่ยนแปลงจะทำให้ canvas ถูกอัปเดต
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (canvas) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);  //กำหนดขนาด canvas และล้างพื้นที่วาด
            
            //วาดรูปร่างที่บันทึก
            ctx.beginPath();
            ctx.strokeStyle = 'black';  //เริ่มต้นการวาดด้วยการตั้งค่า strokeStyle และ lineWidth
            ctx.lineWidth = 2;

            for (const shape of shapes) {  //วาดรูปร่างที่เก็บไว้ใน shapes
                ctx.moveTo(shape[0].x, shape[0].y);
                for (let i = 1; i < shape.length; i++) {
                    ctx.lineTo(shape[i].x, shape[i].y);
                }
                ctx.closePath();
            }
            ctx.stroke();

            //วาดจุดปัจจุบัน
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
    }, [points, shapes]); //วาดเส้นจากจุดที่เก็บไว้ใน points หากมี


    const handleSave = async () => {
        try {
            const parkingLotResponse = await axios.get('https://apib17.bd2-cloud.net/api/user/getParkingLotID');
            const parkingLotID = parkingLotResponse.data.ParkingLot_ID;
            
            //บันทึกข้อมูลเข้าและจุดที่วาด
            if (shapes.length > 0) {
                // แยก enterData จาก shapes[0] และเอาที่เหลือเป็น pointsData
                const enterData = shapes[0].map(point => ({ x: point.x, y: point.y }));
                const pointsData = shapes.slice(1).map(shape => shape.map(point => [point.x, point.y]));
    
                await axios.post('https://apib17.bd2-cloud.net/api/user/save-enter-and-parkingspace', {
                    enterData, // ส่ง enterData
                    pointsData, // ส่ง pointsData
                    parkingLotID
                });
    
                alert('Enter and parking spaces saved successfully!');
                setTimeout(() => {
                    window.location.href = 'https://appb17.bd2-cloud.net/AdminPage';
                }, 1000);
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
                    placeholder="Enter Admin Username"
                    value={adminUsername}
                    onChange={handleAdminUsernameChange}
                    className="form-control mr-2"
                    required
                />
                <input
                    type="password"
                    placeholder="Enter Admin Password"
                    value={adminCredentials}
                    onChange={handleAdminChange}
                    className="form-control mr-2"
                    required
                />
                <input
                    type="text"
                    placeholder="Enter IP Address"
                    value={ipAddress}
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
                ></canvas>

                {streamUrl && (
                    <img
                        src={streamUrl}
                        title="RTSP Stream"
                        className="iframe-stream"
                        style={{ width: "1920px", height: "1080px" }}
                    />
                )}
            </div>

            <button onClick={handleSave} className="btn btn-success mt-4">
                Save Lines
            </button>

            {/* แสดงข้อมูลรูปร่าง */}
            <div className='mt-4 d-flex'>
                {shapes.map((shape, shapeIndex) => (
                    <div className='mr-5' key={shapeIndex}>
                        <h3>ช่องที่ {shapeIndex + 1}</h3>
                        {shape.map((point, pointIndex) => (
                            <p key={pointIndex}>
                                จุดที่ {pointIndex + 1} - X: {point.x}, Y: {point.y}
                            </p>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UrlCamera2;
