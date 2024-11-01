"use client";

import React, { useEffect, useState} from 'react'; // นำเข้า useEffect จาก React
import 'bootstrap/dist/css/bootstrap.min.css';
import { globals } from "styled-jsx/css";
import 'boxicons/css/boxicons.min.css';
import '../../app/script.js'; 

function Navbar() {
    const [username, setUsername] = useState(null);

    async function logout(){
        // ล้างข้อมูลที่จัดเก็บใน localStorage
        localStorage.removeItem("username");
        localStorage.removeItem("token"); // ถ้ามีการเก็บ token หรือข้อมูล session

        // ล้างข้อมูลใน sessionStorage
        sessionStorage.clear();

        // ล้าง cookies (ถ้าคุณใช้ cookies)
        document.cookie.split(";").forEach((c) => {
            document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        });

        // ทำการ redirect ผู้ใช้ไปยังหน้า login หรือหน้าอื่น ๆ ที่คุณต้องการ
        window.location.href = "https://appb17.bd2-cloud.net/LoginPage"; // เปลี่ยน URL นี้ไปยังหน้าที่คุณต้องการ
    }

    useEffect(() => {
        setupNavTest(); // เรียกใช้ setupNavTest เมื่อ component ถูก mount

        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    return (
        <nav className="sidebar close z-3 col-lg-3 d-flex flex-column flex-shrink-0 p-3 rounded-end-4 border-3 mb-0">
            <header>
                <div className="image-text">
                    <span className="image">
                        <img className="w-9 ml-2" src="/image/logo-rmutt.png" alt="" />
                    </span>
                </div>

                <i className='bx bx-chevron-right toggle'></i> 
            </header>

            <div className="menu-bar">
                <div className="menu">
                    <ul className="p-0 mt-4 mb-3 back">
                        <li className="nav-link">
                            <img className='w-8 ml-2.5 d-flex items-center justify-center rounded-circle' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb0EDOSRHFzhbsqcLhlQBgTTUzZN88jzKTyQ&s" alt="" />
                            <span className="ml-5 text nav-text">{username}</span>
                        </li>
                    </ul>

                    <ul className="menu-links p-0">
                        <li className="nav-link">
                            <a href="AdminPage">
                                <i className='bx bxs-home icon'></i> 
                                <span className="text nav-text">Dashboard</span>
                            </a>
                        </li>
                    </ul>
                    <ul className="menu-links p-0">
                        <li className="nav-link">
                            <a href="SettingPage">
                                <i className='bx bxs-cog icon'></i> 
                                <span className="text nav-text">Setting</span>
                            </a>
                        </li>
                    </ul>
                    {/* <ul className="menu-links p-0">
                        <li className="nav-link">
                            <a href="AddSpace">
                                <i className='bx bx-plus icon'></i> 
                                <span className="text nav-text">AddSpace</span>
                            </a>
                        </li>
                    </ul> */}
                    <ul className="menu-links p-0">
                        <li className="nav-link">
                            <a href="ResetPassword">
                                <i className='bx bx-reset icon'></i>
                                <span className="text nav-text">Reset Password</span>
                            </a>
                        </li>
                    </ul>
                    <ul className="menu-links p-0">
                        <li className="nav-link">
                            <a href="Form">
                                <i className='bx bxs-message-dots icon'></i>
                                <span className="text nav-text">Form</span>
                            </a>
                        </li>
                    </ul>
                    <ul className="menu-links p-0">
                        <li className="nav-link">
                            <a href="Infor_ParkingLot">
                            <i className='bx bxs-data icon'></i>
                                <span className="text nav-text">Information</span>
                            </a>
                        </li>
                    </ul>
                    <ul className="menu-links p-0">
                        <li className="nav-link">
                            <a href="Time">
                            <i className='bx bxs-time-five icon'></i>
                                <span className="text nav-text">Time</span>
                            </a>
                        </li>
                    </ul>
                    <ul className="menu-links p-0">
                        <li className="nav-link">
                            <a href="History_">
                            <i className='bx bx-history icon'></i>
                                <span className="text nav-text">History</span>
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="bottom-content cursor-pointer">
                    <li className="">
                        <a onClick={logout}>
                            <i className='bx bx-log-out icon'></i> 
                            <span className="text nav-text">Logout</span>
                        </a>
                    </li>

                    {/* <li className="mode mb-5">
                        <div className="moon-sun">
                            <i className='bx bx-moon icon moon'></i> 
                            <i className='bx bx-sun icon sun'></i> 
                        </div>

                        <span className="mode-text text">Dark Mode</span>
                        
                        <div className="toggle-switch" onClick={toggleDarkMode}>
                            <span className="switch"></span> 
                        </div>
                    </li> */}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;


export const setupNavTest = () => {
    const body = document.querySelector("body");
    const sidebar = body.querySelector(".sidebar");
    const toggle = body.querySelector(".toggle");
    const modeSwitch = body.querySelector(".toggle-switch");

    let sidebarState = 1; // เริ่มต้นที่ 1 เพื่อให้ sidebar เป็นขนาดเล็กสุดเมื่อโหลดหน้าเว็บ

    if (modeSwitch) {
        modeSwitch.addEventListener("click", () => {
            toggleDarkMode();
            updateModeText();
        });
    }
    
    toggle.addEventListener("click", () => {
        sidebarState = (sidebarState + 1) % 2; // สลับสถานะของ sidebar ระหว่าง 1 และ 0
        if (sidebarState === 0) {
            sidebar.classList.add("close"); // เพิ่มคลาส close เพื่อให้ขนาดของ sidebar เล็กลง
        } else {
            sidebar.classList.remove("close"); // ลบคลาส close เพื่อให้ขนาดของ sidebar เพิ่มขึ้น
        }
    });
};

export const toggleDarkMode = () => {
    const body = document.querySelector("body");
    body.classList.toggle("dark");
    const switchBtn = document.querySelector(".toggle-switch .switch");
    switchBtn.classList.toggle("dark");
};

export const updateModeText = () => {
    const body = document.querySelector("body");
    const modeText = document.querySelector(".mode-text");
    
    if (body.classList.contains("dark")) {
        modeText.innerText = "Light Mode";
    } else {
        modeText.innerText = "Dark Mode";
    }
};
