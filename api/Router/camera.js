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

    const cameraFunctions = 'Detect License plates';

    const query = 'INSERT INTO camera (rtsp, Line1, Line2, Black, ParkingLot_ID, Camera_Functions) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [url, Line1, Line2, Black, parkingLotID, cameraFunctions], (err, result) => {
        if (err) {
            console.error('Error saving data:', err);
            return res.status(500).send('Error saving data');
        }
        res.status(200).send({ message: 'Data saved successfully', cameraID: result.insertId });
    });
});

router_camera.post('/user/settingtime', (req, res) => {
    const { time } = req.body;

    try {
        // ตรวจสอบว่ามีข้อมูลอยู่แล้วหรือไม่
        const selectQuery = 'SELECT * FROM timesetting';
        db.query(selectQuery, (err, results) => {
            if (err) {
                console.error("Error checking time setting:", err);
                res.status(500).send("Error checking time setting");
                return;
            }

            if (results.length > 0) {
                // ถ้ามีข้อมูลแล้ว ให้ทำการอัปเดตข้อมูลใหม่
                const updateQuery = 'UPDATE timesetting SET time = ? WHERE timesetting_id = ?';
                const timesetting_id = results[0].timesetting_id; // ใช้ id ของข้อมูลที่มีอยู่
                db.query(updateQuery, [time, timesetting_id], (err, result) => {
                    if (err) {
                        console.error("Error updating time setting:", err);
                        res.status(500).send("Error updating time setting");
                        return;
                    }
                    console.log("Time setting updated successfully.");
                    res.status(200).send("Time setting updated successfully.");
                });
            } else {
                // ถ้าไม่มีข้อมูล ให้ทำการเพิ่มข้อมูลใหม่
                const insertQuery = 'INSERT INTO timesetting (time) VALUES (?)';
                db.query(insertQuery, [time], (err, result) => {
                    if (err) {
                        console.error("Error inserting time setting:", err);
                        res.status(500).send("Error inserting time setting");
                        return;
                    }
                    console.log("Time setting inserted successfully.");
                    res.status(200).send("Time setting inserted successfully.");
                });
            }
        });
    } catch (error) {
        console.error("Error Settingtime \n", error);
        res.status(500).send("Error Settingtime");
    }
});



module.exports = router_camera;
