const express = require("express");
const app = express();
const port = 2546;
const mysql = require("mysql");
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

//นำเข้าและใช้ Router จากไฟล์ professor.js ซึ่งกำหนดเส้นทางที่ขึ้นต้นด้วย /api
const api_admin = require("./Router/admin");
const api_user = require("./Router/professor");
const api_camera = require("./Router/camera");
const api_parkinglot = require("./Router/parkinglot");
const api_inforparking = require("./Router/inforparking");
const api_chart = require("./Router/chart");

app.use("/api", api_user);
app.use("/api", api_admin);
app.use("/api", api_camera);
app.use("/api", api_parkinglot);
app.use("/api", api_inforparking);
app.use("/api", api_chart);

//ใช้ Middleware cors เพื่ออนุญาตการเชื่อมต่อจากต้นทางที่กำหนด
app.use(
    cors({
    origin: "https://appb17.bd2-cloud.net",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    })
);

//ใช้ Middleware express.json() เพื่อแปลง JSON ที่เข้ามาในคำขอให้เป็น JavaScript object
app.use(express.json())
app.use(bodyParser.json());

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

app.post("/", (req, res) => {
    let json = req.body;
    res.send("Running").status(200);
    
});

// รับคำขอ GET ที่เส้นทาง '/about'
app.get('/about', (req, res) => {
    res.send('เกี่ยวกับเรา');
});

// ------------------------------------------------hashing----------------------------------------------------

// Hashing Passwords
app.get('/hash-passwords', async (req, res) => {
    try {
        // ดึงข้อมูลที่ต้องการแฮช เช่น รหัสผ่านจากตาราง admin
        db.query('SELECT Password, ID FROM admin', async (err, rows) => {
            if (err) {
                return res.status(500).send('Error retrieving passwords');
            }

            const saltRounds = 10;
            for (const row of rows) {
                const hashedPassword = await bcrypt.hash(row.Password, saltRounds);
                // อัปเดตข้อมูลรหัสผ่านที่แฮชแล้วกลับไปในฐานข้อมูล
                await new Promise((resolve, reject) => {
                    db.query('UPDATE admin SET Password = ? WHERE ID = ?', [hashedPassword, row.ID], (err) => {
                        if (err) return reject(err);
                        resolve();
                    });
                });
            }

            res.send('Passwords have been hashed and updated successfully.');
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while updating passwords.');
    }
});

// เริ่มเซิร์ฟเวอร์
app.listen(port, () => {
    console.log(`เซิร์ฟเวอร์กำลังทำงานที่ http://localhost:${port}`);
});
