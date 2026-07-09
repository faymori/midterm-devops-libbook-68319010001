const request = require('supertest');
const app = require('../index');
const pool = require('../db');

// ปิดการเชื่อมต่อ Database หลังจากทดสอบเสร็จทั้งหมดเพื่อไม่ให้ Jest ค้าง
afterAll(async () => {
  await pool.end();
});

describe('Library API Tests', () => {
  
  // Test 1: ทดสอบเส้น Health Check
  it('GET /health should return status UP', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'UP');
  });

  // Test 2: ทดสอบดึงข้อมูลหนังสือทั้งหมด (ต้องส่งกลับมาเป็น Array)
  it('GET /api/books should return a list of books', async () => {
    const res = await request(app).get('/api/books');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Test 3: ทดสอบกรณีหา ID หนังสือไม่เจอ (ต้องตอบกลับเป็น 404 ตามเกณฑ์)
  it('GET /api/books/999999 should return 404', async () => {
    const res = await request(app).get('/api/books/999999');
    expect(res.statusCode).toEqual(404);
  });
});