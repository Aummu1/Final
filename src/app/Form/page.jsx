"use client";
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Navbar from "../components/Navbar";

function DataTable() {
    const [userData, setUserData] = useState([]);
    const [allChecked, setAllChecked] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    //ฟังก์ชัน useEffect เพื่อเรียกข้อมูลผู้ใช้จาก API
    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = () => {
        axios.get('https://apib17.bd2-cloud.net/api/user/getdataform')
            .then(response => {
                setUserData(response.data);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    };

    //ฟังก์ชันลบผู้ใช้
    const deleteUser = async (userId) => {
        try {
            await axios.delete(`https://apib17.bd2-cloud.net/api/user/delete/${userId}`);
            setUserData(userData.filter(user => user.id !== userId));
        } catch (error) {
            console.error("Error deleting data:", error);
        }
    };

    //ฟังก์ชันลบผู้ใช้ที่ถูกเลือก
    const deleteSelectedUsers = async () => {
        const selectedUsers = userData.filter(user => user.checked); //user => user.checked เป็น callback function ที่ใช้กับ filter โดยจะทำการตรวจสอบว่า user.checked เป็น true หรือไม่
        //user => user.id เป็น callback function ที่ใช้กับ map โดยจะดึงค่า id ของแต่ละผู้ใช้ใน selectedUsers
        const selectedIds = selectedUsers.map(user => user.id);//selectedUsers เป็น array ที่ได้มาจากการกรองผู้ใช้ที่ถูกเลือก (checked)

        try {
            //Promise.all จะทำการลบผู้ใช้ทั้งหมดที่มี id อยู่ใน selectedIds โดยใช้ axios.delete สำหรับแต่ละ id
            await Promise.all(selectedIds.map(id => axios.delete(`https://apib17.bd2-cloud.net/api/user/delete/${id}`)));
            setUserData(userData.filter(user => !user.checked));
        } catch (error) {
            console.error("Error deleting data:", error);
        }
    };

    //ฟังก์ชันยืนยันผู้ใช้
    const ConfirmUser = async (user) => {
        try {
            console.log("Confirming user:", user); // เพิ่มการ log ข้อมูล user ที่จะถูกยืนยัน
            if (!user.id || !user.Name_Professor || !user.Faculty || !user.Car_company || !user.Car_model || !user.Car_Registor) {
                console.error("User data is incomplete:", user);
                return;
            }
            const payload = { 
                id: user.id,
                name: user.Name_Professor, 
                faculty: user.Faculty, 
                company: user.Car_company,
                model: user.Car_model, 
                registration: user.Car_Registor 
            };
            console.log("Payload to be sent:", payload); // เพิ่มการ log payload ที่จะถูกส่ง
            const response = await axios.post(
                "https://apib17.bd2-cloud.net/api/user/postconfirmdata", 
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            alert("Confirm Registered Successfully.");
            console.log("Assessment result:", response.data);
            setUserData(userData.filter(u => u.id !== user.id));
            return response.data;
        } catch (error) {
            console.error("Error confirming user:", error.response ? error.response.data : error.message); // เพิ่มการ log ข้อผิดพลาด
            return null;
        }
    };
    
    //ฟังก์ชันยืนยันผู้ใช้ที่ถูกเลือก
    const ConfirmSelectedUsers = async () => {
        const selectedUsers = userData.filter(user => user.checked);

        try {
            await Promise.all(selectedUsers.map(user => axios.post(
                "https://apib17.bd2-cloud.net/api/user/postconfirmdata", 
                { 
                    id: user.id,
                    name: user.Name_Professor, 
                    faculty: user.Faculty, 
                    company: user.Car_company,
                    model: user.Car_model, 
                    registration: user.Car_Registor 
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )));
            alert("Confirm Registered Successfully.");
            setUserData(userData.filter(user => !user.checked));
        } catch (error) {
            console.error("Error confirming data:", error.message);
        }
    };

    //ฟังก์ชันจัดการการเลือกทั้งหมดและการเลือกแต่ละรายการ
    const handleCheckAll = (event) => {
        const isChecked = event.target.checked; //เป็น boolean ที่บอกว่า checkbox ถูกเลือก (checked) หรือไม่
        setAllChecked(isChecked);
        setUserData(userData.map(user => ({ ...user, checked: isChecked }))); //checked: isChecked เพิ่มหรืออัปเดต property checked ของ user ด้วยค่า isChecked
    };


    const handleCheck = (index) => {
        //ใช้ spread operator (...) เพื่อคัดลอก array userData ทั้งหมดมาสร้างเป็น array ใหม่ updatedData
        const updatedData = [...userData];
        updatedData[index].checked = !updatedData[index].checked; //ใช้ NOT operator (!) เพื่อสลับค่า boolean ของ checked
        setUserData(updatedData);

        const allChecked = updatedData.every(user => user.checked);
        setAllChecked(allChecked);
    };

    //ใช้ในการอัปเดตค่า state ของ currentPage
    const handlePageChange = (pageNumber) => { 
        setCurrentPage(pageNumber); //เรียกฟังก์ชัน setCurrentPage เพื่ออัปเดตค่า currentPage ด้วยค่า pageNumber
    };

    //การคำนวณดัชนีของรายการสุดท้ายในหน้า
    const indexOfLastItem = currentPage * itemsPerPage; //ถ้าหมายเลขหน้าปัจจุบันคือ 2 และจำนวนรายการต่อหน้าคือ 7 ดัชนีของรายการสุดท้ายในหน้าที่สองจะเป็น 2 * 7 = 14
    
    //การคำนวณดัชนีของรายการแรกในหน้า
    const indexOfFirstItem = indexOfLastItem - itemsPerPage; //ถ้าดัชนีของรายการสุดท้ายคือ 14 และจำนวนรายการต่อหน้าคือ 7 ดัชนีของรายการแรกจะเป็น 14 - 7 = 7
    
    //จากนั้นเลือกข้อมูลที่จะต้องแสดงในหน้าปัจจุบันโดยใช้เมธอด slice
    const currentItems = userData.slice(indexOfFirstItem, indexOfLastItem); //slice เป็นเมธอดของอาร์เรย์ที่ใช้ในการเลือกส่วนหนึ่งของอาร์เรย์

    const pageNumbers = [];
    //เพื่อคำนวณจำนวนหน้าทั้งหมด โดยการหารจำนวนรายการทั้งหมด (userData.length) ด้วยจำนวนรายการต่อหน้า (itemsPerPage) แล้วปัดขึ้นให้เป็นจำนวนเต็ม
    for (let i = 1; i <= Math.ceil(userData.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="container py-5">
            <Navbar />
            <h4 className='mb-5 text-center'>Waiting for a response</h4>
            <div className="table-responsive text-center">
                <table id="mytable" className="table table-custom table-striped">
                    <thead>
                        <tr>
                            <th>
                                <input 
                                    type="checkbox" 
                                    id="checkall" 
                                    checked={allChecked} 
                                    onChange={handleCheckAll} 
                                    className="rounded"
                                />
                            </th>
                            <th>Name</th>
                            <th>Faculty</th>
                            <th>Car Registor</th>
                            <th>Car company</th>
                            <th>Car Model</th>
                            <th>Confirm</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((user, index) => (
                                <tr key={index} className="rounded">
                                    <td>
                                        <input 
                                            type="checkbox" 
                                            className="checkthis rounded" 
                                            checked={user.checked || false}
                                            onChange={() => handleCheck(indexOfFirstItem + index)}
                                        />
                                    </td>
                                    <td>{user.Name_Professor}</td>
                                    <td>{user.Faculty}</td>
                                    <td>{user.Car_Registor}</td>
                                    <td>{user.Car_company}</td>
                                    <td>{user.Car_model}</td>
                                    <td className='padding-left'>
                                        <button className="btn btn-primary btn-xs rounded" onClick={() => user.checked ? ConfirmSelectedUsers() : ConfirmUser(user)}>
                                            <i className='bx bx-plus-circle'></i> <span className="glyphicon glyphicon-pencil"></span>
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn btn-danger btn-xs rounded" onClick={() => user.checked ? deleteSelectedUsers() : deleteUser(user.id)}>
                                            <i className='bx bx-trash'></i> <span className="glyphicon glyphicon-pencil"></span>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center">No data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="clearfix mt-5">
                    <ul className="pagination justify-content-end">
                        {pageNumbers.map(number => (
                            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                                {/* //เมื่อผู้ใช้คลิกที่หมายเลขหน้า a tag ฟังก์ชัน handlePageChange จะถูกเรียกใช้พร้อมกับหมายเลขหน้าที่ถูกคลิก number */}
                                <a onClick={() => handlePageChange(number)} className="page-link cursor-pointer">
                                    {number}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default DataTable;