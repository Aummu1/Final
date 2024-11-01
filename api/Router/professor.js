const express = require("express");
const router_user = express.Router();
const mysql = require("mysql");
const cors = require('cors');

router_user.use(express.json())

router_user.use(
    cors({
    origin: "*",
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

//post data professor to database เส้นทาง POST ที่ /user/register เพื่อรับข้อมูลจาก client และเพิ่มข้อมูลเข้าไปในตาราง form ของฐานข้อมูล///
router_user.post("/user/portdataform", async (req, res) => {
    let body = req.body;
    console.log(body)
    try {
        const query = 'INSERT INTO form (Name_Professor,Faculty,Car_company,Car_model,Car_Registor) VALUES (? ,?, ?, ?, ?)';
        db.query(query, [body.name, body.faculty,body.company,body.model, body.registration], (err, result) => {
            if (err) {
                console.error("Error inserting data into MySQL database:", err);
                res.status(500).send("An error occurred while inserting data into the database");
                return;
            }
        });
        console.log("User Registered Successfully.");
        res.status(200).send("User Registered Successfully.");
    } catch (error) {
        console.error("Error Registering User.\n", error);
        res.status(500).send("Error Registering User.");
    }
});

//Get for formpage เส้นทาง GET ที่ /user/getdataform เพื่อดึงข้อมูลทั้งหมดจากตาราง form ในฐานข้อมูลและส่งกลับไปยัง client///
router_user.get("/user/getdataform", (req, res) => {
    const query = 'SELECT * FROM `form`';
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

// Delete data professor from database
router_user.delete("/user/delete/:id", (req, res) => {
    const userId = req.params.id; //ดึงค่าของ id จาก URL parameter และเก็บไว้ในตัวแปร userId
    console.log("Deleting user with id:", userId); // เพิ่มบรรทัดนี้เพื่อดีบั๊ก
    const query = 'DELETE FROM form WHERE id = ?';  //กำหนดคำสั่ง SQL ที่จะใช้ในการลบข้อมูลจากตาราง form โดยจะลบข้อมูลที่มี id ตรงกับค่าในตัวแปร userId

    db.query(query, [userId], (err, result) => { //[userId] คือค่าที่จะถูกแทนที่ในคำสั่ง SQL แทน ?
        if (err) {
            console.error("Error deleting data from MySQL database:", err);
            res.status(500).send("An error occurred while deleting data from the database");
            return;
        }
        res.status(200).send("User deleted successfully.");
    });
});

// เส้นทาง POST ที่ /user/postconfirmdata เพื่อยืนยันและเพิ่มข้อมูลเข้าไปในตาราง professor และ car
router_user.post("/user/postconfirmdata", async (req, res) => {
    let body = req.body;
    console.log("Received body:", body);
    try {
        const queryProfessor = 'INSERT INTO professor (Name_Professor, Faculty, Car_registration) VALUES (?, ?, ?)';
        const queryCar = 'INSERT INTO car (Car_company, Car_model, Car_owner, Car_registration) VALUES (?, ?, ?, ?)';
        const queryDeleteForm = 'DELETE FROM form WHERE id = ?';

        db.query(queryProfessor, [body.name, body.faculty, body.registration], (err, result) => {
            if (err) {
                console.error("Error inserting data into professor table:", err);
                console.log("Data to be inserted:", [body.name, body.faculty, body.registration]); // เพิ่ม log ข้อมูลที่พยายามจะ insert
                res.status(500).send("An error occurred while inserting data into the professor table");
                return;
            }

            db.query(queryCar, [body.company, body.model, body.name, body.registration], (err, result) => {
                if (err) {
                    console.error("Error inserting data into car table:", err);
                    res.status(500).send("An error occurred while inserting data into the car table");
                    return;
                }

                db.query(queryDeleteForm, [body.id], (err, result) => {
                    if (err) {
                        console.error("Error deleting data from form table:", err);
                        res.status(500).send("An error occurred while deleting data from the form table");
                        return;
                    }
                    console.log("Confirm Registered Successfully.");
                    res.status(200).send("Confirm Registered Successfully.");
                });
            });
        });

    } catch (error) {
        console.error("Error Registering User.\n", error);
        res.status(500).send("Error Registering User.");
    }
});

//ส่งออก Router เพื่อให้สามารถใช้ในไฟล์อื่นได้
module.exports = router_user;

//ทุกคำขอที่เริ่มต้นด้วย /api จะถูกส่งไปจัดการโดย Router ใน professor.js