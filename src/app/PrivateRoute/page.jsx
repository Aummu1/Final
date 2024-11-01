"use client";

import React, { useEffect, useState } from 'react';

const PrivateRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // ใช้ state เพื่อเก็บสถานะการล็อกอิน

    useEffect(() => {
        const user = localStorage.getItem('username'); // หรือ sessionStorage.getItem('user');

        if (!user) {
            // ถ้าไม่มี user ให้ redirect
            window.location.href = "https://appb17.bd2-cloud.net/LoginPage";
        } else {
            // ถ้ามี user ให้ตั้งสถานะเป็น true
            setIsAuthenticated(true);
        }
    }, []); // รันเพียงครั้งเดียวเมื่อ component ถูก mount

    if (isAuthenticated === null) {
        return null; // รอจนกว่า useEffect จะเสร็จสิ้น
    }

    return children; // ให้ render children (AdminPage)
};

export default PrivateRoute;
