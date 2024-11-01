"use client";

import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Chart1() {
    const [xLabels, setXLabels] = useState([]);
    const [allCarsData, setAllCarsData] = useState([]);
    const [externalCarsData, setExternalCarsData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); //สถานะของวันที่ที่เลือก โดยตั้งค่าเป็นวันที่ปัจจุบัน


    useEffect(() => {
        axios.get(`https://apib17.bd2-cloud.net/api/chart/timerecord?date=${selectedDate}`) //ใช้ Axios ส่ง GET request ไปยัง API โดยส่งวันที่ที่เลือกเป็นพารามิเตอร์
            .then(response => { //ใน then, รับข้อมูลที่ส่งกลับจาก API และเริ่มสร้าง object สำหรับเก็บข้อมูลจำนวนรถ
                const data = response.data;
                const allCars = {};
                const externalCars = {};
                const labels = [];

                data.forEach(entry => {
                    const time = new Date(entry.TimeIn); //แปลง TimeIn เป็นเวลาในรูปแบบ HH:MM
                    const minute = `${time.getHours()}:${String(time.getMinutes()).padStart(2, '0')}`; //ตรวจสอบและเก็บจำนวนรถในแต่ละนาที

                    if (!labels.includes(minute)) {
                        labels.push(minute);
                    }

                    if (!allCars[minute]) {
                        allCars[minute] = 0;
                        externalCars[minute] = 0;
                    }

                    if (entry.Status === 1 || entry.Status === 0) {
                        allCars[minute] += 1;
                    }
                    if (entry.Status === 0) {
                        externalCars[minute] += 1;
                    }
                });

                //การจัดเรียงข้อมูล
                const sortedLabels = labels.sort((a, b) => { //สร้างตัวแปร sortedLabels โดยจัดเรียงตามเวลา
                    const [aHours, aMinutes] = a.split(':').map(Number);
                    const [bHours, bMinutes] = b.split(':').map(Number);
                    return aHours - bHours || aMinutes - bMinutes;
                });

                //สร้าง sortedAllCarsData และ sortedExternalCarsData เพื่อให้จำนวนรถในแต่ละนาทีตรงกับ labels
                const sortedAllCarsData = sortedLabels.map(label => allCars[label] || 0);
                const sortedExternalCarsData = sortedLabels.map(label => externalCars[label] || 0);

                //อัปเดตสถานะของ xLabels, allCarsData, และ externalCarsData
                setXLabels(sortedLabels);
                setAllCarsData(sortedAllCarsData);
                setExternalCarsData(sortedExternalCarsData);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }, [selectedDate]);

    //การสร้างข้อมูลกราฟ
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

    //ตัวเลือกของกราฟ
    const options = {
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div className="z-2">
            <div className='d-flex align-items-center mt-4 mb-4'>
                <p className="fs-1 font-bold">ดูประวัติการจอดรถรายวัน</p>
                <input
                    className="ml-5 mb-3 w-25 form-control rounded"
                    type="date"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                />
            </div>
            <div className="chart-container" style={{ height: '500px' }}>
                <Line data={data} options={options} />
            </div>
        </div>
    );
}

export default Chart1;
