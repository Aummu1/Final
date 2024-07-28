"use client";
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Navbar from "../components/Navbar";

function DataTable() {
    const [userData, setUserData] = useState([]);
    const [nameReg, setNameReg] = useState('');
    const [facultyReg, setFacultyReg] = useState('');
    const [modelReg, setModelReg] = useState('');
    const [registrationReg, setRegistrationReg] = useState('');
    const [allChecked, setAllChecked] = useState(false);

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
        axios.delete(`http://localhost:2546/api/user/delete/${id}`)
            .then(() => {
                setUserData(userData.filter(user => user.id !== id));
            })
            .catch(error => {
                console.error("Error deleting data:", error);
            });
    };

    const ConfirmUser = async (user) => {
        try {
            const response = await axios.post(
                "http://localhost:2546/api/user/postconfirmdata", 
                { 
                    name: nameReg, 
                    faculty: facultyReg, 
                    model: modelReg, 
                    registration: registrationReg 
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            alert("Confirm Registered Successfully.");
            console.log("Assessment result:", response.data);
            deleteUser(user.id);
            return response.data;
        } catch (error) {
            console.error("Error fetching assessment result:", error.message);
            return null;
        }
    };

    const handleCheckAll = (event) => {
        const isChecked = event.target.checked;
        setAllChecked(isChecked);
        setUserData(userData.map(user => ({ ...user, checked: isChecked })));
    };

    const handleCheck = (index) => {
        const updatedData = [...userData];
        updatedData[index].checked = !updatedData[index].checked;
        setUserData(updatedData);

        const allChecked = updatedData.every(user => user.checked);
        setAllChecked(allChecked);
    };

    return (
        <div className="container py-5">
            <Navbar />
            <h4 className='mb-5'>Bootstrap Snippet for DataTable</h4>
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
                            {/* <th>Department</th> */}
                            <th>Faculty</th>
                            <th>Car Registor</th>
                            <th>Car Model</th>
                            <th>Confirm</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userData.length > 0 ? (
                            userData.map((user, index) => (
                                <tr key={index} className="rounded">
                                    <td>
                                        <input 
                                            type="checkbox" 
                                            className="checkthis rounded" 
                                            checked={user.checked || false}
                                            onChange={() => handleCheck(index)}
                                        />
                                    </td>
                                    <td>{user.Name_Professor}</td>
                                    {/* <td>{user.Department}</td> */}
                                    <td>{user.Faculty}</td>
                                    <td>{user.Car_Registor}</td>
                                    <td>{user.Car_model}</td>
                                    <td className='padding-left'>
                                        <button className="btn btn-primary btn-xs rounded" data-title="Edit" data-toggle="modal" data-target="#edit" onClick={() => ConfirmUser(user.id)}>
                                            <i className='bx bx-plus-circle'></i> <span className="glyphicon glyphicon-pencil"></span>
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn btn-danger btn-xs rounded" data-title="Delete" data-toggle="modal" data-target="#delete" onClick={() => deleteUser(user.id)}>
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
                        <li className="page-item">
                            <a className="page-link" href="#" tabIndex="-1" aria-disabled="true">
                                <span className="bi bi-chevron-left">Previous</span>
                            </a>
                        </li>
                        <li className="page-item active" aria-current="page">
                            <a className="page-link" href="#">1</a>
                        </li>
                        <li className="page-item">
                            <a className="page-link" href="#">2</a>
                        </li>
                        <li className="page-item">
                            <a className="page-link" href="#">3</a>
                        </li>
                        <li className="page-item">
                            <a className="page-link" href="#">4</a>
                        </li>
                        <li className="page-item">
                            <a className="page-link" href="#">5</a>
                        </li>
                        <li className="page-item">
                            <a className="page-link" href="#">
                                <span className="bi bi-chevron-right">Next</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default DataTable;
