const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ==========================================
// 🛠️ 1. API Setup Database (อัปเดตใหม่)
// ==========================================
router.get('/setup-db', async (req, res) => {
    try {
        await db.query(`CREATE DATABASE IF NOT EXISTS tripsync_db;`);
        await db.query(`USE tripsync_db;`);

        // ตาราง Users (เพิ่มใหม่)
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'user'
            )
        `);

        // สร้างไอดี Admin อัตโนมัติ (รหัส: admin123)
        await db.query(`INSERT IGNORE INTO users (username, password, role) VALUES ('admin', 'admin123', 'admin')`);

        await db.query(`
            CREATE TABLE IF NOT EXISTS trips (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                stock INT NOT NULL
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                trip_id INT,
                user_name VARCHAR(255) NOT NULL,
                booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (trip_id) REFERENCES trips(id)
            )
        `);

        // ตาราง Blogs (เพิ่มคอลัมน์ image เป็น LONGTEXT)
        await db.query(`
            CREATE TABLE IF NOT EXISTS blogs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                image LONGTEXT
            )
        `);

        res.json({ status: 'success', message: '🎉 สร้างตารางทั้งหมดสำเร็จ! (มีไอดี admin/admin123 แล้ว)' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 🔐 2. API สำหรับ Login และ สมัครสมาชิก
// ==========================================
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
        res.json({ status: 'success', message: 'สมัครสมาชิกสำเร็จ! เข้าสู่ระบบได้เลย' });
    } catch (err) {
        res.status(400).json({ error: 'ชื่อผู้ใช้นี้อาจมีคนใช้แล้ว' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
        if (users.length > 0) {
            // ส่งข้อมูลกลับไปบอกว่าคนนี้เป็น user หรือ admin
            res.json({ status: 'success', username: users[0].username, role: users[0].role });
        } else {
            res.status(401).json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 📝 3. API Blog (อัปเดตให้รองรับรูปภาพ)
// ==========================================
router.post('/blogs', async (req, res) => {
    const { title, content, image } = req.body;
    try {
        await db.query('INSERT INTO blogs (title, content, image) VALUES (?, ?, ?)', [title, content, image]);
        res.json({ status: 'success', message: '📝 โพสต์บล็อกพร้อมรูปภาพสำเร็จ!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/blogs', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM blogs ORDER BY id DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// *** API Trips และ Bookings ใช้ของเดิมได้เลยค่ะ ไม่ต้องแก้ ***
router.get('/trips', async (req, res) => {
    try { const [rows] = await db.query('SELECT * FROM trips'); res.json(rows); } 
    catch (err) { res.status(500).json({ error: err.message }); }
});
router.post('/trips', async (req, res) => {
    const { title, price, stock } = req.body;
    try {
        await db.query('INSERT INTO trips (title, price, stock) VALUES (?, ?, ?)', [title, price, stock]);
        res.json({ status: 'success', message: 'เพิ่มทริปสำเร็จ!' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});
router.post('/bookings', async (req, res) => {
    const { trip_id, user_name } = req.body;
    try {
        await db.query('INSERT INTO bookings (trip_id, user_name) VALUES (?, ?)', [trip_id, user_name]);
        res.json({ status: 'success', message: `คุณ ${user_name} จองทริปสำเร็จแล้ว!` });
    } catch (err) { res.status(500).json({ error: err.message }); }
});
router.get('/bookings', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT bookings.id, bookings.user_name, trips.title AS trip_name, bookings.booking_date 
            FROM bookings JOIN trips ON bookings.trip_id = trips.id ORDER BY bookings.id DESC
        `);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;