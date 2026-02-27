# ✈️ TripSync - Scalable Web App with CI/CD & Auto-Scaling

โปรเจกต์ "Deploy & Scale Me Up!" สอดคล้องกับโจทย์การพัฒนาระบบ DevOps สำหรับแอปพลิเคชันอย่างง่าย พร้อมติดตั้งระบบ CI/CD และการ Auto-Scale บน Kubernetes

## 🏗️ Part 1: Architecture & Application
TripSync เป็นระบบจองทริปท่องเที่ยวและเขียนบล็อกรีวิว โดยใช้สถาปัตยกรรมแบบ Decoupled Microservices:
* **Frontend:** HTML, CSS (Bootstrap 5), JavaScript (Vanilla) ทำหน้าที่แสดงผล UI และเชื่อมต่อ API
* **Backend:** Node.js & Express.js ทำหน้าที่จัดการ Business Logic (RESTful API)
* **Database:** Amazon RDS (MySQL) ทำหน้าที่จัดเก็บข้อมูล (Users, Trips, Bookings, Blogs)

---
Arichitecture
<img width="1018" height="712" alt="Screenshot 2026-02-28 032252" src="https://github.com/user-attachments/assets/d145b417-7fe9-4b4b-8d02-96952477ac13" />

CI/CD
<img width="1881" height="508" alt="Screenshot 2026-02-28 031703" src="https://github.com/user-attachments/assets/20a13d88-0a3b-4a50-aaa5-d396e0ef9358" />


## 📂 Project Structure
```text
TRIPSYNC/
│
├── config/
│   └── db.js                 # ตั้งค่าการเชื่อมต่อ Amazon RDS
├── public/
│   └── index.html            # หน้าเว็บ Frontend (UI)
├── routes/
│   └── api.js                # API Routes สำหรับระบบจองและบล็อก
├── .github/workflows/
│   └── ci-cd.yml             # ไฟล์ GitHub Actions Pipeline
├── k8s/                     
│   ├── deployment.yaml
│   ├── service.yaml
│   └── hpa.yaml
├── load-test/             
│   └── script.k6.js
├── Dockerfile                # ไฟล์สำหรับ Build Docker Image
├── index.js                  # ไฟล์หลักของเซิร์ฟเวอร์ Node.js
├── package.json              # รายการ Dependencies
└── README.md                 # เอกสารอธิบายโปรเจกต์
