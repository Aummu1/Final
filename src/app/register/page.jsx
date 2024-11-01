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
        Honda: [
            "JAZZ",
            "Accord",
            "Civic",
            "CR-V",
            "HR-V",
            "Odyssey",
            "Pilot",
            "Insight",
            "NSX",
            "S2000",
        ],
        Toyota: [
            "Camry",
            "Corolla",
            "RAV4",
            "Highlander",
            "Tacoma",
            "Prius",
            "Mirai",
            "GR Supra",
            "86"
        ],
        Mazda: [
            "MX-5",
            "Mazda2",
            "Mazda3",
            "Mazda6",
            "CX-3",
            "CX-5",
            "CX-9"
        ],
        Isuzu: [
            "Ascender",
            "D-Max",
            "MU-X",
            "NPR",
            "NQR",
            "FTR"
        ],
        Suzuki: [
            "Across",
            "Baleno",
            "Celerio",
            "Ciaz",
            "Jimny",
            "S-Cross",
            "Swift",
            "Vitara",
            "XL7"
        ],
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
        Mahindra: [
            "XUV300",
            "Scorpio",
            "Thar",
            "Bolero",
            "Marazzo",
            "Alturas G4"
        ],
        Ford: [
            "Mustang",
            "F-150",
            "Explorer",
            "Escape",
            "Edge",
            "Ranger",
            "Bronco Sport"
        ],
        Chevrolet: [
            "Camaro",
            "Corvette",
            "Spark",
            "Bolt EV",
            "Equinox",
            "Suburban",
            "Tahoe",
            "Silverado 1500",
            "Colorado",
            "Silverado HD (2500/3500)"
        ],
        Nissan: [
            "Altima",
            "Maxima",
            "Sentra",
            "Versa",
            "Rogue",
            "Murano",
            "Pathfinder",
            "Armada",
            "GT-R"
        ],
        BMW: [
            "X1 sDrive28i",
            "X3 xDrive30i",
            "X5 xDrive40i",
            "330i Sedan",
            "530i Sedan",
            "740i Sedan",
            "M4 Coupe",
            "M8 Convertible"
        ],
        MercedesBenz: [
            "C-Class",
            "E-Class",
            "S-Class",
            "G-Class",
            "GLC-Class"
        ],
        Audi: [
            "A3",
            "A4",
            "A5",
            "Q3",
            "Q5",
            "Q7"
        ],
        Volkswagen: [
            "Golf",
            "Jetta",
            "Passat",
            "Atlas",
            "Tiguan"
        ],
        Porsche: [
            "718 Boxster",
            "718 Cayman",
            "911",
            "Panamera",
            "Cayenne",
            "Macan"
        ],
        RollsRoyce: [
            "Ghost",
            "Wraith",
            "Dawn",
            "Phantom",
            "Cullinan"
        ],
        McLaren: [
            "540C",
            "570S",
            "570GT",
            "600LT",
            "720S",
            "Artura"
        ],
        Lexus: [
            "ES",
            "IS",
            "GS",
            "LS",
            "UX",
            "NX",
            "RX",
            "GX",
            "LX"
        ],
        Hyundai: [
            "Elantra",
            "Sonata",
            "Tucson",
            "Santa Fe",
            "Kona",
            "Accent",
            "Palisade"
        ],
        Kia: [
            "Forte",
            "Optima",
            "Stinger",
            "Sorento",
            "Soul",
            "Telluride"
        ],
        Subaru: [
            "Ascent",
            "Impreza",
            "Legacy",
            "Outback",
            "BRZ",
            "WRX",
            "Crosstrek",
            "Crosstrek Hybrid"
        ],
        Mitsubishi: [
            "Outlander",
            "Eclipse Cross",
            "Mirage",
            "Mirage G4",
            "Outlander Sport"
        ],
        Tesla: [
            "Model S",
            "Model 3",
            "Model X",
            "Model Y"
        ],
        Dodge: [
            "Challenger",
            "Charger",
            "Durango",
            "Journey",
            "RAM 1500",
            "RAM 2500",
            "RAM 3500",
            "Grand Caravan",
            "Challenger SRT Demon",
            "Viper"
        ],
        Ram: [
            "1500",
            "2500",
            "3500",
            "TRX"
        ],
        Volvo: [
            "XC40",
            "XC60",
            "XC90",
            "S60",
            "V60",
            "C40 Recharge",
            "XC40 Recharge",
            "Polestar 2"
        ],
        LandRover: [
            "Defender",
            "Discovery",
            "Discovery Sport",
            "Range Rover",
            "Range Rover Evoque",
            "Range Rover Sport"
        ],
        Jaguar: [
            "I-PACE",
            "F-PACE",
            "F-TYPE",
            "XE",
            "XF"
        ],
        Fiat: [
            "500",
            "500X",
            "124 Spider"
        ],
        AlfaRomeo: [
            "Giulia",
            "Giulia Quadrifoglio",
            "Stelvio",
            "Stelvio Quadrifoglio"
        ],
        Peugeot: [
            "208",
            "2008",
            "308",
            "3008",
            "508",
            "5008"
        ],
        Citroen: [
            "C1",
            "C3",
            "C3 Aircross",
            "C4",
            "C5 Aircross"
        ],
        Renault: [
            "Arkana",
            "Captur",
            "Clio",
            "Megane",
            "Zoe"
        ],
        Skoda: [
            "Fabia",
            "Scala",
            "Octavia",
            "Superb",
            "Karoq",
            "Kodiaq",
            "Enyaq iV"
        ],
        SEAT: [
            "Arona",
            "Ibiza",
            "Leon",
            "Leon Sportstourer",
            "Tarraco",
            "Mii",
            "Born"
        ],
        OpelVauxhall: [
            "Adam",
            "Corsa",
            "Astra",
            "Insignia",
            "Mokka",
            "Grandland",
            "Crossland",
            "Combo",
            "Vivaro",
            "Movano"
        ],
        Mini: [
            "Cooper",
            "Cooper S",
            "John Cooper Works",
            "Cooper SE",
            "Countryman",
            "Clubman",
            "Paceman",
            "Countryman John Cooper Works"
        ],
        Saab: [
            "09-May",
            "09-Mar",
            "9-3 Convertible",
            "9-5 SportCombi"
        ],
        Bugatti: [
            "Chiron",
            "Veyron",
            "EB 110",
            "EB 110 SS"
        ],
        Maserati: [
            "Ghibli",
            "Quattroporte",
            "Levante",
            "GranTurismo"
        ],
        Lancia: [
            "Stratos HF",
            "Delta Integrale",
            "Thema 8.32",
            "Aurelia B24",
            "Fulvia"
        ],
        Pagani: [
            "Huayra",
            "Zonda",
            "Huayra BC",
            "Huayra R",
            "Huayra Imola"
        ],
        Koenigsegg: [
            "Gemera",
            "Jesko",
            "Regera",
            "Agera RS",
            "One:1",
            "Agera S",
            "Agera R",
            "CCXR Trevita",
            "CCX",
            "CCXR",
            "CC",
            "CC8S"
        ],
        Genesis: [
            "G70",
            "G80",
            "GV70",
            "GV80",
            "GV90"
        ],
        Polestar: [
            "Polestar 1",
            "Polestar 2",
            "Polestar 3"
        ],
        LucidMotors: [
            "Lucid Air",
            "Lucid Air Dream Edition Performance"
        ],
        Rivian: [
            "R1T",
            "R1S"
        ],
        FaradayFuture: [
            "FF 91"
        ],
        Alpina: [
            "B3",
            "B4",
            "B5",
            "B7",
            "XB7"
        ],
        Cadillac: [
            "CT4",
            "CT4-V",
            "CT5",
            "CT5-V",
            "CT5-V Blackwing",
            "Escalade",
            "XT4",
            "XT5",
            "XT6"
        ],
        Caterham: [
            "Seven 170",
            "Seven 270",
            "Seven 360",
            "Seven 420",
            "Seven 620"
        ],
        Chrysler: [
            "300",
            "Pacifica",
            "Voyager",
            "Pacifica Hybrid"
        ],
        Fisker: [
            "Ocean",
            "Pear"
        ],
        Infiniti: [
            "QX50",
            "QX60",
            "QX80",
            "Q50",
            "Q60",
            "QX70",
            "QX70 Hybrid"
        ],
        Lotus: [
            "Emira",
            "Elise",
            "Exige",
            "Evija"
        ],
        Morgan: [
            "Aero 8",
            "Plus 4",
            "Plus 6",
            "Roadster",
            "Super 3"
        ],
        Smart: [
            "Fortwo",
            "Forfour"
        ],
        Vauxhall: [
            "Corsa",
            "Crossland",
            "Grandland",
            "Insignia",
            "Mokka",
            "Vivaro",
            "Combo-Life"
        ],
        Zagato: [
            "Aston Martin DB4 GT Zagato",
            "Aston Martin V12 Zagato",
            "Alfa Romeo TZ3 Stradale",
            "Bentley Flying Spur Zagato",
            "Fiat 124 Spider Zagato",
            "Jaguar C-Type"
        ],
        Wiesmann: [
            "MF5",
            "GT MF4",
            "Roadster MF4"
        ],
        Lamborghini: [
            "Aventador",
            "Huracan",
            "Urus",
            "Sian",
            "Countach",
            "Diablo",
            "Murciélago",
            "Gallardo",
            "Espada",
            "Miura"
        ]
    };    

    const register = async () => {
        if (!nameReg || !facultyReg || !companyReg || !modelReg || !registrationReg) {
            setError("กรุณากรอกข้อมูลให้ครบทุกช่อง"); 
            alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
            return;
        }

        // ตรวจสอบว่ามีทั้งตัวเลขและตัวอักษร
        const hasLetter = /[a-zA-Zก-ฮ]/.test(registrationReg);
        const hasDigit = /\d/.test(registrationReg);

        if (!hasLetter || !hasDigit) {  
            setError("ทะเบียนรถต้องประกอบด้วยตัวอักษรและตัวเลขอย่างน้อยหนึ่งตัว");
            alert("ทะเบียนรถต้องประกอบด้วยตัวอักษรและตัวเลขอย่างน้อยหนึ่งตัว");
            return;
        }

        try {
            const response = await axios.post(
                "https://apib17.bd2-cloud.net/api/user/portdataform", 
                
                //ส่งข้อมูลไปยัง https://apib17.bd2-cloud.net/api/user/register โดยมีข้อมูลที่ประกอบด้วย name, faculty, model, และ registration
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

    //ตรวจสอบชื่อ
    const handleNameChange = (e) => {
        const value = e.target.value;
        if (/^[a-zA-Zก-ฮะ-์\s]*$/.test(value)) { // เพิ่มช่วง Unicode สำหรับสระและวรรณยุกต์ภาษาไทย
            setnameReg(value);
        }
    };    

    //ตรวจสอบคณะ
    const handleFacultyChange = (e) => {
        const value = e.target.value;
        if (/^[a-zA-Zก-ฮะ-์\s]*$/.test(value)) { // ตรวจสอบว่าเป็นตัวอักษรและช่องว่างเท่านั้น
            setfaculty(value);
        }
    };

    const handleRegistrationChange = (e) => {
        const value = e.target.value;
        setregistration(value);
    };

    //รับข้อมูลยี่ห้อและรุ่นของรถจาก carData และแปลงเป็น array ของ object ที่มี key เป็น value และ label เพื่อใช้เป็นตัวเลือกใน dropdown
    const formatCompanyOptions = (data) => {
        //ใช้ Object.keys(data) เพื่อดึงชื่อยี่ห้อทั้งหมดออกมา แล้วใช้ map เพื่อสร้าง object ที่มี value และ label เป็นชื่อยี่ห้อนั้นๆ
        return Object.keys(data).map((brand) => ({
        value: brand,
        label: brand,
        }));
    };
    
    //รับ array ของรุ่นรถ และแปลงเป็น array ของ object ที่มี value และ label เช่นเดียวกับ formatCompanyOptions
    const formatModelOptions = (models) => {
        //ใช้ map เพื่อสร้าง object ที่มี value และ label เป็นชื่อรุ่นร
        return models.map((model) => ({
        value: model,
        label: model,
        }));
    };

    //เมื่อผู้ใช้เลือกยี่ห้อรถ จะทำการอัปเดต state ของ selectedCompany และ company พร้อมทั้งตั้งค่า dropdown ของรุ่นรถ (modelOptions) ตามยี่ห้อที่เลือก
    const handleCompanyChange = (selected) => {
        setSelectedCompany(selected);
        setcompany(selected ? selected.value : ""); // เก็บค่าของ company ใน state
        setModelOptions(selected ? formatModelOptions(carData[selected.value]) : []); //เพื่ออัปเดตตัวเลือกของรุ่นรถให้ตรงกับยี่ห้อที่เลือก
        setmodel(null); // รีเซ็ตโมเดลเมื่อเปลี่ยนบริษัท
    };

    // เมื่อผู้ใช้เลือกรุ่นรถ จะอัปเดต state ของ model
    const handleModelChange = (selected) => {
        setmodel(selected ? selected.value : null); // เพื่อเก็บค่า string ของรุ่นรถใน state model
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
                                    isDisabled={!selectedCompany} //ใช้เพื่อปิดการใช้งาน dropdown ของรุ่นรถเมื่อยังไม่เลือกยี่ห้อรถ
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
                                <button type="button" className="btn btn-primary btn-lg btn-block" onClick={register}>ลงทะเบียนรถ</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Register;