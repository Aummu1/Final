const express = require("express");
const router_camera = express.Router();
// const database = require("../Database/db_module");
const mysql = require("mysql");
// const port = 2546;
const cors = require('cors');

router_camera.use(express.json())

router_camera.use(
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

router_camera.post('/user/save-lines', (req, res) => {
    const lines = req.body.lines;

    if (lines.length > 0) {
      // ตัวแปรเพื่อเก็บข้อมูลของแต่ละเส้น
        let Line1 = null;
        let Line2 = null;
        let Black = null;
    
        // จัดการข้อมูลเส้น
        lines.forEach((line, index) => {
            if (index === 0) {
            // เส้นที่ 1
            Line1 = JSON.stringify([line.x1, line.y1, line.x2, line.y2]);
            } else if (index === 1) {
            // เส้นที่ 2
            Line2 = JSON.stringify([line.x1, line.y1, line.x2, line.y2]);
            } else if (index === 2) {
            // เส้นที่ 3
            Black = line.x1;
            }
        });
    
        // ตรวจสอบค่า
        console.log('Line1:', Line1);
        console.log('Line2:', Line2);
        console.log('Black:', Black);
    
        // สร้างคำสั่ง SQL เพื่อบันทึกข้อมูล
        const query = 'INSERT INTO camera (Line1, Line2, Black) VALUES (?, ?, ?)';
            db.query(query, [Line1, Line2, Black], (err, result) => {
            if (err) {
                console.error('Error saving lines:', err);
                return res.status(500).send('Error saving lines');
            }
            res.status(200).send('Lines saved successfully');
            });
        } else {
        res.status(400).send('No lines data provided');
        }
    });
    

module.exports = router_camera;