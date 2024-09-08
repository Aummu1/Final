const express = require("express");
const router_parkinglot = express.Router();
// const database = require("../Database/db_module");
const mysql = require("mysql");
// const port = 2546;
const cors = require('cors');

router_parkinglot.use(express.json())

router_parkinglot.use(
    cors({
    origin: "http://localhost:3000", // Wildcard is NOT for Production
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    })
);

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "projects"
});

db.connect(err => {
    if (err) {
        console.error("Error connecting to MySQL database:", err);
    } else {
        console.log("Connected to MySQL database");
    }
});

router_parkinglot.post('/user/saveParkingLot', (req, res) => {
    const { parkingLotName, wifi, wifiPassword } = req.body;

    if (!parkingLotName || !wifi || !wifiPassword) {
        return res.status(400).send('Missing required fields');
    }

    // บันทึกข้อมูลลงในตาราง parkinglot
    const queryParkingLot = 'INSERT INTO parkinglot (ParkingLot_Name) VALUES (?)';
    db.query(queryParkingLot, [parkingLotName], (err, result) => {
        if (err) {
            console.error('Error saving data to parkinglot table:', err);
            return res.status(500).send('Error saving data');
        }

        // ดึงค่า ParkingLot_ID ที่เพิ่งสร้างขึ้นมา
        const parkingLotID = result.insertId; // ใช้ insertId เพื่อดึงค่า ID ล่าสุดที่เพิ่มเข้าไป

        // บันทึกข้อมูลลงในตาราง led พร้อมกับเชื่อมโยง ParkingLot_ID
        const queryLED = 'INSERT INTO led (Wifi, Wifi_Password, ParkingLot_ID) VALUES (?, ?, ?)';
        db.query(queryLED, [wifi, wifiPassword, parkingLotID], (err, result) => {
            if (err) {
                console.error('Error saving data to led table:', err);
                return res.status(500).send('Error saving data');
            }
            res.status(200).send('Data saved successfully');
        });
    });
});

router_parkinglot.post('/user/save-index', (req, res) => {
    const { points, parkingLotID } = req.body;

    if (!points || points.length !== 5 || !parkingLotID) {
        return res.status(400).send('Missing required fields or points not in correct format');
    }

    // แปลงข้อมูล points เป็น JSON string
    const pointsJson = JSON.stringify(points);

    // สร้าง query สำหรับการบันทึกข้อมูล
    const queryIndex = 'INSERT INTO parkingspace (points_data, ParkingLot_ID) VALUES (?, ?)';
    db.query(queryIndex, [pointsJson, parkingLotID], (err, result) => {
        if (err) {
            console.error('Error saving data to parkingspace table:', err);
            return res.status(500).send('Error saving data');
        }
        res.status(200).send('Points saved successfully');
    });
});

module.exports = router_parkinglot;