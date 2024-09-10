"use client";
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Navbar from "../components/Navbar";
import Infor_Camera from '../Infor_Camera/page';

function Infor_ParkingLot() {
    const [parkingData, setParkingData] = useState([]);
    const [allChecked, setAllChecked] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [editIndex, setEditIndex] = useState(null);
    const [editName, setEditName] = useState('');
    const itemsPerPage = 7;

    useEffect(() => {
        fetchParkingData();
    }, []);

    const fetchParkingData = () => {
        axios.get('http://localhost:2546/api/parkinglot/getdataparkinglot')
            .then(response => {
                setParkingData(response.data);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    };

    const handleCheckAll = (event) => {
        const isChecked = event.target.checked;
        setAllChecked(isChecked);
        setParkingData(parkingData.map(data => ({ ...data, checked: isChecked })));
    };

    const handleCheck = (index) => {
        const updatedData = [...parkingData];
        updatedData[index].checked = !updatedData[index].checked;
        setParkingData(updatedData);

        const allChecked = updatedData.every(data => data.checked);
        setAllChecked(allChecked);
    };

    const handleDelete = () => {
        const selectedData = parkingData.filter(data => data.checked);

        if (selectedData.length > 0) {
            deleteSelectedParkingLots();
        } else {
            alert("Please select at least one parking lot to delete.");
        }
    };


    const deleteSelectedParkingLots = async () => {
        const selectedData = parkingData.filter(data => data.checked);
        const selectedIds = selectedData.map(data => data.ParkingLot_ID);

        if (selectedIds.length === 0) {
            alert("Please select at least one parking lot to delete.");
            return;
        }

        try {
            // ลบหลายรายการพร้อมกัน
            await Promise.all(selectedIds.map(id => axios.delete(`http://localhost:2546/api/parkinglot/delete/${id}`)));
            // อัพเดตข้อมูลหลังจากลบ
            setParkingData(parkingData.filter(data => !data.checked));
            setAllChecked(false); // ยกเลิกการเลือกทั้งหมด
            alert("Deleted Selected Parking Lots Successfully.");
        } catch (error) {
            console.error("Error deleting parking lots:", error.message);
        }
    };


    const deleteParkingLot = async (id) => {
        try {
            await axios.delete(`http://localhost:2546/api/parkinglot/delete/${id}`);
            setParkingData(parkingData.filter(data => data.ParkingLot_ID !== id));
            alert("Deleted Parking Lot Successfully.");
        } catch (error) {
            console.error("Error deleting parking lot:", error.message);
        }
    };

    const startEdit = (index) => {
        setEditIndex(index);
        setEditName(parkingData[index].ParkingLot_Name);
    };

    const handleEditChange = (event) => {
        setEditName(event.target.value);
    };

    const saveEdit = async () => {
        const updatedData = [...parkingData];
        updatedData[editIndex].ParkingLot_Name = editName;
        setParkingData(updatedData);

        try {
            await axios.put(`http://localhost:2546/api/parkinglot/update/${parkingData[editIndex].ParkingLot_ID}`, {
                ParkingLot_Name: editName
            });
            alert("Updated Parking Lot Name Successfully.");
            setEditIndex(null);
        } catch (error) {
            console.error("Error updating parking lot name:", error.message);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = parkingData.slice(indexOfFirstItem, indexOfLastItem);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(parkingData.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="container py-5">
            <Navbar />
            <h4 className='mb-5 text-center'>ParkingLot</h4>
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
                            <th>ParkingLot Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((data, index) => (
                                <tr key={index} className="rounded">
                                    <td>
                                        <input
                                            type="checkbox"
                                            className="checkthis rounded"
                                            checked={data.checked || false}
                                            onChange={() => handleCheck(indexOfFirstItem + index)}
                                        />
                                    </td>
                                    <td>{data.ParkingLot_ID}</td>
                                    <td>
                                        {editIndex === index ? (
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={handleEditChange}
                                                className="form-control"
                                            />
                                        ) : (
                                            data.ParkingLot_Name
                                        )}
                                    </td>
                                    <td>
                                        {editIndex === index ? (
                                            <button className="btn btn-success btn-sm" onClick={saveEdit}>
                                                Save
                                            </button>
                                        ) : (
                                            <>
                                                <button className="btn btn-primary btn-sm" onClick={() => startEdit(index)}>
                                                    Edit
                                                </button>
                                                <button className="btn btn-danger" onClick={handleDelete}>
                                                    Delete Selected
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">No data available</td>
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
            <Infor_Camera />
        </div>
    );
}

export default Infor_ParkingLot;
