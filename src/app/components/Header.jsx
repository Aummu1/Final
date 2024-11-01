// // Header.jsx
// 'use client';

// import React, { useEffect, useState } from 'react'; 
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { useSession } from "next-auth/react";
// import axios from 'axios';
// import 'boxicons/css/boxicons.min.css'; // เพิ่มการนำเข้า Boxicons ที่นี่

// function Header({ onParkingLotChange }) {
//     const { data: session } = useSession();
//     const [parkingLots, setParkingLots] = useState([]);

//     useEffect(() => {
//         const fetchParkingLots = async () => {
//             try {
//                 const response = await axios.get('https://apib17.bd2-cloud.net/api/user/option');
//                 setParkingLots(response.data);
//             } catch (error) {
//                 console.error('Error fetching parking lots:', error);
//             }
//         };

//         fetchParkingLots();
//     }, []);

//     return (
//         <div className="col-12 d-flex mt-10 mb-10 align-items-center justify-content-around">
//             <div className="">
//                 <select onChange={onParkingLotChange} className="form-select" aria-label="Default select example" defaultValue="">                    {parkingLots.map((lot, index) => (
//                         <option key={index} value={lot.ParkingLot_ID}>{lot.ParkingLot_Name}</option>
//                     ))}
//                 </select>
//             </div>

//             <div>
//                 {session
//                     ? <img className='w-11 ml-2.5 d-flex items-center justify-center rounded-circle' src={session?.user?.image} alt="" />
//                     : <i className='bx bxs-user-circle fs-1' style={{ cursor: 'pointer' }} onClick={() => { window.location.href = 'LoginPage' }}></i>}
//             </div>
//         </div>
//     );
// }

// export default Header;
