'use client'
import Image from "next/image";
import Link from "next/link";
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from "./Dashboard/page";
import Footer from "./components/Footer";
import 'boxicons/css/boxicons.min.css';

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
    </div>
  );
}
