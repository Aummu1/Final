const express = require("express");
const router_admin = express.Router();
const mysql = require("mysql");
const cors = require('cors');

router_admin.use(express.json())

router_admin.use(
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

router_admin.post("/user/check-email", async (req, res) => {
    const body = req.body;
    console.log(body);
    db.query(`SELECT * FROM admin WHERE Gmail = ?`, [body.email], (err, result) => {
        if (err) {
            console.error("Error fetching data from MySQL database:", err);
            return res.status(404).send("An error occurred while fetching data from the database");
        }
        if (result.length > 0) {
            result[0].found = true;
            res.status(200).json(result);
        } else {
            res.status(200).json([{ found: false }]);
        }
    });    
    });
    router_admin.get("/user/get-all", async (req, res) => {});
    router_admin.put("/user/update", async (req, res) => {});
    router_admin.get("/user", (req, res) => {
        res.send("User Router").status(200);
    });

    router_admin.post("/user/updateAdmin", async (req, res) => {
        let body = req.body;
        console.log(body);
    
        // if (!body.username || !body.password) {
        //     res.status(400).send("All fields are required: username, password");
        //     return;
        // }
    
        try {
            const query = 'UPDATE admin SET Username = ?, Password = ?, Name_Admin = ?, Image = ? WHERE Gmail = ?';
            db.query(query, [body.username, body.password, body.name, body.img, body.mail], (err, result) => {
                if (err) {
                    console.error("Error updating data in MySQL database:", err);
                    res.status(500).send("An error occurred while updating data in the database");
                    return;
                }
                console.log("User Updated Successfully.");
                res.status(200).send("User Updated Successfully.");
            });
        } catch (error) {
            console.error("Error Updating User.\n", error);
            res.status(500).send("Error Updating User.");
        }
    });

    router_admin.post("/user/CheckAdminUser", async (req, res) => {
        const body = req.body;
        console.log("Received request body:", body); // ตรวจสอบข้อมูลที่ได้รับ
        
        try {
            const query = 'SELECT * FROM admin WHERE Username = ? AND Password = ?';
            db.query(query, [body.username, body.password], (err, result) => {
                if (err) {
                    console.error("Error querying the database:", err);
                    return res.status(500).send("An error occurred while querying the database");
                }
                //console.log(result)
                if (result.length > 0) {
                    console.log("Admin user found.");
                    result[0].status = 200
                    res.json(result);
                } else {
                    console.log("Admin user not found.");
                    res.json([{"data":"Admin user not found.",
                        "status" : 404
                    }]);
                }
            });
        } catch (error) {
            console.error("Error checking admin user:", error);
            res.status(500).send("Error checking admin user.");
        }
    }); 
    
    router_admin.post("/user/resetpassword", async (req, res) => {
        let body = req.body;
        console.log(body);
    
        try {
            // ตรวจสอบว่าอีเมลที่ให้มามีอยู่ในระบบหรือไม่
            const checkQuery = 'SELECT * FROM admin WHERE Gmail = ?';
            db.query(checkQuery, [body.email], (err, result) => {
                if (err) {
                    console.error("Error checking email in MySQL database:", err);
                    res.status(500).send({ success: false, message: "An error occurred while checking email in the database" });
                    return;
                }
    
                if (result.length === 0) {
                    // อีเมลไม่พบในระบบ
                    res.status(404).send({ success: false, message: "Email not found in the system" });
                    return;
                }
    
                // อีเมลพบในระบบ, อัปเดตรหัสผ่าน
                const updateQuery = 'UPDATE admin SET Password = ? WHERE Gmail = ?';
                db.query(updateQuery, [body.password, body.email], (err, result) => {
                    if (err) {
                        console.error("Error updating data in MySQL database:", err);
                        res.status(500).send({ success: false, message: "An error occurred while updating data in the database" });
                        return;
                    }
                    console.log("User Updated Successfully.");
                    res.status(200).send({ success: true, message: "User Reset Password Successfully." });
                });
            });
        } catch (error) {
            console.error("Error Updating User.\n", error);
            res.status(500).send({ success: false, message: "Error Updating User." });
        }
    });
    
    
    
    

module.exports = router_admin;