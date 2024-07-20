"use client";
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'boxicons/css/boxicons.min.css';
import axios from 'axios';
import Navbar from "../components/Navbar";

function Form() {
    //ประกาศตัวแปรสถานะ userData เพื่อเก็บข้อมูลที่ได้รับจากเซิร์ฟเวอร์ โดยค่าเริ่มต้นเป็นอาเรย์ว่าง
    const [userData, setUserData] = useState([]);

    //ใช้ useEffect เพื่อทำการเรียกข้อมูลจากเซิร์ฟเวอร์เมื่อคอมโพเนนต์นี้ถูก mount
    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = () => {
        axios.get('http://localhost:2546/api/user/getdataform')
            .then(response => {
                setUserData(response.data);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    };

    const deleteUser = async (id) => {
        console.log("Deleting user with id:", id);// เพิ่มบรรทัดนี้เพื่อดีบั๊ก
        axios.delete(`http://localhost:2546/api/user/delete/${id}`)

        //ใน .then เราจะอัปเดตสถานะ userData โดยกรองข้อมูลใน userData และเอาผู้ใช้ที่มี id ตรงกับค่าที่ส่งมาออกไป
        .then(() => {
            //setUserData(userData.filter(user => user.id !== id)) จะสร้างอาเรย์ใหม่ที่ไม่รวมผู้ใช้ที่ถูกลบ และอัปเดตสถานะ userData ด้วยอาเรย์ใหม่นี้
            setUserData(userData.filter(user => user.id !== id));
        })
        .catch(error => {
            console.error("Error deleting data:", error);
        });
    };

    return (
        <div className="container py-5">
            <Navbar />
            <h3 className="text-center">Form</h3>
            {userData.length > 0 ? (
                userData.map((user, index) => (
                    <div className="card-main mb-3" key={index}>
                        <div className="card-body">
                            <h5 className="card-title">User Information</h5>
                            <p className="card-text mt-4 "><strong>Name:</strong> {user.Name_Professor}</p>
                            <p className="card-text"><strong>Department:</strong> {user.Department}</p>
                            <p className="card-text"><strong>Faculty:</strong> {user.Faculty}</p>
                            <p className="card-text"><strong>Car Register:</strong> {user.Car_Registor}</p>
                            <p className="card-text mb-4"><strong>Car Model:</strong> {user.Car_model}</p>
                        </div>
                        <div className="d-flex justify-end gap-2">
                            <button type="button" className="btn btn-danger btn-lg btn-block" onClick={() => deleteUser(user.id)}>Delete</button>
                            <button type="button" className="btn btn-primary btn-lg btn-block">Confirm</button>
                        </div>
                    </div>
                ))
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default Form;
