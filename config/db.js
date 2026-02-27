const mysql = require('mysql2/promise');
require('dotenv').config();

// สร้าง Connection Pool (ให้มันจัดการคิวการเชื่อมต่อให้อัตโนมัติ)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ทดสอบการเชื่อมต่อตอนสตาร์ทเซิร์ฟเวอร์
pool.getConnection()
    .then(connection => {
        console.log('✅ Connected to MySQL/RDS successfully!');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Error connecting to the database:', err.message);
    });

module.exports = pool;