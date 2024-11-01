"use client"

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function Infor_Space() {
    const [spaceData, setSpaceData] = useState([]);
    const [allChecked, setAllChecked] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [editIndex, setEditIndex] = useState(null);
    const [editPointsData, setEditPointsData] = useState('');
    const itemsPerPage = 7;

    useEffect(() => {
        fetchSpaceData();
    }, []);

    const fetchSpaceData = () => {
        axios.get('https://apib17.bd2-cloud.net/api/parkingspace/getdataparkingspace')
            .then(response => {
                const dataWithChecked = response.data.map(item => ({
                    ...item,
                    checked: false,
                }));
                setSpaceData(dataWithChecked);
            })
            .catch(error => {
                console.error("Error fetching parking space data:", error);
            });
    };

    const handleCheckAll = (event) => {
        const isChecked = event.target.checked;
        setAllChecked(isChecked);
        setSpaceData(spaceData.map(item => ({ ...item, checked: isChecked })));
    };

    const handleCheck = (index) => {
        const updatedData = [...spaceData];
        updatedData[index].checked = !updatedData[index].checked;
        setSpaceData(updatedData);

        const allChecked = updatedData.every(item => item.checked);
        setAllChecked(allChecked);
    };

    const handleDelete = () => {
        const selectedData = spaceData.filter(item => item.checked);

        if (selectedData.length > 0) {
            console.log("Selected Parking Space IDs for deletion:", selectedData.map(item => item.ParkingSpace_ID));
            deleteSelectedSpaces(selectedData);
        } else {
            alert("กรุณาเลือกที่จอดรถเพื่อลบ");
        }
    };

    const deleteSelectedSpaces = async (selectedSpaces) => {
        const selectedIds = selectedSpaces.map(item => item.ParkingSpace_ID).filter(id => id); // กรอง ID ที่เป็น undefined

        if (selectedIds.length === 0) {
            alert("กรุณาเลือกที่จอดรถอย่างน้อยหนึ่งรายการเพื่อลบ");
            return;
        }

        try {
            await Promise.all(selectedIds.map(id => {
                console.log(`Attempting to delete parking space with ID: ${id}`);
                return axios.delete(`https://apib17.bd2-cloud.net/api/parkingspace/delete/${id}`);
            }));
            setSpaceData(spaceData.filter(item => !item.checked)); // กรองออกเฉพาะตัวที่ไม่ถูกเลือก
            setAllChecked(false);
            alert("ลบที่จอดรถที่เลือกสำเร็จ");
        } catch (error) {
            console.error("Error deleting parking spaces:", error.message);
        }
    };

    const startEdit = (index) => {
        setEditIndex(index);
        setEditPointsData(spaceData[index].points_data);
    };

    const saveEdit = async () => {
        const updatedData = [...spaceData];
        updatedData[editIndex] = {
            ...updatedData[editIndex],
            points_data: editPointsData,
        };
        setSpaceData(updatedData);

        try {
            await axios.put(`https://apib17.bd2-cloud.net/api/parkingspace/update/${spaceData[editIndex].ParkingLot_ID}`, {
                points_data: editPointsData,
            });
            alert("Update Successfully");
            setEditIndex(null);
        } catch (error) {
            console.error("Error updating parking space:", error.message);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSpaceItems = spaceData.slice(indexOfFirstItem, indexOfLastItem);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(spaceData.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="container">
            <h4 className='mb-5 text-center'>Parking Space</h4>
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
                            <th>ParkingLot ID</th>
                            <th>ParkingSpace ID</th> {/* เพิ่มที่นี่ */}
                            <th>Points Data</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentSpaceItems.length > 0 ? (
                            currentSpaceItems.map((data, index) => (
                                <tr key={data.ParkingLot_ID}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={data.checked || false}
                                            onChange={() => handleCheck(indexOfFirstItem + index)}
                                            className="rounded"
                                        />
                                    </td>
                                    <td>{data.ParkingLot_ID}</td>
                                    <td>{data.ParkingSpace_ID}</td> {/* แสดง ParkingSpace_ID */}
                                    <td>
                                        {editIndex === index ? (
                                            <input
                                                type="text"
                                                value={editPointsData}
                                                onChange={(e) => setEditPointsData(e.target.value)}
                                                className="form-control"
                                            />
                                        ) : (
                                            typeof data.points_data === 'string' ? JSON.stringify(JSON.parse(data.points_data)) : data.points_data
                                        )}
                                    </td>
                                    <td>
                                        {editIndex === index ? (
                                            <button className="btn btn-success btn-sm" onClick={saveEdit}>
                                                Save
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    className="btn btn-success btn-sm"
                                                >
                                                    <a className='text-decoration-none text-light' href="AddSpace">
                                                        <span className="text nav-text">Add</span>
                                                    </a>
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={handleDelete}
                                                >
                                                    Delete Selected
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">ไม่มีข้อมูล</td> {/* อัปเดตให้ตรงกับจำนวนคอลัมน์ */}
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="clearfix mt-5">
                    <ul className="pagination justify-content-end">
                        {pageNumbers.map(number => (
                            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                                <button onClick={() => setCurrentPage(number)} className="page-link">
                                    {number}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Infor_Space;
