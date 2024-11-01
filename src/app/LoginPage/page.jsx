"use client";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'boxicons/css/boxicons.min.css';
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import axios from 'axios'; 

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const router = useRouter();

    // ฟังก์ชันสร้างค่า state และ nonce แบบสุ่ม
    const generateRandomString = (length) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    const handleLineLogin = () => {
        const state = generateRandomString(16);
        const nonce = generateRandomString(16);
        const lineLoginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=2006415575&redirect_uri=${encodeURIComponent("https://appb17.bd2-cloud.net/AdminPage")}&state=${state}&scope=profile%20openid&nonce=${nonce}`;
    
        window.location.href = lineLoginUrl;
    };
      

    const handleSignin = async () => {
        try {
            const response = await axios.post("https://apib17.bd2-cloud.net/api/admin/login", {
                username,
                password
            });
    
            if (response.data.success) {
                localStorage.setItem("username", username);
                router.push("/AdminPage");
            } else {
                alert(response.data.message || "Invalid username or password");
            }
        } catch (error) {
            console.error("Login error:", error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert("An error occurred during login. Please try again.");
            }
        }
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
                        <h3 className="d-flex justify-center mb-5 mt-5">Register for Admin</h3>
                        <form>
                            <div className="form-floating mb-5">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="floatingInput" 
                                    placeholder="name@example.com"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <label htmlFor="floatingInput">Username</label>
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
                                <label htmlFor="floatingPassword">Password</label>
                            </div>
                            <div className="d-flex justify-content-end align-items-center mb-4">
                                <a href="/Forget">Forgot password?</a>
                            </div>
                            <div className="d-grid gap-2">
                                <button type="button" className="btn btn-primary btn-lg btn-block" onClick={handleSignin}>Sign in</button>        
                            </div>
                            {/* <div className="divider d-flex align-items-center my-4">
                                <p className="text-center fw-bold mx-3 mb-0 text-muted">OR</p>
                            </div> */}
                        </form>
                        {/* <button
                            type="button"
                            className="bg-success text-black w-full p-2 flex flex-row justify-center gap-2 items-center rounded-sm hover:bg-gray-200 duration-100 ease-in-out"
                            onClick={handleLineLogin}
                        >
                            <i className='bx bxl-line bx-lg'></i>
                            Login with Line
                        </button> */}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Login;
