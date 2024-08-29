"use client";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'boxicons/css/boxicons.min.css';
import { signIn } from "next-auth/react";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import axios from 'axios'; 

function Login() {
    const router = useRouter()
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(true);

    const handleRememberMeChange = () => {
        setRememberMe(!rememberMe);
    }

    const handleSignin = async () => {
        console.log(username, password);
        try {
            const result = await signIn("credentials", {
            username,
            password,
            redirect: false,
            });
            
            if (result.error || (result.status && result.status !== 200)) {
            console.error(result.error || result.data[0].data);
            alert(result.error || result.data[0].data);
            } else {
            router.replace("/AdminPage");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleGoogle = async () => {
        try {
            await signIn("google", { callbackUrl: "/AdminPage" });
        } catch (error) {
            console.log(error);
        }
    }  
    
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
                            <div className="d-flex justify-content-around align-items-center mb-4">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value="" id="form1Example3" checked={rememberMe} onChange={handleRememberMeChange} />
                                    <label className="form-check-label" htmlFor="form1Example3"> Remember me </label>
                                </div>
                                <a href="#!">Forgot password?</a>
                            </div>
                            <div className="d-grid gap-2">
                                <button type="button" className="btn btn-primary btn-lg btn-block" onClick={handleSignin}>Sign in</button>        
                            </div>
                            <div className="divider d-flex align-items-center my-4">
                                <p className="text-center fw-bold mx-3 mb-0 text-muted">OR</p>
                            </div>
                        </form>
                        <button
                            type="submit"
                            className="bg-white border border-black text-black w-full p-2 flex flex-row justify-center gap-2 items-center rounded-sm hover:bg-gray-200 duration-100 ease-in-out"
                            onClick={handleGoogle}
                        >
                            <i className='bx bxl-google bx-lg'></i>
                            Google
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Login;
