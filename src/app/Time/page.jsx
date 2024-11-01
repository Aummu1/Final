"use client";
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'boxicons/css/boxicons.min.css';
import axios from 'axios'; // ใช้ Axios สำหรับ HTTP requests
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

function Time() {
    const [time, setTime] = useState("");
    const [parkingLots, setParkingLots] = useState([]);
    const [selectedParkingLot, setSelectedParkingLot] = useState(""); // State for selected ParkingLot_ID

    useEffect(() => {
        const fetchParkingLots = async () => {
            try {
                const response = await axios.get('https://apib17.bd2-cloud.net/api/user/option');
                setParkingLots(response.data);
            } catch (error) {
                console.error('Error fetching parking lots:', error);
            }
        };
        fetchParkingLots();
    }, []);

    const setting = async (event) => {
        event.preventDefault(); // Prevent the default form submission

        if (!selectedParkingLot) {
            alert("Please select a Parking Lot");
            return;
        }

        try {
            await axios.post(
                "https://apib17.bd2-cloud.net/api/user/settingtime",
                { 
                    time,
                    parkingLotID: selectedParkingLot // ส่ง ParkingLot_ID ไปด้วย
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            alert("Time Setting Successfully.");
        } catch (error) {
            console.error("Error Time Setting:", error.message);
            alert("Error Time Setting. Please try again.");
        }
    };

    return (
        <div className="ml-20 mr-2">
            <Navbar />
            <div>
                <section className="vh-100">
                    <div className="container py-5 h-100">
                        <div className="row d-flex align-items-center justify-content-center h-100">
                            <div className="col-md-8 col-lg-7 col-xl-6">
                                <img src="https://www.pngarts.com/files/7/Graphic-Web-Design-PNG-Transparent-Image.png"
                                    className="img-fluid" alt="Phone image" />
                            </div>
                            <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
                                <form onSubmit={setting}>
                                    <h2 className='d-flex justify-center mb-5'>Setting Time</h2>

                                    {/* Dropdown สำหรับเลือก ParkingLot */}
                                    <div className="form-floating mb-3">
                                        <select
                                            className="form-select"
                                            value={selectedParkingLot}
                                            onChange={(e) => setSelectedParkingLot(e.target.value)}
                                            required
                                        >
                                            <option value="">Choose ParkingLot</option>
                                            {parkingLots.map((lot) => (
                                                <option key={lot.ParkingLot_ID} value={lot.ParkingLot_ID}>
                                                    {lot.ParkingLot_Name}
                                                </option>
                                            ))}
                                        </select>
                                        <label htmlFor="floatingParkingLot">Parking Lot</label>
                                    </div>

                                    <div className="form-floating mb-5">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="floatingMinute"
                                            placeholder="Minute"
                                            onChange={(e) => setTime(e.target.value)}
                                            required
                                        />
                                        <label htmlFor="floatingPassword">Minute</label>
                                    </div>

                                    <div className="d-grid gap-2">
                                        <button type="submit" className="btn btn-primary btn-lg btn-block">
                                            Confirm
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}

export default Time;
