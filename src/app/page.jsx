'use client'
import Image from "next/image";
import Link from "next/link";
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from "./Dashboard/page";
import Footer from "./components/Footer";
// import Header from "./components/Header";
// import React, { useEffect, useState } from 'react'; 
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { useSession } from "next-auth/react";
// import axios from 'axios';

export default function Home() {
  return (
    <div>
      {/* <Header /> */}
      <Dashboard />
      <Footer />
      <button className="floating-button" onClick={() => {window.location.href = 'register'}}>+</button>
      <style jsx>{`
        .floating-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 50px;
          height: 50px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 50%;
          box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          cursor: pointer;
          z-index: 1000; /* ให้ปุ่มอยู่ด้านหน้าสุด */
        }
      `}</style>
    </div>
  );
}
