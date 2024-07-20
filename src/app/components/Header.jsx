"use client";

import React, { useEffect } from 'react'; 
import Image from "next/image";
import Link from "next/link";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Cursor, PersonFill } from 'bootstrap-icons-react';
import { setupNavTest } from '../../app/script.js';
import 'boxicons/css/boxicons.min.css';
import { useSession } from "next-auth/react";

function Header() {
    const { data: session } = useSession();
    // console.log(session);

    return (
        <div className="col-12 d-flex mt-10 mb-10 align-items-center justify-content-around">
            <div className="">
                <select className="form-select" aria-label="Default select example" defaultValue="">
                    <option value="" disabled>เลือกเมนูนี้</option>
                    <option value="1">ลานจอดรถวิศวคอมพิวเตอร์</option>
                    <option value="2">สอง</option>
                    <option value="3">สาม</option>
                </select>
            </div>

            <div>
                {session
                    ? <img className='w-11 ml-2.5 d-flex items-center justify-center rounded-circle' src={session?.user?.image} alt="" />
                    : <i className='bx bxs-user-circle fs-1' style={{ cursor: 'pointer' }} onClick={() => { window.location.href = 'LoginPage' }}></i>}
            </div>
        </div>
    );
}

export default Header;
