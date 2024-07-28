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

    return (
        <div className="container py-5">
            <Navbar />
            <h4>Bootstrap Snippet for DataTable</h4>
            <div className="table-responsive">
                <table id="mytable" className="table table-bordred table-striped border-black">
                    <thead>
                        <tr>
                            <th><input type="checkbox" id="checkall" /></th>
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
                                <tr key={index}>
                                    <td><input type="checkbox" className="checkthis" /></td>
                                    <td>{user.Name_Professor}</td>
                                    {/* <td>{user.Department}</td> */}
                                    <td>{user.Faculty}</td>
                                    <td>{user.Car_Registor}</td>
                                    <td>{user.Car_model}</td>
                                    <td className='padding-left'>
                                        <button className="btn btn-primary btn-xs" data-title="Edit" data-toggle="modal" data-target="#edit">
                                            <i className='bx bx-trash'></i> <span className="glyphicon glyphicon-pencil"></span>
                                        </button>
                                    </td>
                                    <td>
                                        <p data-placement="top" data-toggle="tooltip" title="Delete">
                                            <button className="btn btn-danger btn-xs" data-title="Delete" data-toggle="modal" data-target="#delete" onClick={() => deleteUser(user.id)}><span className="glyphicon glyphicon-trash"></span></button>
                                        </p>
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
                <div className="clearfix"></div>
                <ul className="pagination pull-right">
                    <li className="disabled"><a href="#"><span className="glyphicon glyphicon-chevron-left"></span></a></li>
                    <li className="active"><a href="#">1</a></li>
                    <li><a href="#">2</a></li>
                    <li><a href="#">3</a></li>
                    <li><a href="#">4</a></li>
                    <li><a href="#">5</a></li>
                    <li><a href="#"><span className="glyphicon glyphicon-chevron-right"></span></a></li>
                </ul>
            </div>
        </div>
    );
}

export default DataTable;
