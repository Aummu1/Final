const express = require("express");
const router_admin = express.Router();
const mysql = require("mysql");
const cors = require('cors');
const bcrypt = require('bcrypt');

const CLIENT_ID = '2006415575';
const CLIENT_SECRET = 'fea3a835616adf5b21d199186f7b9873';
const REDIRECT_URI = 'https://appb17.bd2-cloud.net/AdminPage';

router_admin.use(express.json())

router_admin.use(
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
    
    // --------------------------------------------reset password----------------------------------------------
    router_admin.post("/admin/resetpassword", async (req, res) => {
        let body = req.body;
        console.log(body);
    
        try {
            // ตรวจสอบว่าอีเมลที่ให้มามีอยู่ในระบบหรือไม่
            const checkQuery = 'SELECT * FROM admin WHERE Username = ?';
            db.query(checkQuery, [body.username], async (err, result) => {
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
                const saltRounds = 10; // จำนวนรอบในการแฮช
                const hashedPassword = await bcrypt.hash(body.password, saltRounds); // แฮชรหัสผ่านที่ผู้ใช้กรอก
    
                const updateQuery = 'UPDATE admin SET Password = ? WHERE Username = ?';
                db.query(updateQuery, [hashedPassword, body.username], (err, result) => {
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

    // ---------------------------------------------check password------------------------------------------------
    router_admin.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;

    // ตรวจสอบว่ามี username และ password หรือไม่
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Please enter both username and password' });
    }

    // ค้นหา username ในฐานข้อมูล
    const query = 'SELECT * FROM admin WHERE Username = ?';
    db.query(query, [username], async (err, results) => {
        if (err) {
            console.error('Error fetching user from database:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        if (results.length === 0) {
            // ไม่มี username ที่ตรงกัน
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        const user = results[0];

        // ตรวจสอบ password โดยใช้ bcrypt.compare เพื่อตรวจสอบรหัสผ่านที่แฮชแล้ว
        const isPasswordValid = await bcrypt.compare(password, user.Password);
        if (isPasswordValid) {
            return res.status(200).json({ success: true, message: 'Login successful' });
        } else {
            // รหัสผ่านไม่ถูกต้อง
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
    });
});
   

    router_admin.post('/login/callback', async (req, res) => {
        const { code, state } = req.body;
    
        try {
            // แลกเปลี่ยน code กับ access token
            const tokenResponse = await axios.post('https://api.line.me/oauth2/v2.1/token', null, {
                params: {
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: "https://appb17.bd2-cloud.net/AdminPage",
                    client_id: 2006415575,
                    client_secret: 'fea3a835616adf5b21d199186f7b9873', // เพิ่ม ' ' รอบๆ Client Secret
                },
            });
    
            const accessToken = tokenResponse.data.access_token;
    
            // ใช้ access token เพื่อดึงข้อมูลผู้ใช้
            const userResponse = await axios.get('https://api.line.me/v2/profile', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
    
            // เช็คว่ามีข้อมูลผู้ใช้หรือไม่
            if (!userResponse.data || !userResponse.data.displayName) {
                throw new Error('ไม่พบข้อมูลผู้ใช้');
            }
    
            console.log("User response data:", userResponse.data); 
            
            // ส่งข้อมูลผู้ใช้กลับไปยัง frontend
            res.json({
                success: true,
                name: userResponse.data.displayName, // ส่งชื่อผู้ใช้กลับไป
                userId: userResponse.data.userId,
            });
        } catch (error) {
            console.error('Error during callback processing:', error.message);
            res.status(500).json({
                success: false,
                message: error.message || 'เกิดข้อผิดพลาดระหว่างการล็อกอิน',
            });
        }
    });    
    

module.exports = router_admin;