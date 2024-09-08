const express = require("express");
const router_camera = express.Router();
const mysql = require("mysql");
const cors = require('cors');

router_camera.use(express.json());

router_camera.use(
    cors({
        origin: "http://localhost:3000", // ควรกำหนดเป็นชื่อโดเมนของแอปพลิเคชันคุณใน Production
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
    })
);

// การเชื่อมต่อฐานข้อมูล MySQL
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

// Endpoint สำหรับดึงข้อมูล ParkingLot_ID ล่าสุด
router_camera.get('/user/getParkingLotID', (req, res) => {
    const query = 'SELECT ParkingLot_ID FROM parkinglot ORDER BY ParkingLot_ID DESC LIMIT 1';
    db.query(query, (err, result) => {  
        if (err) {
            console.error('Error fetching ParkingLot_ID:', err);
            return res.status(500).send('Error fetching ParkingLot_ID');
        }
        res.status(200).send(result[0]); // ส่งข้อมูล ParkingLot_ID กลับไป
    });
});

// Endpoint สำหรับบันทึกข้อมูล RTSP URL และเส้นที่วาด
router_camera.post('/user/save-data', (req, res) => {
    const { url, lines, parkingLotID } = req.body;

    if (!url || lines.length === 0 || !parkingLotID) {
        return res.status(400).send('RTSP URL, lines data, and ParkingLot_ID are required');
    }

    let Line1 = null;
    let Line2 = null;
    let Black = null;

    lines.forEach((line, index) => {
        if (index === 0) {
            Line1 = JSON.stringify([line.x1, line.y1, line.x2, line.y2]);
        } else if (index === 1) {
            Line2 = JSON.stringify([line.x1, line.y1, line.x2, line.y2]);
        } else if (index === 2) {
            Black = line.x1;
        }
    });

    const query = 'INSERT INTO camera (rtsp, Line1, Line2, Black, ParkingLot_ID) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [url, Line1, Line2, Black, parkingLotID], (err, result) => {
        if (err) {
            console.error('Error saving data:', err);
            return res.status(500).send('Error saving data');
        }
        res.status(200).send({ message: 'Data saved successfully', cameraID: result.insertId });
    });
});

router_camera.post('/user/settingtime', (req, res) => {
    const { time } = req.body;

    const query = 'INSERT INTO timesetting (time) VALUES (?)';
    db.query(query, [time], (err, result) => {  
        if (err) {
            console.error('Error fetching SettingTime', err);
            return res.status(500).send('Error fetching SettingTime');
        }
        res.status(200).send(result[0]); 
});

module.exports = router_camera;
