"use client";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'boxicons/css/boxicons.min.css';
import { useState } from 'react';
import axios from 'axios'; 

function Forget() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
         
    const register = async (event) => {
        event.preventDefault(); // Prevent the default form submission

        try {
            const response = await axios.post(
                "https://apib17.bd2-cloud.net/api/admin/resetpassword",
                { 
                    password: password,
                    username: username, 
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            // เช็คว่าคำตอบที่ได้มี success เป็น true หรือไม่
            if (response.data.success) {
                alert("User Reset Password Successfully.");
                console.log("Reset password result:", response.data);

                handleLogout(); 
                
            } else {
                alert(response.data.message); // แสดงข้อความจาก server หากไม่สำเร็จ
            }
        } catch (error) {
            console.error("Error resetting password:", error.message);
            alert("Error resetting password. Please try again.");
        }
    };

    const handleLogout = () => {
        // ลบข้อมูลผู้ใช้จาก localStorage หรือ sessionStorage
        localStorage.removeItem('username'); // แก้ไขให้ตรงตามที่คุณเก็บข้อมูลผู้ใช้
        // หรือ
        // sessionStorage.removeItem('user');

        // เปลี่ยนเส้นทางไปยังหน้าหลัก
        window.location.href = "https://appb17.bd2-cloud.net/ForAdmin";
    };

    return (
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
                                        type="text" 
                                        className="form-control" 
                                        id="floatingUsername" 
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                    <label htmlFor="floatingEmail">Username</label>
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
    );
}

export default Forget;
