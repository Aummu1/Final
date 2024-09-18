import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function Infor_Car() {
    const [carData, setCarData] = useState([]);
    const [allChecked, setAllChecked] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [editIndex, setEditIndex] = useState(null);
    const [editRegistration, setEditRegistration] = useState('');
    const [editOwner, setEditOwner] = useState('');
    const [editCompany, setEditCompany] = useState('');
    const [editModel, setEditModel] = useState('');
    const itemsPerPage = 7;

    useEffect(() => {
        fetchCarData();
    }, []);

    const fetchCarData = () => {
        axios.get('http://localhost:2546/api/car/getdatacar')
            .then(response => {
                setCarData(response.data);
            })
            .catch(error => {
                console.error("Error fetching car data:", error);
            });
    };

    const handleCheckAll = (event) => {
        const isChecked = event.target.checked;
        setAllChecked(isChecked);
        setCarData(carData.map(data => ({ ...data, checked: isChecked })));
    };

    const handleCarCheck = (index) => {
        const updatedData = [...carData];
        updatedData[index].checked = !updatedData[index].checked;
        setCarData(updatedData);

        const allChecked = updatedData.every(data => data.checked);
        setAllChecked(allChecked);
    };

    const deleteSelectedCars = async () => {
        const selectedData = carData.filter(data => data.checked);
        const selectedRegistrations = selectedData.map(data => data.Car_registration);

        if (selectedRegistrations.length === 0) {
            alert("กรุณาเลือกรถอย่างน้อยหนึ่งรายการเพื่อลบ");
            return;
        }

        try {
            await Promise.all(selectedRegistrations.map(reg => axios.delete(`http://localhost:2546/api/car/delete/${reg}`)));
            setCarData(carData.filter(data => !data.checked));
            setAllChecked(false); // ยกเลิกเลือกทั้งหมด
            alert("Delete Car Successfully");
        } catch (error) {
            console.error("Error deleting cars:", error.message);
        }
    };

    const startEdit = (index) => {
        setEditIndex(index);
        setEditRegistration(carData[index].Car_registration);
        setEditOwner(carData[index].Car_owner);
        setEditCompany(carData[index].Car_company);
        setEditModel(carData[index].Car_model);
    };

    const saveEdit = async () => {
        const updatedData = [...carData];
        updatedData[editIndex] = {
            ...updatedData[editIndex],
            Car_registration: editRegistration,
            Car_owner: editOwner,
            Car_company: editCompany,
            Car_model: editModel
        };
        setCarData(updatedData);

        try {
            await axios.put(`http://localhost:2546/api/car/update/${carData[editIndex].Car_registration}`, {
                Car_registration: editRegistration,
                Car_owner: editOwner,
                Car_company: editCompany,
                Car_model: editModel
            });
            alert("Updated Car Information Successfully");
            setEditIndex(null);
            setEditRegistration('');
            setEditOwner('');
            setEditCompany('');
            setEditModel('');
        } catch (error) {
            console.error("Error updating car data:", error.message);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCarItems = carData.slice(indexOfFirstItem, indexOfLastItem);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(carData.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="container">
            <h4 className='mb-5 text-center'>Car Information</h4>
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
                            <th>Car Registration</th>
                            <th>Car Owner</th>
                            <th>Car Company</th>
                            <th>Car Model</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCarItems.length > 0 ? (
                            currentCarItems.map((data, index) => (
                                <tr key={index} className="rounded">
                                    <td>
                                        <input
                                            type="checkbox"
                                            className="checkthis rounded"
                                            checked={data.checked || false}
                                            onChange={() => handleCarCheck(indexOfFirstItem + index)}
                                        />
                                    </td>
                                    <td>
                                        {editIndex === indexOfFirstItem + index ? (
                                            <input
                                                type="text"
                                                value={editRegistration}
                                                onChange={(e) => setEditRegistration(e.target.value)}
                                                className="form-control"
                                            />
                                        ) : (
                                            <div>{data.Car_registration}</div>
                                        )}
                                    </td>
                                    <td>
                                        {editIndex === indexOfFirstItem + index ? (
                                            <input
                                                type="text"
                                                value={editOwner}
                                                onChange={(e) => setEditOwner(e.target.value)}
                                                className="form-control"
                                            />
                                        ) : (
                                            <div>{data.Car_owner}</div>
                                        )}
                                    </td>
                                    <td>
                                        {editIndex === indexOfFirstItem + index ? (
                                            <input
                                                type="text"
                                                value={editCompany}
                                                onChange={(e) => setEditCompany(e.target.value)}
                                                className="form-control"
                                            />
                                        ) : (
                                            <div>{data.Car_company}</div>
                                        )}
                                    </td>
                                    <td>
                                        {editIndex === indexOfFirstItem + index ? (
                                            <input
                                                type="text"
                                                value={editModel}
                                                onChange={(e) => setEditModel(e.target.value)}
                                                className="form-control"
                                            />
                                        ) : (
                                            <div>{data.Car_model}</div>
                                        )}
                                    </td>
                                    <td>
                                        {editIndex === indexOfFirstItem + index ? (
                                            <button className="btn btn-success btn-sm" onClick={saveEdit}>
                                                Save
                                            </button>
                                        ) : (
                                            <>
                                                <button className="btn btn-primary btn-sm" onClick={() => startEdit(indexOfFirstItem + index)}>
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={deleteSelectedCars}
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
                                <td colSpan="6" className="text-center">ไม่มีข้อมูล</td>
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

export default Infor_Car;
