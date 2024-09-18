import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSession } from "next-auth/react";
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DATA_COUNT = 7;
const NUMBER_CFG = { count: DATA_COUNT, min: -100, max: 100 };

const initialLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
const ToDaysLabels = ['0 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '0 PM'];
const WeeksLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const YearsLabels = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('en', { month: 'long' }));

function Dashboard() {
    const { data: session } = useSession();
    const [parkingLots, setParkingLots] = useState([]);
    const [cameraLinks, setCameraLinks] = useState([]);
    const [parkingLotData, setParkingLotData] = useState(null);
    const [selectedParkingLot, setSelectedParkingLot] = useState(null);
    const [xLabels, setXLabels] = useState(initialLabels); // Default labels

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
            const fetchCameraLinks = async () => {
                try {
                    const response = await axios.get(`http://localhost:2546/api/user/camera-links/${selectedParkingLot}`);
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
        setSelectedParkingLot(selectedID);
        try {
            const response = await axios.get(`http://localhost:2546/api/user/parkinglotdash/${selectedID}`);
            setParkingLotData(response.data);
        } catch (error) {
            console.error('Error fetching parking lot data:', error);
        }
    };

    // Chart data definition
    const data = {
        labels: xLabels,
        datasets: [
            {
                label: 'รถในระบบ',
                data: Array.from({ length: DATA_COUNT }, () => Math.floor(Math.random() * (NUMBER_CFG.max - NUMBER_CFG.min) + NUMBER_CFG.min)),
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
            {
                label: 'รถบุคคลภายนอก',
                data: Array.from({ length: DATA_COUNT }, () => Math.floor(Math.random() * (NUMBER_CFG.max - NUMBER_CFG.min) + NUMBER_CFG.min)),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ]
    };

    const handleToDaysClick = () => {
        setXLabels(ToDaysLabels); // Update x-axis to 'To Days' labels
    };

    const handleWeeksClick = () => {
        setXLabels(WeeksLabels); // Update x-axis to 'Weeks' labels
    };

    const handleMonthsClick = () => {
        setXLabels(initialLabels); // Update x-axis to 'Months' labels
    };

    const handleYearsClick = () => {
        setXLabels(YearsLabels); // Update x-axis to 'Years' labels
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
                        <img src={`http://192.168.91.78:5000/video_feed?url=${encodeURIComponent(cameraLinks[0].rtsp)}`} autoPlay controls style={{ width: '100%' }} />
                    )}
                </div>

                <div className="col-lg-6 col-md-12 mt-4">
                    <p>Camera 2 📷</p>
                    {cameraLinks[1] && (
                        <img src={`http://192.168.91.78:5000/video_feed?url=${encodeURIComponent(cameraLinks[1].rtsp)}`} autoPlay controls style={{ width: '100%' }} />
                    )}
                </div>
            </section>

            <div className='mt-5'>
                <h2>Grap</h2>
                <Line data={data} />
                <div className='d-flex justify-center mt-5'>
                    <button className='btn btn-success' onClick={handleToDaysClick}>To Days</button>
                    <button className='btn btn-primary' onClick={handleWeeksClick}>Weeks</button>
                    <button className="btn btn-warning" onClick={handleMonthsClick}>Months</button>
                    <button className="btn btn-dark" onClick={handleYearsClick}>Years</button>
                </div>
            </div>

        </div>
    );
}

export default Dashboard;
