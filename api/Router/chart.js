const express = require("express");
const router_chart = express.Router();
const mysql = require("mysql");
const cors = require('cors');

router_chart.use(express.json())

router_chart.use(
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

router_chart.get('/chart/timerecord', (req, res) => {
    const { date } = req.query;  // รับวันที่จาก query string
    const query = `SELECT TimeIn, Status FROM timerecord WHERE DATE(TimeIn) = ?`;

    db.query(query, [date], (err, result) => {
        if (err) {
            console.error('Error fetching time records:', err);
            res.status(500).send('Error fetching time records');
        } else {
            res.json(result);
        }
    });
});

router_chart.get('/chart/timerecord-2', (req, res) => {
    const { start, end } = req.query;  // รับวันที่เริ่มต้นและสิ้นสุดจาก query string
    const query = `SELECT TimeIn, Status FROM timerecord WHERE DATE(TimeIn) BETWEEN ? AND ?`;

    db.query(query, [start, end], (err, result) => {
        if (err) {
            console.error('Error fetching time records:', err);
            res.status(500).send('Error fetching time records');
        } else {
            res.json(result);
        }
    });
});

//ส่งออก Router เพื่อให้สามารถใช้ในไฟล์อื่นได้
module.exports = router_chart;

//ทุกคำขอที่เริ่มต้นด้วย /api จะถูกส่งไปจัดการโดย Router ใน professor.js