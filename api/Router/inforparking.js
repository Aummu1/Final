const express = require("express");
const router_inforparking = express.Router();
const mysql = require("mysql");
const cors = require('cors');

router_inforparking.use(express.json());

router_inforparking.use(
    cors({
        origin: "http://localhost:3000",
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

router_inforparking.get("/parkinglot/getdataparkinglot", (req, res) => {
    const query = 'SELECT ParkingLot_ID, ParkingLot_Name FROM parkinglot';
    db.query(query, (err, result) => {
        if (err) {
            console.error("Error fetching data from MySQL database:", err);
            res.status(500).send("เกิดข้อผิดพลาดขณะดึงข้อมูลจากฐานข้อมูล");
            return;
        }
        res.status(200).json(result);
    });
});

router_inforparking.delete("/parkinglot/delete/:id", (req, res) => {
    const parkingLotId = req.params.id;
    console.log("กำลังลบที่จอดรถที่มี ID:", parkingLotId);
    const query = 'DELETE FROM parkinglot WHERE ParkingLot_ID = ?';

    db.query(query, [parkingLotId], (err, result) => {
        if (err) {
            console.error("Error deleting parking lot from MySQL database:", err);
            res.status(500).send("เกิดข้อผิดพลาดขณะลบข้อมูลที่จอดรถ");
            return;
        }
        res.status(200).send("ลบข้อมูลที่จอดรถสำเร็จ");
    });
});

router_inforparking.put("/parkinglot/update/:id", (req, res) => {
    const parkingLotId = req.params.id;
    const newName = req.body.ParkingLot_Name;

    if (!newName) {
        return res.status(400).send("ต้องระบุชื่อที่จอดรถ");
    }

    const query = 'UPDATE parkinglot SET ParkingLot_Name = ? WHERE ParkingLot_ID = ?';
    db.query(query, [newName, parkingLotId], (err, result) => {
        if (err) {
            console.error("Error updating parking lot name in MySQL database:", err);
            res.status(500).send("เกิดข้อผิดพลาดขณะอัปเดตข้อมูลที่จอดรถ");
            return;
        }
        res.status(200).send("อัปเดตชื่อที่จอดรถสำเร็จ");
    });
});

router_inforparking.get("/camera/getdatacamera", (req, res) => {
    const query = 'SELECT ParkingLot_ID, ID_Camera, RTSP, Camera_Functions FROM camera';
    db.query(query, (err, result) => {
        if (err) {
            console.error("Error fetching camera data from MySQL database:", err);
            res.status(500).send("เกิดข้อผิดพลาดขณะดึงข้อมูลกล้องจากฐานข้อมูล");
            return;
        }
        res.status(200).json(result);
    });
});

router_inforparking.delete("/camera/delete/:id", (req, res) => {
    const cameraId = req.params.id;
    console.log("กำลังลบกล้องที่มี ID:", cameraId);
    const query = 'DELETE FROM camera WHERE ID_Camera = ?';

    db.query(query, [cameraId], (err, result) => {
        if (err) {
            console.error("Error deleting camera from MySQL database:", err);
            res.status(500).send("เกิดข้อผิดพลาดขณะลบข้อมูลกล้อง");
            return;
        }
        res.status(200).send("ลบข้อมูลกล้องสำเร็จ");
    });
});

router_inforparking.put("/camera/update/:id", (req, res) => {
    const cameraId = req.params.id;
    const { rtsp, Camera_Functions } = req.body;

    if (rtsp === undefined || Camera_Functions === undefined) {
        return res.status(400).send("RTSP และ Camera_Functions เป็นข้อมูลที่จำเป็น");
    }

    const query = 'UPDATE camera SET rtsp = ?, Camera_Functions = ? WHERE ID_Camera = ?';
    db.query(query, [rtsp, Camera_Functions, cameraId], (err, result) => {
        if (err) {
            console.error("Error updating camera data in MySQL database:", err);
            res.status(500).send("เกิดข้อผิดพลาดขณะอัปเดตข้อมูลกล้อง");
            return;
        }
        res.status(200).send("อัปเดตข้อมูลกล้องสำเร็จ");
    });
});

router_inforparking.get("/led/getdataled", (req, res) => {
    const query = 'SELECT ID_LED, ParkingLot_ID, Wifi, Wifi_Password FROM led';
    db.query(query, (err, result) => {
        if (err) {
            console.error("Error fetching LED data from MySQL database:", err);
            res.status(500).send("เกิดข้อผิดพลาดขณะดึงข้อมูล LED จากฐานข้อมูล");
            return;
        }
        res.status(200).json(result);
    });
});

router_inforparking.delete("/led/delete/:id", (req, res) => {
    const ledId = req.params.id;
    const query = 'DELETE FROM led WHERE ID_LED = ?';

    db.query(query, [ledId], (err, result) => {
        if (err) {
            console.error("Error deleting LED data from MySQL database:", err);
            res.status(500).send("เกิดข้อผิดพลาดขณะลบข้อมูล LED");
            return;
        }
        res.status(200).send("ลบข้อมูล LED สำเร็จ");
    });
});

router_inforparking.put("/led/update/:id", (req, res) => {
    const ledId = req.params.id;
    const { Wifi, Wifi_Password } = req.body;
    const query = 'UPDATE led SET Wifi = ?, Wifi_Password = ? WHERE ID_LED = ?';

    db.query(query, [Wifi, Wifi_Password, ledId], (err, result) => {
        if (err) {
            console.error("Error updating LED data in MySQL database:", err);
            res.status(500).send("เกิดข้อผิดพลาดขณะอัปเดตข้อมูล LED");
            return;
        }
        res.status(200).send("อัปเดตข้อมูล LED สำเร็จ");
    });
});

// API สำหรับดึงข้อมูล Car
router_inforparking.get("/car/getdatacar", (req, res) => {
    const query = 'SELECT Car_registration, Car_owner, Car_company, Car_model FROM car';
    db.query(query, (err, result) => {
        if (err) {
            console.error("Error fetching car data from MySQL database:", err);
            res.status(500).send("เกิดข้อผิดพลาดขณะดึงข้อมูลรถจากฐานข้อมูล");
            return;
        }
        res.status(200).json(result);
    });
});

router_inforparking.delete('/car/delete/:Car_registration', (req, res) => {
    const carRegistration = req.params.Car_registration;
    const query = 'DELETE FROM car WHERE Car_registration = ?';
    db.query(query, [carRegistration], (error, results) => {
        if (error) {
            console.error('Error deleting car:', error);
            return res.status(500).json({ message: 'เกิดข้อผิดพลาดขณะลบข้อมูลรถ' });
        }
        res.json({ message: 'ลบรถสำเร็จ' });
    });
});

router_inforparking.put('/car/update/:Car_registration', (req, res) => {
    const carRegistration = req.params.Car_registration;
    const { Car_registration, Car_owner, Car_company, Car_model } = req.body;

    // เริ่ม transaction
    db.beginTransaction((err) => {
        if (err) {
            return res.status(500).send('Transaction Error');
        }

        const updateCarQuery = 'UPDATE car SET Car_registration = ?, Car_owner = ?, Car_company = ?, Car_model = ? WHERE Car_registration = ?';
        db.query(updateCarQuery, [Car_registration, Car_owner, Car_company, Car_model, carRegistration], (error, results) => {
            if (error) {
                return db.rollback(() => {
                    res.status(500).send(error);
                });
            }

            // เมื่ออัปเดตตาราง car เสร็จแล้ว ให้อัปเดตตาราง professor ด้วย
            const updateProfessorQuery = 'UPDATE professor SET Car_registration = ?, Name_Professor = ? WHERE Car_registration = ?';
            db.query(updateProfessorQuery, [Car_registration, Car_owner, carRegistration], (error, results) => {
                if (error) {
                    return db.rollback(() => {
                        res.status(500).send(error);
                    });
                }

                // Commit transaction
                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).send('Commit Error');
                        });
                    }

                    res.send('Car and Professor information updated successfully');
                });
            });
        });
    });
});

module.exports = router_inforparking;
