'use client'
/** @jsxImportSource @emotion/react */
import Link from "next/link";
import 'bootstrap/dist/css/bootstrap.min.css';
import { PersonFill } from 'bootstrap-icons-react';
import { BarChart } from '@mui/x-charts/BarChart';
import React, { useEffect, useState } from 'react';
import '../../app/script.js'; 

function Footer() {
    return (
        <div id="footer" className="mb-0">
            <div className="container ">
            <footer className="p-4 mt-5">
                <ul className="nav justify-content-center border-bottom pb-3 mb-3">
                    <li className="nav-item"><p className="px-2">Home</p></li>
                    <li className="nav-item"><p className="px-2">Features</p></li>
                    <li className="nav-item"><p className="px-2">Pricing</p></li>
                    <li className="nav-item"><p className="px-2">FAQs</p></li>
                    <li className="nav-item"><p className="px-2">About</p></li>
                </ul>
                <p className="text-center">© 2024 Company, Inc</p>
            </footer>
        </div>
        </div>
    );
}

export default Footer;

export const setupNavTest = () => {
    const body = document.querySelector("body");
    const sidebar = body.querySelector(".sidebar");
    const toggle = body.querySelector(".toggle");
    const modeSwitch = body.querySelector(".toggle-switch");
    const modeText = body.querySelector(".mode-text");

    let sidebarState = 1; // เริ่มต้นที่ 1 เพื่อให้ sidebar เป็นขนาดเล็กสุดเมื่อโหลดหน้าเว็บ

    if (modeSwitch) {
        modeSwitch.addEventListener("click", () => {
            toggleDarkMode();
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
