'use client'
/** @jsxImportSource @emotion/react */
import Link from "next/link";
import 'bootstrap/dist/css/bootstrap.min.css';
import { PersonFill } from 'bootstrap-icons-react';
import { BarChart } from '@mui/x-charts/BarChart';
import React, { useEffect, useState } from 'react';
import '../../app/script.js'; 

function Dashboard() {
    return (
        <div className="pr-10 pl-10 z-2">
            <p className="pb-3 fs-1 font-bold">welcome</p>
            <section className="row justify-around">
                <div className="card display-flex col-lg-2 col-md-12 mb-3 p-0">
                    <div className="row g-0 display-flex align-items-center justify-center">
                        <div className="col-3">
                            <img src="/image/car-yellow.png" className="card-img-top ml-6" alt="" />
                        </div>
                        <div className="col-9 display-flex flex-direction-column">
                            <div className="card-body ">
                                <p className="card-text text-center mb-0">ช่องทั้งหมด</p>
                                <p id="test" className="card-text text-center font-bold fs-3">18</p>
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
                                <p className="card-text text-center font-bold fs-3">18</p>
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
                                <p className="card-text text-center font-bold fs-3">18</p>
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
                                <p className="card-text text-center font-bold fs-3">18</p>
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
                                <p className="card-text text-center font-bold fs-3">18</p>
                            </div>
                        </div>
                    </div>
                </div>

            </section>

            <section>

            </section>

            <section className="row justify-around mb-10">
                <div className="col-lg-6 col-md-12 mt-4">
                    <p>Camera 1 📷 </p>
                    <img id="video_feed" src="http://172.23.225.249:5000/video_feed" alt="Video Feed" />
                    </div>

                <div className="col-lg-6 col-md-12 mt-4">
                    <p>Camera 2 📷</p>
                    <img src="/image/c-test-1.png" className="card-img-top" alt="" />
                </div>
            </section>

            <section>
                <p>Data Charts📊</p>
                <BarChart
                    series={[
                        { data: [35, 44, 24, 34] },
                        { data: [51, 6, 49, 30] },
                        { data: [15, 25, 30, 50] },
                        { data: [60, 50, 15, 25] },
                    ]}
                    height={290}
                    xAxis={[{ data: ['Q1', 'Q2', 'Q3', 'Q4'], scaleType: 'band' }]}
                    margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                />
            </section>
        </div>
    );
}

export default Dashboard