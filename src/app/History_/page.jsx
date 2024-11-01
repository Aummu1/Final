"use client";

import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Navbar from "../components/Navbar";
import His from '../His/page';

function History_() {
    const [folderData, setFolderData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://camera.bd2-cloud.net/get_name_file');
                console.log(response.data); // แสดงข้อมูลที่ได้รับจาก API
                setFolderData(response.data.files);
            } catch (error) {
                setError('เกิดข้อผิดพลาดในการดึงข้อมูล: ' + error.message);
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const renderFolder = (folder) => {
        return (
            <div>
                <ul>
                    {Object.keys(folder).map((date) => (
                        <li key={date}>
                            <strong>{date}</strong>
                            <ul className='d-flex flex-wrap'>
                                {Object.entries(folder[date]).map(([key, fileObj]) => (
                                    <li key={key} className='pl-5'>
                                        {Object.entries(fileObj).map(([fileName, filePath]) => (
                                            <div key={fileName}>
                                                <img
                                                    src={`https://camera.bd2-cloud.net${filePath}`} // URL สำหรับภาพ
                                                    alt={fileName}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "https://camera.bd2-cloud.net/path/to/default/image.jpg";
                                                    }}
                                                    style={{ width: '500px', height: 'auto', margin: '5px' }}
                                                />
                                                <span>{fileName}</span>
                                            </div>
                                        ))}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>

                <His />
            </div>
        );
    };

    return (
        <div className="container py-5">
            <Navbar />
            <h1>รูปภาพจากกล้องตัวที่ 1</h1>
            {loading && <p>กำลังโหลดข้อมูล...</p>}
            {error && <p className="text-danger">{error}</p>}
            {folderData && !loading ? renderFolder(folderData) : null}
        </div>
    );
}

export default History_;
