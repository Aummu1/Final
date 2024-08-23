'use client'
import Image from "next/image";
import Link from "next/link";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "../components/Navbar";
import Dashboard from "../Dashboard/page";
import Header from "../components/Header";
import Footer from "../components/Footer";
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function AdminPage() {
    const router = useRouter()
    const [mode, setMode] = useState(0);
    const { data: session } = useSession();
    // console.log(session);
    if (!session) {
        alert("Admin user found")
        router.replace("/LoginPage");
        return null;
    }
    useEffect(() => {
        const checkScreenWidth = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth > 1000) {
                setMode(1);
            } else if (screenWidth > 426) {
                setMode(2);
            } else {
                setMode(0);
            }
        };

        // Check screen width on component mount
        checkScreenWidth();

        // Add event listener to update screen width state when the window size changes
        window.addEventListener('resize', checkScreenWidth);

        // Cleanup function to remove event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', checkScreenWidth);
        };
    }, []);
    if(mode == 1){
        return (
            <div className="">
                <div className="row">
                    <div className={`col-${mode === 1 ? 1 : mode === 2 ? 1 : 2}`}>
                        <Navbar />
                    </div>
                    <div className={`col-${mode === 1 ? 11 : mode === 2 ? 11 : 10}`}>
                        <Header />
                        <Dashboard />
                    </div>
                    <Footer />
                </div>
            </div>
        );
    }
    else{
        return (
            <div className="container">
                <div className="row">
                    <div className={`col-${mode === 1 ? 0 : mode === 2 ? 1 : 2 }`}>
                        <Navbar />
                    </div>
                    <div className={`col-${mode === 1 ? 12 : mode === 2 ? 11 : 10}`}>
                        <Header />
                        <Dashboard />
                        <Footer />
                    </div>
                </div>
            </div>
        );
    }
}

export default AdminPage;
