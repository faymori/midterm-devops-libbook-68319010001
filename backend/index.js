const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// GET /health - เช็กสถานะของระบบ
app.get('/health', (req, res) => {
  res.json({ status: 'UP', version: '1.0.0' });
});

// 1. GET /api/books (Read All) - ดึงข้อมูลหนังสือทั้งหมด
app.get('/api/books', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET /api/books/:id (Read One) - ดึงข้อมูลหนังสือรายตัวตาม ID
app.get('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. POST /api/books (Create) - เพิ่มหนังสือใหม่เข้าคลัง
app.post('/api/books', async (req, res) => {
  try {
    const { isbn, title, author, category, year, status } = req.body;
    const result = await pool.query(
      'INSERT INTO books (isbn, title, author, category, year, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [isbn, title, author, category, parseInt(year), status || 'พร้อมให้ยืม']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. PUT /api/books/:id (Update) - แก้ไขบันทึกหนังสือผ่านไอดี
app.put('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { isbn, title, author, category, year, status } = req.body;
    const check = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    const result = await pool.query(
      'UPDATE books SET isbn=$1, title=$2, author=$3, category=$4, year=$5, status=$6 WHERE id=$7 RETURNING *',
      [isbn, title, author, category, parseInt(year), status, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. DELETE /api/books/:id (Delete) - ลบประวัติหนังสือ
app.delete('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const check = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    await pool.query('DELETE FROM books WHERE id = $1', [id]);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;