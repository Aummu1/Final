const express = require("express");
const router_user = express.Router();
// const database = require("../Database/db_module");
const mysql = require("mysql");
// const port = 2546;
const cors = require('cors');
router_user.use(express.json())

router_user.use(
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

router_user.post("/user/register", async (req, res) => {
    let body = req.body;
    console.log(body)
    try {
        const query = 'INSERT INTO professor (ID_Professor,Name_Professor, Faculty) VALUES (UUID(), ?, ?)';
        console.log(body.name);
        db.query(query, [body.name, body.faculty], (err, result) => {
            if (err) {
                console.error("Error inserting data into MySQL database:", err);
                res.status(500).send("An error occurred while inserting data into the database");
                return;
            }
            console.log("User Registered Successfully.");
            res.status(200).send("User Registered Successfully.");
        });
    } catch (error) {
        console.error("Error Registering User.\n", error);
        res.status(500).send("Error Registering User.");
    }
});

module.exports = router_user;