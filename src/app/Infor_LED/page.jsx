import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function Infor_LED() {
    const [ledData, setLedData] = useState([]);
    const [allChecked, setAllChecked] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [editIndex, setEditIndex] = useState(null);
    const [editWifi, setEditWifi] = useState('');
    const [editWifiPassword, setEditWifiPassword] = useState('');
    const itemsPerPage = 7;

    useEffect(() => {
        fetchLedData();
    }, []);

    const fetchLedData = () => {
        axios.get('http://localhost:2546/api/led/getdataled')
            .then(response => {
                setLedData(response.data);
            })
            .catch(error => {
                console.error("Error fetching LED data:", error);
            });
    };

    const handleCheckAll = (event) => {
        const isChecked = event.target.checked;
        setAllChecked(isChecked);
        setLedData(ledData.map(data => ({ ...data, checked: isChecked })));
    };

    const handleLedCheck = (index) => {
        const updatedData = [...ledData];
        updatedData[index].checked = !updatedData[index].checked;
        setLedData(updatedData);

        const allChecked = updatedData.every(data => data.checked);
        setAllChecked(allChecked);
    };

    const deleteSelectedLed = async () => {
        const selectedData = ledData.filter(data => data.checked);
        const selectedIds = selectedData.map(data => data.ID_LED);

        if (selectedIds.length === 0) {
            alert("กรุณาเลือก LED อย่างน้อยหนึ่งรายการเพื่อลบ");
            return;
        }

        try {
            await Promise.all(selectedIds.map(id => axios.delete(`http://localhost:2546/api/led/delete/${id}`)));
            setLedData(ledData.filter(data => !data.checked));
            setAllChecked(false); // ยกเลิกเลือกทั้งหมด
            alert("ลบ LED ที่เลือกเรียบร้อยแล้ว");
        } catch (error) {
            console.error("Error deleting LEDs:", error.message);
        }
    };

    const deleteLed = async (id) => {
        try {
            await axios.delete(`http://localhost:2546/api/led/delete/${id}`);
            setLedData(ledData.filter(data => data.ID_LED !== id));
            alert("ลบ LED สำเร็จ");
        } catch (error) {
            console.error("Error deleting LED:", error.message);
        }
    };

    const saveEdit = async () => {
        const updatedData = [...ledData];
        updatedData[editIndex] = {
            ...updatedData[editIndex],
            Wifi: editWifi,
            Wifi_Password: editWifiPassword
        };
        setLedData(updatedData);

        try {
            await axios.put(`http://localhost:2546/api/led/update/${ledData[editIndex].ID_LED}`, {
                Wifi: editWifi,
                Wifi_Password: editWifiPassword
            });
            alert("อัปเดตข้อมูล LED สำเร็จ");
            setEditIndex(null);
            setEditWifi('');
            setEditWifiPassword('');
            fetchLedData();
        } catch (error) {
            console.error("Error updating LED data:", error.message);
        }
    };

    const startEdit = (index) => {
        setEditIndex(index);
        setEditWifi(ledData[index].Wifi);
        setEditWifiPassword(ledData[index].Wifi_Password);
    };

    const handleDelete = () => {
        const selectedData = ledData.filter(data => data.checked);

        if (selectedData.length > 0) {
            deleteSelectedLed();
        } else {
            const id = ledData.find(data => data.ParkingLot_ID === data.ParkingLot_ID)?.ID_LED;
            if (id) {
                deleteLed(id);
            }
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentLedItems = ledData.slice(indexOfFirstItem, indexOfLastItem);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(ledData.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="container">
            <h4 className='mb-5 text-center'>LED</h4>
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
                            <th>ID_LED</th>
                            <th>Wifi</th>
                            <th>Wifi_Password</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentLedItems.length > 0 ? (
                            currentLedItems.map((data, index) => (
                                <tr key={index} className="rounded">
                                    <td>
                                        <input
                                            type="checkbox"
                                            className="checkthis rounded"
                                            checked={data.checked || false}
                                            onChange={() => handleLedCheck(indexOfFirstItem + index)}
                                        />
                                    </td>
                                    <td>{data.ParkingLot_ID}</td>
                                    <td>{data.ID_LED}</td>
                                    <td>
                                        {editIndex === index ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={editWifi}
                                                    onChange={(e) => setEditWifi(e.target.value)}
                                                    className="form-control"
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <div>{data.Wifi}</div>
                                            </>
                                        )}
                                    </td>
                                    <td>
                                        {editIndex === index ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={editWifiPassword}
                                                    onChange={(e) => setEditWifiPassword(e.target.value)}
                                                    className="form-control"
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <div>{data.Wifi_Password}</div>
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
                                                    onClick={() => handleDelete()}
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

export default Infor_LED;
