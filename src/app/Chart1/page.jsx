import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Line } from 'react-chartjs-2';
import axios from 'axios';  // เพิ่ม Axios
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Chart1() {
    const [xLabels, setXLabels] = useState(Array.from({ length: 24 }, (_, i) => `${i}:00`)); // 24 ชม.
    const [allCarsData, setAllCarsData] = useState([]);  // รถทั้งหมดที่เข้า
    const [externalCarsData, setExternalCarsData] = useState([]);  // รถบุคคลภายนอกที่เข้า
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);  // วันที่ที่เลือก

    // ฟังก์ชันดึงข้อมูลจาก Backend เมื่อเปลี่ยนวันที่
    useEffect(() => {
        axios.get(`http://localhost:2546/api/chart/timerecord?date=${selectedDate}`)
            .then(response => {
                const data = response.data;
                const allCars = Array(24).fill(0); // ค่าเริ่มต้นของกราฟ
                const externalCars = Array(24).fill(0);

                // ประมวลผลข้อมูลเพื่อจัดกลุ่มตามชั่วโมง
                data.forEach(entry => {
                    const hour = new Date(entry.TimeIn).getHours();
                    if (entry.Status === 1 || entry.Status === 0) {
                        allCars[hour] += 1; // รถทั้งหมดที่เข้า
                    }
                    if (entry.Status === 0) {
                        externalCars[hour] += 1; // รถบุคคลภายนอกที่เข้า
                    }
                });

                setAllCarsData(allCars);
                setExternalCarsData(externalCars);
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
