CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    isbn VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    status VARCHAR(50) DEFAULT 'พร้อมให้ยืม'
);

-- เพิ่มข้อมูลตัวอย่างเริ่มต้น
INSERT INTO books (isbn, title, author, category, year, status) VALUES 
('978-616-08-4123-2', 'DevOps Handbooks', 'Gene Kim', 'Technology', 2021, 'พร้อมให้ยืม'),
('978-616-08-9999-9', 'Clean Code', 'Robert C. Martin', 'Software', 2008, 'พร้อมให้ยืม')
ON CONFLICT DO NOTHING;