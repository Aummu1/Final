const express = require("express");
const router_parkinglot = express.Router();
const app = express();
// const database = require("../Database/db_module");
const mysql = require("mysql");
// const port = 2546;
const cors = require('cors');
const bodyParser = require('body-parser');

router_parkinglot.use(express.json())

router_parkinglot.use(
    cors({
    origin: "*", // Wildcard is NOT for Production
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    })
);

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

// ใช้ body-parser middleware
app.use(bodyParser.json());

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

router_parkinglot.post('/user/save-enter-and-parkingspace', async (req, res) => {
    const { enterData, pointsData, parkingLotID } = req.body;

    if (!pointsData || pointsData.length === 0 || !parkingLotID) {
        return res.status(400).send('Missing required fields or points not in correct format');
    }

    try {
        // ถ้ามี enterData ให้บันทึกข้อมูล Enter
        if (enterData && enterData.length > 0) {
            const enterPolygon = enterData.map(point => [point.x, point.y]);
            const enterJson = JSON.stringify(enterPolygon);

            const queryEnter = 'INSERT INTO parkingspace (Enter, ParkingLot_ID) VALUES (?, ?)';
            await new Promise((resolve, reject) => {
                db.query(queryEnter, [enterJson, parkingLotID], (err, result) => {
                    if (err) {
                        console.error('Error saving Enter data:', err);
                        return reject(err); // ส่ง error กลับ
                    }
                    resolve(result);
                });
            });
        }

        // บันทึกข้อมูล pointsData
        for (const shape of pointsData) {
            const pointsJson = JSON.stringify(shape);

            const queryPoints = 'INSERT INTO parkingspace (points_data, ParkingLot_ID) VALUES (?, ?)';
            await new Promise((resolve, reject) => {
                db.query(queryPoints, [pointsJson, parkingLotID], (err, result) => {
                    if (err) {
                        console.error('Error saving points data:', err);
                        return reject(err); // ส่ง error กลับ
                    }
                    resolve(result);
                });
            });
        }

        res.status(200).send('Enter and points data saved successfully');

    } catch (error) {
        console.error('Error during saving process:', error);
        res.status(500).send('Error saving data');
    }
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
    const query = 'SELECT rtsp FROM camera WHERE ParkingLot_ID = ? LIMIT 10'; // เพิ่ม LIMIT

    db.query(query, [parkingLotId], (err, results) => {
        if (err) {
            console.error('Error fetching RTSP links from camera table:', err);
            return res.status(500).send('Error fetching RTSP links');
        }
        res.status(200).json(results);
    });
});

// Get Points Data by Parking Lot ID
router_parkinglot.get('/user/points_data/:id', (req, res) => {
    const parkingLotID = req.params.id;

    // Query to fetch all points data for the selected parking lot
    const query = `
        SELECT points_data 
        FROM parkingspace 
        WHERE ParkingLot_ID = ? AND points_data IS NOT NULL`; // เพิ่มเงื่อนไขเพื่อไม่ให้ดึงข้อมูลที่เป็น null

    db.query(query, [parkingLotID], (err, results) => {
        if (err) {
            console.error('Error fetching points data from parkingspace table:', err);
            return res.status(500).send('Error fetching points data');
        }

        if (results.length === 0) {
            return res.status(404).send('No points data found for this parking lot');
        }

        // แยกข้อมูล points_data และทำเป็น array
        const allPointsData = results.flatMap(result => result.points_data || []); // ใช้ flatMap เพื่อแยกข้อมูลและกรองข้อมูล null

        // ส่งข้อมูลทั้งหมดกลับไปที่ client
        res.status(200).json({ points_data: allPointsData });
    });
});

router_parkinglot.post('/user/savepointsdata', async (req, res) => {
    const { parkingLotID, pointsData } = req.body;

    if (!parkingLotID || !pointsData || pointsData.length === 0) {
        return res.status(400).send('Missing parkingLotID or pointsData');
    }

    try {
        const query = 'INSERT INTO parkingspace (points_data, ParkingLot_ID) VALUES (?, ?)';
        const pointsJson = JSON.stringify(pointsData);
        db.query(query, [pointsJson, parkingLotID], (err, result) => {
            if (err) {
                console.error('Error saving points data:', err);
                return res.status(500).send('Error saving points data');
            }
            res.status(200).send('Points data saved successfully');
        });
    } catch (error) {
        console.error('Error during saving process:', error);
        res.status(500).send('Error saving points data');
    }
});


module.exports = router_parkinglot;