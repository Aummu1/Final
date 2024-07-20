"use client";
import React, { useState } from 'react';
import Link from "next/link";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'boxicons/css/boxicons.min.css';
import axios from 'axios';

function Register() {
    const [nameReg, setnameReg] = useState(""); //nameReg, facultyReg, modelReg, registrationReg ใช้สำหรับเก็บค่าจากฟอร์ม
    const [facultyReg, setfaculty] = useState("");
    const [modelReg, setmodel] = useState("");
    const [registrationReg, setregistration] = useState("");
    const [error, setError] = useState("");

    const register = async () => {
        if (!nameReg || !facultyReg || !modelReg || !registrationReg) {
            setError("กรุณากรอกข้อมูลให้ครบทุกช่อง"); 
            alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:2546/api/user/portdataform", 
                
                //ส่งข้อมูลไปยัง http://localhost:2546/api/user/register โดยมีข้อมูลที่ประกอบด้วย name, faculty, model, และ registration
                { 
                    name: nameReg, faculty: facultyReg, model: modelReg, registration: registrationReg 
                },

                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            alert("User Registered Successfully.");
            console.log("Assessment result:", response.data);

            // Redirect to form page
            window.location.href = "/";
            return response.data;

        } catch (error) {
            console.error("Error fetching assessment result:", error.message);
            // Handle errors gracefully
            return null;
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
                        <form>
                            <div className="d-flex justify-center mt-3">
                                <h3>Registor to use parking lot</h3>
                            </div>
                            {/* Name input */}
                            <div className="form-floating mb-3 mt-3">
                                <input type="text" className="form-control" id="floatingInput" placeholder="Name"
                                    value={nameReg} onChange={(e) => setnameReg(e.target.value)} />
                                <label htmlFor="floatingInput">Name</label>
                            </div>
                            {/* faculty */}
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="floatingFaculty" placeholder="Faculty"
                                    value={facultyReg} onChange={(e) => setfaculty(e.target.value)} />
                                <label htmlFor="floatingFaculty">Faculty</label>
                            </div>
                            {/* car brand */}
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="floatingCarBrand" placeholder="Car Brand"
                                    value={modelReg} onChange={(e) => setmodel(e.target.value)} />
                                <label htmlFor="floatingCarBrand">Car Brand</label>
                            </div>
                            {/* ทะเบียนรถ */}
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="floatingRegistration" placeholder="Registration"
                                    value={registrationReg} onChange={(e) => setregistration(e.target.value)} />
                                <label htmlFor="floatingRegistration">ทะเบียนรถ</label>
                            </div>
                            {/* Submit button */}
                            <div className="d-grid gap-2">
                                <button type="button" className="btn btn-primary btn-lg btn-block" onClick={register}>Sign in</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Register;
