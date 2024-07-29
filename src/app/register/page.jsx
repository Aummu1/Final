"use client";
import React, { useState } from 'react';
import Link from "next/link";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'boxicons/css/boxicons.min.css';
import axios from 'axios';
import Select from 'react-select';

function Register() {
    const [nameReg, setnameReg] = useState(""); //nameReg, facultyReg, modelReg, registrationReg ใช้สำหรับเก็บค่าจากฟอร์ม
    const [facultyReg, setfaculty] = useState("");
    const [modelReg, setmodel] = useState("");
    const [companyReg, setcompany] = useState("");
    const [registrationReg, setregistration] = useState("");
    const [error, setError] = useState("");

    const [selectedCompany, setSelectedCompany] = useState(null);
    const [modelOptions, setModelOptions] = useState([]);

    // ข้อมูลบริษัทและโมเดลรถ
const carData = {
        Ferrari: [
        "812 Superfast",
        "F8 Tributo",
        "Roma",
        "Portofino M",
        "SF90 Stradale",
        "488 Pista",
        "GTC4Lusso",
        "488 GTB",
        "California T",
        "LaFerrari"
        ],
        Mahindra: [
        "XUV300",
        "Scorpio",
        "Thar",
        "Bolero",
        "Marazzo",
        "Alturas G4"
        ],
        Honda: [
        "Accord",
        "Civic",
        "CR-V",
        "HR-V",
        "Odyssey",
        "Pilot",
        "Insight",
        "NSX",
        "S2000"
        ],
        // เพิ่มบริษัทและโมเดลที่เหลือที่นี่
    };
    
    const formatCompanyOptions = (data) => {
        return Object.keys(data).map((brand) => ({
        value: brand,
        label: brand,
        }));
    };
    
    const formatModelOptions = (models) => {
        return models.map((model) => ({
        value: model,
        label: model,
        }));
    };

    const register = async () => {
        if (!nameReg || !facultyReg || !companyReg || !modelReg || !registrationReg) {
            setError("กรุณากรอกข้อมูลให้ครบทุกช่อง"); 
            alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
            return;
        }

        // ตรวจสอบว่ามีทั้งตัวเลขและตัวอักษร
        const hasLetter = /^[a-zA-Zก-ฮ]/.test(registrationReg);
        const hasDigit = /\d/.test(registrationReg);

        if (!hasLetter || !hasDigit) {
            setError("ทะเบียนรถต้องประกอบด้วยตัวอักษรและตัวเลขอย่างน้อยหนึ่งตัว");
            alert("ทะเบียนรถต้องประกอบด้วยตัวอักษรและตัวเลขอย่างน้อยหนึ่งตัว");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:2546/api/user/portdataform", 
                
                //ส่งข้อมูลไปยัง http://localhost:2546/api/user/register โดยมีข้อมูลที่ประกอบด้วย name, faculty, model, และ registration
                { 
                    name: nameReg, faculty: facultyReg, company: companyReg, model: modelReg, registration: registrationReg 
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

    const handleNameChange = (e) => {
        const value = e.target.value;
        if (/^[a-zA-Zก-ฮ\s]*$/.test(value)) { // ตรวจสอบว่าเป็นตัวอักษรและช่องว่างเท่านั้น
            setnameReg(value);
        }
    };

    const handleFacultyChange = (e) => {
        const value = e.target.value;
        if (/^[a-zA-Zก-ฮ\s]*$/.test(value)) { // ตรวจสอบว่าเป็นตัวอักษรและช่องว่างเท่านั้น
            setfaculty(value);
        }
    };

    const handleRegistrationChange = (e) => {
        const value = e.target.value;
        setregistration(value);
    };

    const handleCompanyChange = (selected) => {
        setSelectedCompany(selected);
        setcompany(selected ? selected.value : ""); // เก็บค่าของ company ใน state
        setModelOptions(selected ? formatModelOptions(carData[selected.value]) : []);
        setmodel(null); // รีเซ็ตโมเดลเมื่อเปลี่ยนบริษัท
    };

    const handleModelChange = (selected) => {
        setmodel(selected ? selected.value : null);
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
                                    value={nameReg} onChange={handleNameChange}/>
                                <label htmlFor="floatingInput">Name</label>
                            </div>
                            {/* faculty */}
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="floatingFaculty" placeholder="Faculty"
                                    value={facultyReg} onChange={handleFacultyChange} />
                                <label htmlFor="floatingFaculty">Faculty</label>
                            </div>

                            {/* Company dropdown */}
                            <div className="form-floating mb-3 select-container z-3">
                                <Select
                                    options={formatCompanyOptions(carData)}
                                    onChange={handleCompanyChange}
                                    placeholder="Select a company"
                                    isClearable
                                />
                            </div>

                            {/* Model dropdown */}
                            <div className="form-floating mb-3 select-container z-2">
                                <Select
                                    options={modelOptions}
                                    onChange={handleModelChange}
                                    placeholder="Select a model"
                                    isClearable
                                    isDisabled={!selectedCompany} 
                                />
                            </div>

                            {/* ทะเบียนรถ */}
                            <div className="form-floating mb-3 z-1">
                                <input type="text" className="form-control" id="floatingRegistration" placeholder="Registration"
                                    value={registrationReg} onChange={handleRegistrationChange} />
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
