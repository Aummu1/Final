"use client";

import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'boxicons/css/boxicons.min.css';
import { signOut } from 'next-auth/react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

function ResetPassword() {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState(""); // กรอก email ที่ต้องการเปลี่ยนรหัสผ่าน

    const register = async (event) => {
        event.preventDefault(); // Prevent the default form submission

        try {
            const response = await axios.post(
                "http://localhost:2546/api/user/resetpassword",
                { 
                    password: password,
                    email: email, // ส่ง email ไปพร้อมกับรหัสผ่าน
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            alert("User Reset Password Successfully.");
            console.log("Reset password result:", response.data);
            await signOut({ callbackUrl: "/" }); // Redirect after successful password reset
        } catch (error) {
            console.error("Error resetting password:", error.message);
            alert("Error resetting password. Please try again.");
        }
    };

    return (
        <div>
            <Navbar />
            <section className="vh-100">
                <div className="container py-5 h-100">
                    <div className="row d-flex align-items-center justify-content-center h-100">
                        <div className="col-md-8 col-lg-7 col-xl-6">
                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                                className="img-fluid" alt="Phone image" />
                        </div>
                        <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
                            <form onSubmit={register}>
                                <h2 className='d-flex justify-center mb-5'>Reset Password</h2>
                                <div className="form-floating mb-5">
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        id="floatingEmail" 
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <label htmlFor="floatingEmail">Email</label>
                                </div>
                                <div className="form-floating mb-5">
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        id="floatingPassword" 
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <label htmlFor="floatingPassword">New Password</label>
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
            <Footer />  
        </div>
    );
}

export default ResetPassword;
