"use client";

import { useEffect, useState } from 'react'; // import useState เพื่อใช้สถานะ
import { useRouter } from 'next/navigation';
import axios from 'axios';

function Callback() {
    const router = useRouter();
    const [isUsernameSaved, setIsUsernameSaved] = useState(false); // สร้างสถานะใหม่

    useEffect(() => {
        const handleLogin = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const state = urlParams.get('state');

            console.log("Code:", code);  // ตรวจสอบค่า code
            console.log("State:", state); // ตรวจสอบค่า state

            if (code) {
                try {
                    // ส่งรหัสไปยัง API เพื่อรับข้อมูลผู้ใช้
                    const response = await axios.post('https://apib17.bd2-cloud.net/api/login/callback', {
                        code,
                        state
                    });

                    console.log("Response from server:", response.data); // ดูข้อมูลที่ได้รับจาก server

                    if (response.data.success) {
                        const username = response.data.name; // ดึงชื่อผู้ใช้จากการตอบกลับของเซิร์ฟเวอร์
                        console.log("Username:", username); // ดูค่าของ username ก่อนจะบันทึก
                        
                        if (username) {
                            localStorage.setItem("username", username); // เก็บชื่อผู้ใช้ใน localStorage
                            setIsUsernameSaved(true); // อัพเดตสถานะว่าได้บันทึกแล้ว
                            
                        } else {
                            alert("ไม่พบชื่อผู้ใช้จาก LINE");
                            router.push("/"); // เปลี่ยนเส้นทางไปยังหน้าอื่น
                        }
                    } else {
                        alert(response.data.message || "ไม่พบข้อมูลในระบบ");
                        router.push("/"); // เปลี่ยนเส้นทางไปยังหน้าอื่น
                    }
                    
                } catch (error) {
                    console.error("Error during callback handling:", error);
                    alert("เกิดข้อผิดพลาดระหว่างการล็อกอิน: " + error.message);
                    router.push("/"); // เปลี่ยนเส้นทางไปยังหน้าอื่น
                }
            } else {
                alert("ไม่พบรหัสการล็อกอิน");
                router.push("/"); // เปลี่ยนเส้นทางไปยังหน้าอื่น
            }
        };

        handleLogin();
    }, [router]);

    // ตรวจสอบสถานะก่อนที่จะเปลี่ยนเส้นทาง
    useEffect(() => {
        if (isUsernameSaved) {
            console.log("Redirecting to AdminPage..."); // ตรวจสอบว่ากำลังเปลี่ยนเส้นทาง
            router.push("/AdminPage"); // เปลี่ยนเส้นทางไปยัง AdminPage
        }
    }, [isUsernameSaved, router]);

    return <div>Loading...</div>;
}

export default Callback;
