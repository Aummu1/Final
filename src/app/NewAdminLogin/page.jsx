"use client";
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'boxicons/css/boxicons.min.css';
import axios from 'axios';
import { signOut } from 'next-auth/react';

function NewAdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [UserData, setUserData] = useState('');

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search.split("?")[1]);
        const gmail = searchParams.get("email");
        const name = searchParams.get("name");
        const imgurl = searchParams.get("imgurl");
        setUserData({ gmail, name, imgurl });
    }, []);

    // console.log(UserData);

    const register = async () => {
        if (!username || !password) {
            setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
            alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
            return;
        }
        const mail = UserData.gmail
        const img = UserData.imgurl
        const name = UserData.name

        try {
            const response = await axios.post(
                "https://apib17.bd2-cloud.net/api/user/updateAdmin", 
                { 
                    username, 
                    password,
                    mail,
                    img,
                    name
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log(response)
            if (response.status == 200) {
                alert("Admin Registered Successfully.");
                // console.log("Response:", response.data);
                // ออกจากระบบและเปลี่ยนเส้นทางไปยังหน้าฟอร์ม
                //window.location.href = "/";
                // return response.data;
                await signOut({ callbackUrl: "/" });
            } else {
                alert("Registration failed: " + response.data);
            }
        } catch (error) {
            console.error("Error during registration:", error.message);
            alert("Registration error: " + error.message);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault(); // ป้องกันการโหลดหน้าใหม่
        register();
    };

    const handleNameChange = (e) => {
        const value = e.target.value;
        if (/^[a-zA-Zก-ฮ\s]*$/.test(value)) { // ตรวจสอบว่าเป็นตัวอักษรและช่องว่างเท่านั้น
            setUsername(value);
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
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
                        <form onSubmit={handleSubmit}>
                            <div className="d-flex justify-center mt-3">
                                <h3>ลงทะเบียนเพื่อใช้ที่จอดรถ</h3>
                            </div>
                            {/* Name input */}
                            <div className="form-floating mb-3 mt-3">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="floatingInput" 
                                    placeholder="Name"
                                    value={username} 
                                    onChange={handleNameChange}
                                />
                                <label htmlFor="floatingInput">Name</label>
                            </div>
                            {/* Password */}
                            <div className="form-floating mb-3">
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    id="floatingPassword" 
                                    placeholder="Password"
                                    value={password} 
                                    onChange={handlePasswordChange}
                                />
                                <label htmlFor="floatingPassword">Password</label>
                            </div>
                            {/* Submit button */}
                            <div className="d-grid gap-2 mt-3">
                                <button type="submit" className="btn btn-primary btn-lg btn-block">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default NewAdminLogin;
