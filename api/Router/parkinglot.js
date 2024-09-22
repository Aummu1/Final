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

router_parkinglot.post('/user/save-camera', (req, res) => {
    const { url, parkingLotID, cameraFunctions } = req.body;

    if (!url || !parkingLotID || !cameraFunctions) {
        return res.status(400).send('Missing required fields');
    }

    const query = 'INSERT INTO camera (rtsp, ParkingLot_ID, Camera_Functions) VALUES (?, ?, ?)';
    db.query(query, [url, parkingLotID, cameraFunctions], (err, result) => {
        if (err) {
            console.error('Error saving data to camera table:', err);
            return res.status(500).send('Error saving data to camera table');
        }
        res.status(200).send('Camera data saved successfully');
    });
});

router_parkinglot.post('/user/save-enter-and-parkingspace', (req, res) => {
    const { enterData, pointsData, parkingLotID } = req.body;

    if (!enterData || enterData.length === 0 || !parkingLotID) {
        return res.status(400).send('Missing required fields or points not in correct format');
    }

    // เก็บข้อมูลช่องแรกใน Enter
    const enterPolygon = enterData.map(point => [point.x, point.y]);
    const enterJson = JSON.stringify(enterPolygon);

    // แทรกข้อมูลตัวแรกเข้าไปในฟิลด์ Enter
    const queryEnter = 'INSERT INTO parkingspace (Enter, ParkingLot_ID) VALUES (?, ?)';
    db.query(queryEnter, [enterJson, parkingLotID], (err, result) => {
        if (err) {
            console.error('Error saving Enter data:', err);
            return res.status(500).send('Error saving Enter data');
        }

        // ถ้ามีข้อมูลที่เหลือ ให้แทรกลงใน points_data ทีละแถว
        if (pointsData.length > 0) {
            pointsData.forEach((shape) => {
                const pointsJson = JSON.stringify(shape); // เก็บในรูปแบบอาเรย์ของพ้อยท์

                const queryPoints = 'INSERT INTO parkingspace (points_data, ParkingLot_ID) VALUES (?, ?)';
                db.query(queryPoints, [pointsJson, parkingLotID], (err, result) => {
                    if (err) {
                        console.error('Error saving points data:', err);
                    }
                });
            });

            res.status(200).send('Enter and points data saved successfully');
        } else {
            res.status(200).send('Only Enter data saved successfully');
        }
    });
});


// -----------------------------------get parkinglot----------------------------------------

router_parkinglot.get('/user/option', (req, res) => {
    const query = 'SELECT ParkingLot_ID, ParkingLot_Name FROM parkinglot';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data from parkinglot table:', err);
            return res.status(500).send('Error fetching data');
        }
        res.status(200).json(results);
    });
});

// Endpoint สำหรับดึงข้อมูล parking lot ตาม ID
router_parkinglot.get('/user/parkinglotdash/:id', (req, res) => {
    const parkingLotID = req.params.id;

    // Query เพื่อดึงข้อมูลตาม ID
    const query = `
        SELECT 
            ParkingLot_ID, 
            AllSpace, 
            FreeSpace, 
            UnFreeSpace, 
            UnknowCar, 
            UnknowObj 
        FROM parkinglot 
        WHERE ParkingLot_ID = ?`;

    db.query(query, [parkingLotID], (err, results) => {
        if (err) {
            console.error('Error fetching data from parkinglot table:', err);
            return res.status(500).send('Error fetching data');
        }

        if (results.length === 0) {
            return res.status(404).send('Parking lot not found');
        }

        // ส่งข้อมูลกลับไปที่ client
        res.status(200).json(results[0]);
    });
});

router_parkinglot.get('/user/camera-links/:parkingLotId', (req, res) => {
    const { parkingLotId } = req.params;
    const query = 'SELECT rtsp FROM camera WHERE ParkingLot_ID = ?';

    db.query(query, [parkingLotId], (err, results) => {
        if (err) {
            console.error('Error fetching RTSP links from camera table:', err);
            return res.status(500).send('Error fetching RTSP links');
        }
        res.status(200).json(results);
    });
});


module.exports = router_parkinglot;