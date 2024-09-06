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

router_camera.post('/user/save-data', (req, res) => {
    const { url, lines } = req.body;

    if (!url || lines.length === 0) {
        return res.status(400).send('RTSP URL and lines data are required');
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

    console.log('RTSP URL:', url);
    console.log('Line1:', Line1);
    console.log('Line2:', Line2);
    console.log('Black:', Black);

    const query = 'INSERT INTO camera (rtsp, Line1, Line2, Black) VALUES (?, ?, ?, ?)';
    db.query(query, [url, Line1, Line2, Black], (err, result) => {
        if (err) {
            console.error('Error saving data:', err);
            return res.status(500).send('Error saving data');
        }
        res.status(200).send('Data saved successfully');
    });
});

    
    

module.exports = router_camera;