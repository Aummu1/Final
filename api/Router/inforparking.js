const express = require("express");
const router_inforparking = express.Router();
// const database = require("../Database/db_module");
const mysql = require("mysql");
// const port = 2546;
const cors = require('cors');

router_inforparking.use(express.json())

router_inforparking.use(
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

router_inforparking.get("/user/getdataparkinglot", (req, res) => {
    const query = 'SELECT ParkingLot_ID, ParkingLot_Name FROM `parkinglot`'; // เปลี่ยนจากตาราง form เป็นตาราง parkinglot และเลือก field ที่ต้องการ
    db.query(query, (err, result) => {
        if (err) {
            console.error("Error fetching data from MySQL database:", err);
            res.status(500).send("An error occurred while fetching data from the database");
            return;
        }
        // ส่งข้อมูลทั้งหมดที่ได้จาก query กลับไปยัง client
        res.status(200).json(result);
    });
});

router_inforparking.delete("/parkinglot/delete/:id", (req, res) => {
    const parkingLotId = req.params.id; //ดึงค่าของ id จาก URL parameter และเก็บไว้ในตัวแปร parkingLotId
    console.log("Deleting parking lot with id:", parkingLotId); // เพิ่มบรรทัดนี้เพื่อดีบั๊ก
    const query = 'DELETE FROM parkinglot WHERE ParkingLot_ID = ?';  //กำหนดคำสั่ง SQL ที่จะใช้ในการลบข้อมูลจากตาราง parking_lot

    db.query(query, [parkingLotId], (err, result) => { //[parkingLotId] คือค่าที่จะถูกแทนที่ในคำสั่ง SQL แทน ?
        if (err) {
            console.error("Error deleting parking lot from MySQL database:", err);
            res.status(500).send("An error occurred while deleting parking lot data from the database");
            return;
        }
        res.status(200).send("Parking lot deleted successfully.");
    });
});

router_inforparking.put("/parkinglot/update/:id", (req, res) => {
    const parkingLotId = req.params.id;
    const newName = req.body.ParkingLot_Name;

    if (!newName) {
        return res.status(400).send("ParkingLot_Name is required");
    }

    const query = 'UPDATE parkinglot SET ParkingLot_Name = ? WHERE ParkingLot_ID = ?';
    db.query(query, [newName, parkingLotId], (err, result) => {
        if (err) {
            console.error("Error updating parking lot name in MySQL database:", err);
            res.status(500).send("An error occurred while updating parking lot data in the database");
            return;
        }
        res.status(200).send("Parking lot name updated successfully.");
    });
});

module.exports = router_inforparking;