const express = require("express");
const router_user = express.Router();
const mysql = require("mysql");
const cors = require('cors');

router_user.use(express.json())

router_user.use(
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

router_user.post("/user/check-email", async (req, res) => {
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
    router_user.get("/user/get-all", async (req, res) => {});
    router_user.put("/user/update", async (req, res) => {});
    router_user.get("/user", (req, res) => {
        res.send("User Router").status(200);
    });

    router_user.post("/user/updateAdmin", async (req, res) => {
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
    

module.exports = router_user;