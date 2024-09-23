'use client'
import Image from "next/image";
import Link from "next/link";
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from "./Dashboard/page";
import Footer from "./components/Footer";
import 'boxicons/css/boxicons.min.css';

export default function Home() {
  return (
    <div>
      <Dashboard />
      <Footer />
      <button className="floating-button" onClick={() => {window.location.href = 'register'}}>+</button>
    </div>
  );
}
