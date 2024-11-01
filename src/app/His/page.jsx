"use client";

import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Navbar from "../components/Navbar";

function His() {
    const [folderData, setFolderData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://camera.bd2-cloud.net/get_name_file1');
                console.log(response.data); // แสดงข้อมูลที่ได้รับจาก API
                setFolderData(response.data.files);
                console.log(response.data.files); // แสดงข้อมูลไฟล์ที่ดึงมา
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
        console.log(folder);
        return (
            <div>
            <ul>
                {Object.keys(folder).map((date) => (
                    <li key={date}>
                        <strong>{date}</strong>
                        <ul className='d-flex flex-wrap'>
                            {Object.entries(folder[date]).map(([fileName, filePath]) => (
                                <div key={fileName}>
                                    <img
                                        src={`https://camera.bd2-cloud.net${filePath}`} // URL สำหรับภาพ
                                        alt={fileName}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://camera.bd2-cloud.net/path/to/default/image.jpg"; // แสดงภาพเริ่มต้นเมื่อไม่พบภาพ
                                        }}
                                        style={{ width: '500px', height: 'auto', margin: '5px' }}
                                    />
                                    <span>{fileName}</span>
                                </div>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
        );
    };

    return (
        <div className="container py-5">
            <Navbar />
            <h1>รูปภาพจากกล้องตัวที่ 2</h1>
            {loading && <p>กำลังโหลดข้อมูล...</p>}
            {error && <p className="text-danger">{error}</p>}
            {folderData && !loading ? renderFolder(folderData) : null}
        </div>
    );
}

export default His;
