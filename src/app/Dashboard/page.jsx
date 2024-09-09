// Dashboard.jsx
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSession } from "next-auth/react";
import axios from 'axios';
import { BarChart } from '@mui/x-charts/BarChart';
import 'boxicons/css/boxicons.min.css'; // เพิ่มการนำเข้า Boxicons ที่นี่

function Dashboard() {
    const { data: session } = useSession();
    const [parkingLots, setParkingLots] = useState([]);
    const [cameraLinks, setCameraLinks] = useState([]);
    const [parkingLotData, setParkingLotData] = useState(null); // เพิ่มสถานะสำหรับข้อมูล parking lot
    const [selectedParkingLot, setSelectedParkingLot] = useState(null);

    // Fetch parking lot data
    useEffect(() => {
        const fetchParkingLots = async () => {
            try {
                const response = await axios.get('http://localhost:2546/api/user/option');
                setParkingLots(response.data);
            } catch (error) {
                console.error('Error fetching parking lots:', error);
            }
        };

        fetchParkingLots();
    }, []);

    // Fetch camera links when a parking lot is selected
    useEffect(() => {
        if (selectedParkingLot) {
            console.log('Fetching camera links for:', selectedParkingLot); 
            const fetchCameraLinks = async () => {
                try {
                    const response = await axios.get(`http://localhost:2546/api/user/camera-links/${selectedParkingLot}`);
                    console.log("Camera links:", response.data); // ตรวจสอบข้อมูลที่ได้รับ
                    setCameraLinks(response.data);
                } catch (error) {
                    console.error('Error fetching camera links:', error);
                }
            };

            fetchCameraLinks();
        }
    }, [selectedParkingLot]);

    // Handle parking lot change
    const handleParkingLotChange = async (event) => {
        const selectedID = event.target.value;
        setSelectedParkingLot(selectedID); // อัปเดต selectedParkingLot
        console.log("Selected parking lot ID:", selectedID);

        try {
            const response = await axios.get(`http://localhost:2546/api/user/parkinglotdash/${selectedID}`);
            setParkingLotData(response.data);
        } catch (error) {
            console.error('Error fetching parking lot data:', error);
        }
    };

    return (
        <div className="pr-10 pl-10 z-2">
            {/* ส่วน Header */}
            <div className="col-12 d-flex mt-10 mb-10 align-items-center justify-content-around">
                <div>
                    <select onChange={handleParkingLotChange} className="form-select" aria-label="Default select example" defaultValue="">
                        <option value="">Choose ParkingLot</option>
                        {parkingLots.map((lot, index) => (
                            <option key={index} value={lot.ParkingLot_ID}>{lot.ParkingLot_Name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    {session
                        ? <img className='w-11 ml-2.5 d-flex items-center justify-center rounded-circle' src={session?.user?.image} alt="User" />
                        : <i className='bx bxs-user-circle fs-1' style={{ cursor: 'pointer' }} onClick={() => { window.location.href = 'LoginPage' }}></i>}
                </div>
            </div>

            {/* Dashboard Content */}
            <p className="pb-3 fs-1 font-bold">Welcome</p>
            <section className="row justify-around">
                <div className="card display-flex col-lg-2 col-md-12 mb-3 p-0">
                    <div className="row g-0 display-flex align-items-center justify-center">
                        <div className="col-3">
                            <img src="/image/car-yellow.png" className="card-img-top ml-6" alt="" />
                        </div>
                        <div className="col-9 display-flex flex-direction-column">
                            <div className="card-body ">
                                <p className="card-text text-center mb-0">ช่องทั้งหมด</p>
                                <p id="test" className="card-text text-center font-bold fs-3">{parkingLotData ? parkingLotData.AllSpace : 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card display-flex col-lg-2 col-md-12 mb-3 p-0">
                    <div className="row g-0 display-flex align-items-center justify-center">
                        <div className="col-3">
                            <img src="/image/car-green.png" className="card-img-top ml-6" alt="" />
                        </div>
                        <div className="col-9 display-flex flex-direction-column">
                            <div className="card-body ">
                                <p className="card-text text-center mb-0">ว่าง</p>
                                <p className="card-text text-center font-bold fs-3">{parkingLotData ? parkingLotData.FreeSpace : 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card display-flex col-lg-2 col-md-12 mb-3 p-0">
                    <div className="row g-0 display-flex align-items-center justify-center">
                        <div className="col-3">
                            <img src="/image/car-red.png" className="card-img-top ml-6" alt="" />
                        </div>
                        <div className="col-9 display-flex flex-direction-column">
                            <div className="card-body ">
                                <p className="card-text text-center mb-0">ไม่ว่าง</p>
                                <p className="card-text text-center font-bold fs-3">{parkingLotData ? parkingLotData.UnFreeSpace : 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card display-flex col-lg-2 col-md-12 mb-3 p-0">
                    <div className="row g-0 display-flex align-items-center justify-center">
                        <div className="col-3">
                            <img src="/image/car-black.png" className="card-img-top ml-6" alt="" />
                        </div>
                        <div className="col-9 display-flex flex-direction-column">
                            <div className="card-body ">
                                <p className="card-text text-center mb-0">รถบุลคลภายนอก</p>
                                <p className="card-text text-center font-bold fs-3">{parkingLotData ? parkingLotData.UnknowCar : 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card display-flex col-lg-2 col-md-12 mb-3 p-0">
                    <div className="row g-0 display-flex align-items-center justify-center">
                        <div className="col-3">
                            <img src="/image/who.png" className="card-img-top ml-6" alt="" />
                        </div>
                        <div className="col-9 display-flex flex-direction-column">
                            <div className="card-body ">
                                <p className="card-text text-center mb-0">สิ่งแปลกปลอม</p>
                                <p className="card-text text-center font-bold fs-3">{parkingLotData ? parkingLotData.UnknowObj : 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="row justify-around mb-10">
                <div className="col-lg-6 col-md-12 mt-4">
                    <p>Camera 1 📷</p>
                    {cameraLinks[0] && (
                        <img src={`http://172.23.226.91:5000/video_feed?url=${encodeURIComponent(cameraLinks[0].rtsp)}`} autoPlay controls style={{ width: '100%' }} />
                    )}
                </div>

                <div className="col-lg-6 col-md-12 mt-4">
                    <p>Camera 2 📷</p>
                    {cameraLinks[1] && (
                        <img src={`http://172.23.226.91:5000/video_feed?url=${encodeURIComponent(cameraLinks[1].rtsp)}`} autoPlay controls style={{ width: '100%' }} />
                    )}
                </div>
            </section>


            <section className=''>
                <p>Data Charts📊</p>
                <BarChart
                    series={[
                        { name: 'Series 1', data: [12, 30, 1, 8, 22, 17] },
                        { name: 'Series 2', data: [23, 6, 14, 24, 11, 19] }
                    ]}
                />
            </section>
        </div>
    );
}

export default Dashboard;
