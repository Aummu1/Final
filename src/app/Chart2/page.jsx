import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Line } from 'react-chartjs-2';
import axios from 'axios';  
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Chart2() {
    const [xLabels, setXLabels] = useState([]); // ปรับเป็นวันที่
    const [allCarsData, setAllCarsData] = useState([]);  // รถทั้งหมดที่เข้า
    const [externalCarsData, setExternalCarsData] = useState([]);  // รถบุคคลภายนอกที่เข้า
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);  // วันที่เริ่มต้น
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);  // วันที่สิ้นสุด

    // ฟังก์ชันดึงข้อมูลจาก Backend เมื่อเปลี่ยนวันที่
    useEffect(() => {
        if (startDate && endDate) {
            axios.get(`http://localhost:2546/api/chart/timerecord-2?start=${startDate}&end=${endDate}`)
                .then(response => {
                    const data = response.data;
                    const dates = [];
                    const allCars = [];
                    const externalCars = [];
    
                    // จัดกลุ่มข้อมูลตามวันที่
                    let currentDate = new Date(startDate);
                    let lastDate = new Date(endDate);
    
                    while (currentDate <= lastDate) {
                        const dateStr = currentDate.toISOString().split('T')[0];
                        dates.push(dateStr);
                        
                        // ใช้ Date object ในการกรอง
                        const filteredData = data.filter(entry => {
                            const entryDate = new Date(entry.TimeIn); 
                            // เปรียบเทียบปี เดือน และ วัน
                            return entryDate.getFullYear() === currentDate.getFullYear() &&
                                   entryDate.getMonth() === currentDate.getMonth() &&
                                   entryDate.getDate() === currentDate.getDate();
                        });
    
                        const totalCars = filteredData.reduce((acc, entry) => {
                            if (entry.Status === 1 || entry.Status === 0) return acc + 1;
                            return acc;
                        }, 0);
    
                        const externalCarsCount = filteredData.reduce((acc, entry) => {
                            if (entry.Status === 0) return acc + 1;
                            return acc;
                        }, 0);
    
                        allCars.push(totalCars);
                        externalCars.push(externalCarsCount);
    
                        currentDate.setDate(currentDate.getDate() + 1); // เลื่อนวันไปข้างหน้า
                    }
    
                    setXLabels(dates);
                    setAllCarsData(allCars);
                    setExternalCarsData(externalCars);
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                });
        }
    }, [startDate, endDate]);    

    // ข้อมูลกราฟ
    const data = {
        labels: xLabels,
        datasets: [
            {
                label: 'รถทั้งหมดที่เข้า',
                data: allCarsData,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
            {
                label: 'รถบุคคลภายนอกที่เข้า',
                data: externalCarsData,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ]
    };

    return (
        <div className="z-2">
            <div className='d-flex align-items-center mt-4 mb-4'>
                <p className="fs-1 font-bold">Chart</p>
                {/* ปุ่มเลือกวันที่เริ่มต้น */}
                <input
                    className="ml-5 mb-3 form-control custom-date-input rounded w-25 h-25"
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                />
                {/* ปุ่มเลือกวันที่สิ้นสุด */}
                <input
                    className="ml-5 mb-3 form-control custom-date-input rounded w-25 h-25"
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                />
            </div>
            <Line data={data} />
        </div>
    );
}

export default Chart2;
