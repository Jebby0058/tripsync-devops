const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// ดึงไฟล์ API ของเราเข้ามา
const apiRoutes = require('./routes/api');

// เปิดใช้งาน Middleware
app.use(cors()); // อนุญาตให้หน้าเว็บ (Frontend) ดึงข้อมูลข้ามโดเมนได้

// 🌟 ตั้งค่าให้ API รับข้อมูลเป็น JSON และรับขนาดไฟล์ได้สูงสุด 10MB (รวมไว้ตรงนี้เลย)
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(express.static('public')); // อนุญาตให้ดึงไฟล์ HTML จากโฟลเดอร์ public

// บอกให้ Express รู้ว่าถ้ามีคนเรียก /api ให้ไปดูที่ไฟล์ routes/api.js
app.use('/api', apiRoutes);

// สตาร์ทเซิร์ฟเวอร์
app.listen(port, () => {
    console.log(`🚀 TripSync Server is running on http://localhost:${port}`);
});