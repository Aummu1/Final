'use client';

import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function AddSpace() {
    const [parkingLots, setParkingLots] = useState([]);
    const [cameraLinks, setCameraLinks] = useState([]);
    const [selectedParkingLot, setSelectedParkingLot] = useState(null);
    const [pointsData, setPointsData] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const canvasRef = useRef(null);
    const [newPoints, setNewPoints] = useState([]);
    const [shapes, setShapes] = useState([]);
    const maxPoints = 4;

    useEffect(() => {
        const fetchParkingLots = async () => {
            try {
                const response = await axios.get('https://apib17.bd2-cloud.net/api/user/option');
                setParkingLots(response.data.map(lot => ({
                    ParkingLot_ID: lot.ParkingLot_ID,
                    ParkingLot_Name: lot.ParkingLot_Name
                })));
            } catch (error) {
                console.error('Error fetching parking lots:', error);
            }
        };
        fetchParkingLots();
    }, []);

    useEffect(() => {
        const user = localStorage.getItem('username');
        if (user) {
            setIsLoggedIn(true);
        }
    }, []);

    useEffect(() => {
        const fetchPointsData = async () => {
            if (selectedParkingLot) {
                try {
                    const response = await axios.get(`https://apib17.bd2-cloud.net/api/user/points_data/${selectedParkingLot}`);
                    const parsedPointsData = response.data.points_data.map(pointString => JSON.parse(pointString));
                    setPointsData(parsedPointsData);
                } catch (error) {
                    console.error('Error fetching points data:', error);
                }
            }
        };
        fetchPointsData();
    }, [selectedParkingLot]);

    useEffect(() => {
        if (selectedParkingLot) {
            const fetchCameraLinks = async () => {
                try {
                    const response = await axios.get(`https://apib17.bd2-cloud.net/api/user/camera-links/${selectedParkingLot}`);
                    setCameraLinks(response.data);
                } catch (error) {
                    console.error('Error fetching camera links:', error);
                }
            };
            fetchCameraLinks();
        }
    }, [selectedParkingLot]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (Array.isArray(pointsData) && pointsData.length > 0) {
                pointsData.forEach(points => {
                    if (Array.isArray(points) && points.length > 0) {
                        ctx.beginPath();
                        ctx.moveTo(points[0][0], points[0][1]);
                        points.forEach(point => {
                            ctx.lineTo(point[0], point[1]);
                        });
                        ctx.strokeStyle = "black";
                        ctx.lineWidth = 2;
                        ctx.stroke();
                    }
                });
            }

            shapes.forEach(shape => {
                ctx.beginPath();
                ctx.moveTo(shape[0].x, shape[0].y);
                shape.forEach(point => {
                    ctx.lineTo(point.x, point.y);
                });
                ctx.strokeStyle = "black";
                ctx.lineWidth = 2;
                ctx.stroke();
            });

            if (newPoints.length > 0) {
                ctx.beginPath();
                ctx.moveTo(newPoints[0].x, newPoints[0].y);
                newPoints.forEach(point => {
                    ctx.lineTo(point.x, point.y);
                });
                ctx.strokeStyle = "red";
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }
    }, [pointsData, newPoints, shapes]);

    const handleParkingLotChange = (event) => {
        const selectedID = event.target.value;
        setSelectedParkingLot(selectedID);
    };

    const handleMouseDown = (event) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = Math.round(event.clientX - rect.left);
        const mouseY = Math.round(event.clientY - rect.top);

        const updatedPoints = [...newPoints, { x: mouseX, y: mouseY }];
        setNewPoints(updatedPoints);

        if (updatedPoints.length === maxPoints) {
            const closedShape = [...updatedPoints, updatedPoints[0]];
            setShapes([...shapes, closedShape]);
            setNewPoints([]);
        }
    };

    const saveAllPoints = async () => {
        try {
            const parkingLotID = selectedParkingLot;
            
            // ตรวจสอบว่ามีข้อมูลที่จะบันทึกหรือไม่
            if (shapes.length > 0) {
                let savedShapesCount = 0; // ตัวแปรเก็บจำนวนช่องที่บันทึก
    
                for (const shape of shapes) {
                    // แปลงข้อมูลให้เป็นรูปแบบที่ต้องการ
                    const pointsDataToSave = shape.map(point => [point.x, point.y]); // เปลี่ยนเป็น [x, y] แทน
                    
                    console.log('Data to send:', {
                        parkingLotID,
                        pointsData: pointsDataToSave
                    });
    
                    const response = await axios.post('https://apib17.bd2-cloud.net/api/user/savepointsdata', {
                        parkingLotID,
                        pointsData: pointsDataToSave
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
    
                    if (response.status === 200) {
                        savedShapesCount++; // เพิ่มจำนวนช่องที่บันทึก
                    }
                }
    
                // แจ้งเตือนหลังบันทึกเสร็จ
                alert(`${savedShapesCount} ช่องถูกบันทึกสำเร็จ!`);
    
                // เคลียร์ข้อมูลหลังบันทึกเสร็จ
                setNewPoints([]);
                setShapes([]);

                setTimeout(() => {
                    window.location.href = 'https://appb17.bd2-cloud.net/Infor_ParkingLot';
                }, 1500); // ดีเลย์ 1.5 วินาที (คุณสามารถปรับเวลาได้)

            } else {
                alert('No points to save!');
            }
        } catch (error) {
            console.error('Error saving new points:', error);
            alert('Failed to save points.');
        }
    };
    
    
    return (
        <div className="pr-10 pl-10 z-2">
            <div className="col-12 d-flex mt-10 mb-10 align-items-center justify-content-around">
                <div className='d-fiex justify-content-center'>
                    <h2 className='pl-5 mb-3'>AddSpace</h2>
                    <select onChange={handleParkingLotChange} className="form-select" aria-label="Default select example" defaultValue="">
                        <option value="">Choose ParkingLot</option>
                        {parkingLots.map((lot, index) => (
                            <option key={index} value={lot.ParkingLot_ID}>{lot.ParkingLot_Name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="video-container">
                <canvas ref={canvasRef} id="lineCanvas" width={1920} height={1080} onMouseDown={handleMouseDown} style={{ width: "1920px", height: "1080px" }}></canvas>
                {cameraLinks.length > 0 && cameraLinks[1]?.rtsp && (
                    <img
                        src={`https://camera.bd2-cloud.net/video_feed?url=${encodeURIComponent(cameraLinks[1].rtsp)}`}
                        autoPlay
                        controls
                        style={{ width: "1920px", height: "1080px" }}
                        title="RTSP Stream"
                        className="iframe-stream"
                    />
                )}
            </div>

            <div className='mt-4 d-flex'>
                {shapes.map((shape, shapeIndex) => (
                    <div className='mr-5' key={shapeIndex}>
                        <h3>ช่องที่ {shapeIndex + 1}</h3>
                        {shape.map((point, pointIndex) => (
                            <p key={pointIndex}>
                                จุดที่ {pointIndex + 1} : {"{"} &quot;x&quot;: {point.x}, &quot;y&quot;: {point.y} {"}"}
                            </p>
                        ))}
                    </div>
                ))}
            </div>
            <div className='d-flex justify-content-end'>
                <button onClick={saveAllPoints} className="btn btn-success pt">Save</button>
            </div>
        </div>
    );
}

export default AddSpace;
