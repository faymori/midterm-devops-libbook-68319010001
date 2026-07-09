# 📚 ระบบบันทึกข้อมูลหนังสือห้องสมุด (LibBook) - มิดเทอม DevOps

## 👤 ข้อมูลผู้พัฒนา
* **ชื่อ-นามสกุล:** กฤติน พิมศิริ 
* **รหัสประจำตัวนักศึกษา:** 68319010001
* **วิชา:** DevOps / Mini-Project มิดเทอม

---

## 🌐 ลิงก์คลังสินค้าออนไลน์ (Docker Hub Repositories)
* **🐳 Backend Image:** [faymori/libbook-api](https://hub.docker.com/r/faymori/libbook-api)
* **🐳 Frontend Image:** [faymori/libbook-web](https://hub.docker.com/r/faymori/libbook-web)

---

## ⚙️ ข้อมูลสถาปัตยกรรมระบบ (System Architecture)
ระบบนี้พัฒนาในรูปแบบ **Full-Stack Application** แยกส่วนการทำงานชัดเจน (Decoupled Architecture) และทดสอบระบบผ่านระบบอัตโนมัติ (CI/CD Pipeline):
* **Frontend:** พัฒนาด้วยเทคโนโลยีเว็บสมัยใหม่ เชื่อมต่อสื่อสารผ่าน REST API
* **Backend:** Node.js (Express) จัดการ Logic ของระบบและ API Routing
* **Database:** PostgreSQL 15 (Alpine) สำหรับจัดเก็บข้อมูลหนังสืออย่างปลอดภัย
* **Automated CI/CD:** ใช้ GitHub Actions ในการตรวจจับความถูกต้องของโค้ด (ESLint), รัน Unit Test (Jest) และบิลด์อัปโหลดขึ้น Docker Hub เมื่อมีการ Push โค้ดเข้าสู่บรานช์ `develop`

---

## 📊 ตารางสรุปรายการระบบ API (API Documentation)

| Method | Endpoint | Description | Request Body (JSON) | Response Status |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/books` | ดึงข้อมูลรายการหนังสือทั้งหมดที่มีในระบบ | - | `200 OK` |
| **POST** | `/api/books` | เพิ่มข้อมูลหนังสือเล่มใหม่เข้าสู่ระบบ | `{"title": "string", "author": "string", "isbn": "string"}` | `201 Created` |

---

## 🚀 วิธีการรันระบบ (How to Run the Application)

### 🔹 แบบที่ 1: การรันผ่าน Docker Compose
1. ตรวจสอบให้มั่นใจว่าเครื่องของคุณเปิดโปรแกรม **Docker Desktop** อยู่
2. เปิด Terminal ในโฟลเดอร์ที่มีไฟล์ `docker-compose.yml` แล้วพิมพ์คำสั่ง:
   ```bash
   docker compose up -d