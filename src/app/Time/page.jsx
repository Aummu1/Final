"use client";
import React, { useState } from 'react';
import Link from "next/link";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'boxicons/css/boxicons.min.css';
import axios from 'axios'; // ใช้ Axios สำหรับ HTTP requests
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

function Time() {
    const [time, settime] = useState("");

    const setting = async (event) => {
        event.preventDefault(); // Prevent the default form submission

        try {
            const response = await axios.post(
                "http://localhost:2546/api/user/settingtime",
                { 
                    time,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            alert("Time Setting Successfully.");
            await signOut({ callbackUrl: "/" }); // Redirect after successful password reset
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
                                    <div className="form-floating mb-5">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="floatingSecond"
                                            placeholder="Second"
                                            onChange={(e) => settime(e.target.value)}
                                        />
                                        <label htmlFor="floatingPassword">Second</label>
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
