import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Line } from 'react-chartjs-2';
import axios from 'axios';  
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Chart1() {
    const [xLabels, setXLabels] = useState([]); // ช่วงเวลาเป็นนาที
    const [allCarsData, setAllCarsData] = useState([]);  // รถทั้งหมดที่เข้า
    const [externalCarsData, setExternalCarsData] = useState([]);  // รถบุคคลภายนอกที่เข้า
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);  // วันที่ที่เลือก

    // ฟังก์ชันดึงข้อมูลจาก Backend เมื่อเปลี่ยนวันที่
    useEffect(() => {
        axios.get(`http://localhost:2546/api/chart/timerecord?date=${selectedDate}`)
            .then(response => {
                const data = response.data;
                const allCars = {};
                const externalCars = {};
                const labels = [];

                // จัดกลุ่มข้อมูลตามนาที
                data.forEach(entry => {
                    const time = new Date(entry.TimeIn);
                    const minute = `${time.getHours()}:${String(time.getMinutes()).padStart(2, '0')}`;

                    if (!labels.includes(minute)) {
                        labels.push(minute);
                    }

                    if (!allCars[minute]) {
                        allCars[minute] = 0;
                        externalCars[minute] = 0;
                    }

                    if (entry.Status === 1 || entry.Status === 0) {
                        allCars[minute] += 1; // รถทั้งหมดที่เข้า
                    }
                    if (entry.Status === 0) {
                        externalCars[minute] += 1; // รถบุคคลภายนอกที่เข้า
                    }
                });

                // จัดเรียง labels ตามลำดับเวลา
                const sortedLabels = labels.sort((a, b) => {
                    const [aHours, aMinutes] = a.split(':').map(Number);
                    const [bHours, bMinutes] = b.split(':').map(Number);
                    return aHours - bHours || aMinutes - bMinutes;
                });

                // สร้างข้อมูลตามลำดับเวลา
                const sortedAllCarsData = sortedLabels.map(label => allCars[label] || 0);
                const sortedExternalCarsData = sortedLabels.map(label => externalCars[label] || 0);

                setXLabels(sortedLabels);
                setAllCarsData(sortedAllCarsData);
                setExternalCarsData(sortedExternalCarsData);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }, [selectedDate]);

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
                {/* ปุ่มเลือกวันที่ */}
                <input
                    className="ml-5 mb-3 form-control custom-date-input rounded w-25 h-25"  
                    type="date"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                />
            </div>
            <Line data={data} />
        </div>
    );
}

export default Chart1;
