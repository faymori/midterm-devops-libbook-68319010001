const API_URL = '/api/books'; // ลิงก์ยิงหา API (จัดการผ่าน Nginx Reverse Proxy ตอนขึ้น Docker)

const bookForm = document.getElementById('bookForm');
const bookIdInput = document.getElementById('bookId');
const isbnInput = document.getElementById('isbn');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const categoryInput = document.getElementById('category');
const yearInput = document.getElementById('year');
const statusInput = document.getElementById('status');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');
const bookList = document.getElementById('bookList');
const formTitle = document.getElementById('formTitle');

// 1. GET ALL: เรียกดูหนังสือทั้งหมด
async function fetchBooks() {
    try {
        const res = await fetch(API_URL);
        const books = await res.json();
        renderBooks(books);
    } catch (err) {
        console.error('Error fetching books:', err);
    }
}

function renderBooks(books) {
    bookList.innerHTML = '';
    if (books.length === 0) {
        bookList.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-gray-500">ไม่มีข้อมูลหนังสือในระบบ</td></tr>`;
        return;
    }

    books.forEach(book => {
        let statusColor = 'text-green-600 bg-green-50';
        if (book.status === 'ถูกยืม') statusColor = 'text-yellow-600 bg-yellow-50';
        if (book.status === 'ชำรุด') statusColor = 'text-red-600 bg-red-50';

        const tr = document.createElement('tr');
        tr.className = 'border-b hover:bg-gray-50';
        tr.innerHTML = `
            <td class="p-3 text-sm">${book.isbn}</td>
            <td class="p-3 text-sm font-medium">${book.title}</td>
            <td class="p-3 text-sm text-gray-600">${book.author} (${book.year})</td>
            <td class="p-3 text-sm">${book.category}</td>
            <td class="p-3 text-sm"><span class="px-2 py-1 rounded text-xs font-bold ${statusColor}">${book.status}</span></td>
            <td class="p-3 text-sm text-center flex justify-center gap-2">
                <button onclick="editBook(${book.id}, '${book.isbn}', '${escapeHtml(book.title)}', '${escapeHtml(book.author)}', '${escapeHtml(book.category)}', ${book.year}, '${book.status}')" class="text-blue-600 hover:underline">แก้ไข</button>
                <button onclick="deleteBook(${book.id})" class="text-red-600 hover:underline">ลบ</button>
            </td>
        `;
        bookList.appendChild(tr);
    });
}

// 2. CREATE & UPDATE: ฟังก์ชันบันทึกข้อมูล
bookForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = bookIdInput.value;
    const bookData = {
        isbn: isbnInput.value,
        title: titleInput.value,
        author: authorInput.value,
        category: categoryInput.value,
        year: yearInput.value,
        status: statusInput.value
    };

    try {
        if (id) {
            // ส่ง PUT ไปแก้ไข
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookData)
            });
        } else {
            // ส่ง POST ไปเพิ่มใหม่
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookData)
            });
        }
        resetForm();
        fetchBooks();
    } catch (err) {
        console.error('Error saving book:', err);
    }
});

function editBook(id, isbn, title, author, category, year, status) {
    bookIdInput.value = id;
    isbnInput.value = isbn;
    titleInput.value = title;
    authorInput.value = author;
    categoryInput.value = category;
    yearInput.value = year;
    statusInput.value = status;

    formTitle.innerText = 'แก้ไขข้อมูลหนังสือ';
    saveBtn.innerText = 'อัปเดตข้อมูล';
    cancelBtn.classList.remove('hidden');
}

cancelBtn.addEventListener('click', resetForm);

function resetForm() {
    bookForm.reset();
    bookIdInput.value = '';
    formTitle.innerText = 'เพิ่มรายการหนังสือใหม่';
    saveBtn.innerText = 'บันทึกข้อมูล';
    cancelBtn.classList.add('hidden');
}

// 3. DELETE: ลบข้อมูลหนังสือ
async function deleteBook(id) {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบรายการหนังสือนี้?')) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            fetchBooks();
        } catch (err) {
            console.error('Error deleting book:', err);
        }
    }
}

function escapeHtml(str) {
    return str.replace(/'/g, "\\'");
}

fetchBooks();