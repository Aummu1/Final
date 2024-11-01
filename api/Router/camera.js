const express = require("express");
const router_camera = express.Router();
const mysql = require("mysql");
const cors = require('cors');

router_camera.use(express.json());

router_camera.use(
    cors({
        origin: "*", // ควรกำหนดเป็นชื่อโดเมนของแอปพลิเคชันคุณใน Production
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
    })
);

// การเชื่อมต่อฐานข้อมูล MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "admin",
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
    const { url, lines, parkingLotID, size } = req.body;

    if (!url || lines.length === 0 || !parkingLotID || !size) {
        console.log('Missing required fields:', { url, lines, parkingLotID, size });
        return res.status(400).send('RTSP URL, lines data, ParkingLot_ID, and size are required');
    }

    // แยกขนาดหน้าจอออกเป็นความกว้างและความสูง
    const [width, height] = size.split('x');

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

    // ตรวจสอบว่า URL ซ้ำหรือไม่
    const checkUrlQuery = 'SELECT COUNT(*) AS count FROM camera WHERE rtsp = ?';
    db.query(checkUrlQuery, [url], (err, results) => {
        if (err) {
            console.error('Error checking URL:', err);
            return res.status(500).send('Error checking URL');
        }

        console.log('URL count check:', results[0].count);

        if (results[0].count > 0) {
            console.log('RTSP URL already exists in the database:', url);
            return res.status(400).send('RTSP URL already exists');
        }

        // ถ้า URL ไม่มีอยู่ ให้บันทึกข้อมูล
        const insertQuery = 'INSERT INTO camera (rtsp, Line1, Line2, Black, ParkingLot_ID, Camera_Functions, width, height) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(insertQuery, [url, Line1, Line2, Black, parkingLotID, cameraFunctions, width, height], (err, result) => {
            if (err) {
                console.error('Error saving data:', err);
                return res.status(500).send('Error saving data');
            }
            console.log('Data saved successfully, cameraID:', result.insertId);
            res.status(200).send({ message: 'Data saved successfully', cameraID: result.insertId });
        });
    });
});

router_camera.post('/user/check-rtsp-url', (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).send('RTSP URL is required');
    }

    // ตรวจสอบว่า URL ซ้ำหรือไม่
    const checkUrlQuery = 'SELECT COUNT(*) AS count FROM camera WHERE rtsp = ?';
    db.query(checkUrlQuery, [url], (err, results) => {
        if (err) {
            console.error('Error checking URL:', err);
            return res.status(500).send('Error checking URL');
        }

        if (results[0].count > 0) {
            console.log('RTSP URL already exists in the database:', url);
            return res.status(400).send('RTSP URL already exists');
        }

        res.status(200).send('RTSP URL is unique');
    });
});



router_camera.post('/user/settingtime', (req, res) => {
    const { time, parkingLotID } = req.body; // รับ parkingLotID มาด้วย

    try {
        const selectQuery = 'SELECT * FROM timesetting WHERE ParkingLot_ID = ?';
        db.query(selectQuery, [parkingLotID], (err, results) => {
            if (err) {
                console.error("Error checking time setting:", err);
                res.status(500).send("Error checking time setting");
                return;
            }

            if (results.length > 0) {
                const updateQuery = 'UPDATE timesetting SET time = ? WHERE ParkingLot_ID = ?';
                db.query(updateQuery, [time, parkingLotID], (err, result) => {
                    if (err) {
                        console.error("Error updating time setting:", err);
                        res.status(500).send("Error updating time setting");
                        return;
                    }
                    console.log("Time setting updated successfully.");
                    res.status(200).send("Time setting updated successfully.");
                });
            } else {
                const insertQuery = 'INSERT INTO timesetting (time, ParkingLot_ID) VALUES (?, ?)';
                db.query(insertQuery, [time, parkingLotID], (err, result) => {
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
