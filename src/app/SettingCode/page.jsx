"use client";
import React, { useState } from 'react';
import Link from "next/link";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'boxicons/css/boxicons.min.css';
import axios from 'axios'; // ใช้ Axios สำหรับ HTTP requests

function SettingCode() {
    const [parkingLotName, setParkingLotName] = useState('');
    const [wifi, setWifi] = useState('');
    const [wifiPassword, setWifiPassword] = useState('');
    const [saved, setSaved] = useState(false); // สถานะที่ใช้ตรวจสอบว่าข้อมูลถูกบันทึกสำเร็จหรือไม่

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:2546/api/user/saveParkingLot', {
                parkingLotName,
                wifi,
                wifiPassword
            });
            if (response.status === 200) {
                alert('Data saved successfully!');
                setSaved(true); // อัปเดตสถานะเมื่อบันทึกข้อมูลสำเร็จ
            }
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Failed to save data.');
            setSaved(false); // หากเกิดข้อผิดพลาดสถานะจะไม่ถูกตั้งค่า
        }
    };

    return (
        <div className='ml-5'>
            <section className="contact" id="contact">
                <h2 className="heading">ParkingLot Information</h2>

                <form onSubmit={handleSubmit}>
                    <div className="input-box">
                        <p>Name ParkingLot</p>
                        <input
                            type="text"
                            placeholder="Name ParkingLot"
                            required
                            value={parkingLotName}
                            onChange={(e) => setParkingLotName(e.target.value)}
                        />
                    </div>
                </form>
            </section>

            <section className="contact" id="contact">
                <h2 className="heading">LED Information</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-box">
                        <p>Wifi</p>
                        <input
                            className="mb-5"
                            type="text"
                            placeholder="Wifi"
                            required
                            value={wifi}
                            onChange={(e) => setWifi(e.target.value)}
                        />
                        <p>Wifi Password</p>
                        <input
                            type="text"
                            placeholder="Wifi Password"
                            required
                            value={wifiPassword}
                            onChange={(e) => setWifiPassword(e.target.value)}
                        />
                    </div>
                    {/* ปุ่มส่งข้อมูล */}
                    <button type="submit" className="btn btn-primary mt-3">Submit</button>

                    {/* ปุ่ม Next ที่ปิดใช้งานถ้าข้อมูลยังไม่ถูกบันทึก */}
                    <a href="UrlCamera" className={`btn btn-info mt-3 ${!saved ? 'disabled' : ''}`}>
                        <span className="text nav-text">Next</span>
                    </a>
                </form>
            </section>
        </div>
    );
}

export default SettingCode;
