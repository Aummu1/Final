"use client";

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function Infor_Camera() {
    const [cameraData, setCameraData] = useState([]);
    const [allChecked, setAllChecked] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [editIndex, setEditIndex] = useState(null);
    const [editRTSP, setEditRTSP] = useState('');
    const [editCameraFunctions, setEditCameraFunctions] = useState('');
    const itemsPerPage = 7;

    useEffect(() => {
        fetchCameraData();
    }, []);

    const fetchCameraData = () => {
        axios.get('https://apib17.bd2-cloud.net/api/camera/getdatacamera')
            .then(response => {
                setCameraData(response.data);
            })
            .catch(error => {
                console.error("Error fetching camera data:", error);
            });
    }

    const handleCheckAll = (event) => {
        const isChecked = event.target.checked;
        setAllChecked(isChecked);
        setCameraData(cameraData.map(data => ({ ...data, checked: isChecked })));
    };

    const handleCameraCheck = (index) => {
        const updatedData = [...cameraData];
        updatedData[index].checked = !updatedData[index].checked;
        setCameraData(updatedData);

        const allChecked = updatedData.every(data => data.checked);
        setAllChecked(allChecked);
    };

    const deleteSelectedCamera = async () => {
        const selectedData = cameraData.filter(data => data.checked);
        const selectedIds = selectedData.map(data => data.ID_Camera);

        if (selectedIds.length === 0) {
            alert("Please select at least one camera to delete.");
            return;
        }

        try {
            await Promise.all(selectedIds.map(id => axios.delete(`https://apib17.bd2-cloud.net/api/camera/delete/${id}`)));
            setCameraData(cameraData.filter(data => !data.checked));
            setAllChecked(false); // Uncheck the 'select all' checkbox
            alert("Deleted Selected Cameras Successfully.");
        } catch (error) {
            console.error("Error deleting cameras:", error.message);
        }
    };

    const deleteCamera = async (id) => {
        try {
            await axios.delete(`https://apib17.bd2-cloud.net/api/camera/delete/${id}`);
            setCameraData(cameraData.filter(data => data.ID_Camera !== id));
            alert("Deleted Camera Successfully.");
        } catch (error) {
            console.error("Error deleting camera:", error.message);
        }
    };

    const saveEdit = async () => {
        const updatedData = [...cameraData];
        updatedData[editIndex] = {
            ...updatedData[editIndex],
            rtsp: editRTSP,  // เปลี่ยนเป็น rtsp
            Camera_Functions: editCameraFunctions
        };
        setCameraData(updatedData);

        try {
            await axios.put(`https://apib17.bd2-cloud.net/api/camera/update/${cameraData[editIndex].ID_Camera}`, {
                rtsp: editRTSP,  // ใช้ชื่อ field ตรงตามฐานข้อมูล
                Camera_Functions: editCameraFunctions
            });
            alert("Updated Camera RTSP and Camera Functions Successfully.");
            setEditIndex(null);
            setEditRTSP('');
            setEditCameraFunctions('');
            fetchCameraData();
        } catch (error) {
            console.error("Error updating camera data:", error.message);
        }
    };

    const startEdit = (index) => {
        setEditIndex(index);
        setEditRTSP(cameraData[index].RTSP);
        setEditCameraFunctions(cameraData[index].Camera_Functions);
    };


    const handleDelete = (id) => {
        const selectedData = cameraData.filter(data => data.checked);
    
        if (selectedData.length > 0) {
            deleteSelectedCamera(); // ลบกล้องที่ถูกเลือก
        } else {
            if (id) {
                deleteCamera(id); // ลบกล้องที่ไม่ใช้ checkbox
            } else {
                alert("กรุณาเลือกกล้องเพื่อลบ"); // แจ้งเตือนถ้าไม่เลือกอะไรเลย
            }
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCameraItems = cameraData.slice(indexOfFirstItem, indexOfLastItem);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(cameraData.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="container">
            <h4 className='mb-5 text-center'>Camera</h4>
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
                            <th>ID_Camera</th>
                            <th>RTSP</th>
                            <th>Camera_Functions</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCameraItems.length > 0 ? (
                            currentCameraItems.map((data, index) => (
                                <tr key={index} className="rounded">
                                    <td>
                                        <input
                                            type="checkbox"
                                            className="checkthis rounded"
                                            checked={data.checked || false}
                                            onChange={() => handleCameraCheck(indexOfFirstItem + index)}
                                        />
                                    </td>
                                    <td>{data.ParkingLot_ID}</td>
                                    <td>{data.ID_Camera}</td>
                                    <td>
                                        {editIndex === index ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={editRTSP}
                                                    onChange={(e) => setEditRTSP(e.target.value)}
                                                    className="form-control"
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <div>{data.RTSP}</div>
                                            </>
                                        )}
                                    </td>
                                    <td>
                                        {editIndex === index ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={editCameraFunctions}
                                                    onChange={(e) => setEditCameraFunctions(e.target.value)}
                                                    className="form-control"
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <div>{data.Camera_Functions}</div>
                                            </>
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
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(data.ID_Camera)} // ส่ง ID_Camera ของกล้องที่ต้องการลบ
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No data available</td>
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

export default Infor_Camera;
