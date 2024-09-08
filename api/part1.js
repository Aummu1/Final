const express = require("express");
const app = express();
const port = 2546;
const mysql = require("mysql");
const cors = require('cors');

//นำเข้าและใช้ Router จากไฟล์ professor.js ซึ่งกำหนดเส้นทางที่ขึ้นต้นด้วย /api
const api_admin = require("./Router/admin");
const api_user = require("./Router/professor");
const api_camera = require("./Router/camera");
const api_parkinglot = require("./Router/parkinglot");

app.use("/api", api_user);
app.use("/api", api_admin);
app.use("/api", api_camera);
app.use("/api", api_parkinglot);
//ใช้ Middleware express.json() เพื่อแปลง JSON ที่เข้ามาในคำขอให้เป็น JavaScript object
app.use(express.json())

//ใช้ Middleware cors เพื่ออนุญาตการเชื่อมต่อจากต้นทางที่กำหนด
app.use(
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

//เชื่อมต่อกับฐานข้อมูลและตรวจสอบความสำเร็จ
// db.connect(err => {
//     if (err) {
//         console.error("Error connecting to MySQL database:", err);
//     } else {
//         console.log("Connected to MySQL database");
//     }
// });

// เเส้นทาง GET ที่ root ซึ่งดึงข้อมูลจากตาราง admin ในฐานข้อมูลและส่งข้อมูลกลับไปยัง client
// app.get('/', (req, res) => {
//     db.query("SELECT * FROM admin", function (err, result) {
//         if (err) {
//             console.error("Error querying the database:", err);
//             res.status(500).send("An error occurred while querying the database");
//             return;
//         }
//         if (result.length > 0) {
//             console.log(result);
//             res.send(result[0]["Name_Admin"]);
//         } else {
//             res.send("No data found");
//         }
//     });
// });

app.post("/", (req, res) => {
    let json = req.body;
    res.send("Running").status(200);
    
});

// รับคำขอ GET ที่เส้นทาง '/about'
app.get('/about', (req, res) => {
    res.send('เกี่ยวกับเรา');
});

// เริ่มเซิร์ฟเวอร์
app.listen(port, () => {
    console.log(`เซิร์ฟเวอร์กำลังทำงานที่ http://localhost:${port}`);
});

