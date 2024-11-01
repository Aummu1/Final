"use client";

import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function Dashboard_User() {
    const [parkingLots, setParkingLots] = useState([]);
    const [cameraLinks, setCameraLinks] = useState([]);
    const [parkingLotData, setParkingLotData] = useState(null);
    const [selectedParkingLot, setSelectedParkingLot] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading1, setIsLoading1] = useState(true);
    const [isLoading2, setIsLoading2] = useState(true);
    const [isCameraLoading, setIsCameraLoading] = useState(false); // New state for camera loading

    // Fetch parking lot options
    useEffect(() => {
        const fetchParkingLots = async () => {
            try {
                const response = await axios.get('https://apib17.bd2-cloud.net/api/user/option');
                setParkingLots(response.data);
            } catch (error) {
                console.error('Error fetching parking lots:', error);
            }
        };
        fetchParkingLots();
    }, []);

    // Fetch parking lot data periodically (real-time updates)
    useEffect(() => {
        const fetchParkingLotData = async () => {
            if (selectedParkingLot) {
                try {
                    const response = await axios.get(`https://apib17.bd2-cloud.net/api/user/parkinglotdash/${selectedParkingLot}`);
                    setParkingLotData(response.data);
                } catch (error) {
                    console.error('Error fetching parking lot data:', error);
                }
            }
        };

        // Set interval to fetch data every 5 seconds (5000 ms)
        const intervalId = setInterval(fetchParkingLotData, 5000);

        // Cleanup interval when component unmounts or selectedParkingLot changes
        return () => clearInterval(intervalId);
    }, [selectedParkingLot]);

    // Fetch camera links when parking lot is selected
    useEffect(() => {
        if (selectedParkingLot) {
            const fetchCameraLinks = async () => {
                setIsCameraLoading(true); // เริ่มโหลดกล้อง
                try {
                    const response = await axios.get(`https://apib17.bd2-cloud.net/api/user/camera-links/${selectedParkingLot}`);
                    setCameraLinks(response.data);
                } catch (error) {
                    console.error('Error fetching camera links:', error);
                } finally {
                    setIsCameraLoading(false); // เสร็จสิ้นการโหลดกล้อง
                }
            };
            fetchCameraLinks();
        }
    }, [selectedParkingLot]);

    // Handle parking lot change
    const handleParkingLotChange = (event) => {
        const selectedID = event.target.value;
        setSelectedParkingLot(selectedID);
    };

    return (
        <div className="pr-10 pl-10 z-2">
            <div className="col-12 d-flex mt-10 mb-10 align-items-center justify-content-around">
                <div>
                    <select onChange={handleParkingLotChange} className="form-select" aria-label="Default select example" defaultValue="">
                        <option value="">Choose ParkingLot</option>
                        {parkingLots.map((lot, index) => (
                            <option key={index} value={lot.ParkingLot_ID}>{lot.ParkingLot_Name}</option>
                        ))}
                    </select>
                </div>
            </div>

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
                                <p className="card-text text-center font-bold fs-3">{parkingLotData ? parkingLotData.AllSpace : '-'}</p>
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
                                <p className="card-text text-center font-bold fs-3">{parkingLotData ? parkingLotData.FreeSpace : '-'}</p>
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
                                <p className="card-text text-center font-bold fs-3">{parkingLotData ? parkingLotData.UnFreeSpace : '-'}</p>
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
                                <p className="card-text text-center font-bold fs-3">{parkingLotData ? parkingLotData.UnknowCar : '-'}</p>
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
                                <p className="card-text text-center font-bold fs-3">{parkingLotData ? parkingLotData.UnknowObj : '-'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="row justify-around mb-10">
                <div className="col-lg-6 col-md-12 mt-4">
                    <p>Camera 1 📷</p>
                    {!selectedParkingLot ? (
                        <img src="https://static.vecteezy.com/system/resources/previews/021/593/616/non_2x/city-street-parking-area-landscape-illustration-vector.jpg" alt="Default" style={{ width: '100%' }} />
                    ) : (
                        <>
                            {isLoading1 && (
                                <img src="https://cdn-icons-png.flaticon.com/512/8999/8999447.png" alt="Loading..." style={{ width: '70%' }} />
                            )}
                            {cameraLinks[0] && (
                                <img
                                    src={`https://camera.bd2-cloud.net/video_feed?url=${encodeURIComponent(cameraLinks[0].rtsp)}`}
                                    autoPlay
                                    controls
                                    style={{ width: '100%' }}
                                    onLoad={() => setIsLoading1(false)}
                                    onError={() => setIsLoading1(false)}
                                />
                            )}
                        </>
                    )}
                </div>

                <div className="col-lg-6 col-md-12 mt-4">
                    <p>Camera 2 📷</p>
                    {!selectedParkingLot ? (
                        <img src="https://static.vecteezy.com/system/resources/previews/021/593/616/non_2x/city-street-parking-area-landscape-illustration-vector.jpg" alt="Default" style={{ width: '100%' }} />
                    ) : (
                        <>
                            {isLoading2 && (
                                <img src="https://cdn-icons-png.flaticon.com/512/8999/8999447.png" alt="Loading..." style={{ width: '70%' }} />
                            )}
                            {cameraLinks[1] && (
                                <img
                                    src={`https://tangsodlaw.bd2-cloud.net/video_feed`}
                                    autoPlay
                                    controls
                                    style={{ width: '100%' }}
                                    onLoad={() => setIsLoading2(false)}
                                    onError={() => setIsLoading2(false)}
                                />
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Dashboard_User;
