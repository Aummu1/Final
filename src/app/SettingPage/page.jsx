'use client'
import Image from "next/image";
import Link from "next/link";
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';

import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SettingCode from "../SettingCode/page";

function SettingPage() {
    return (
        <div className="">
            <Navbar />
                <div className="ml-20 mt-5 mr-2">
                    <SettingCode />
                    <Footer />
                </div>
        </div>
    );
}

export default SettingPage;
