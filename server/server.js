require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors'); // 引入 cors 中間件
const fs = require('fs');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5001;

// 連接 SQLite 數據庫
const dbPath = path.resolve(__dirname, 'db', 'data.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Failed to connect to the database:', err.message);
    } else {
        console.log('Connected to the database.');
    }
});

// 添加 `/api/hierarchy` 路由
app.get('/api/hierarchy', (req, res) => {
    const filePath = path.join(__dirname, 'scripts', 'hierarchy_data.json');
    console.log('Reading JSON file from:', filePath);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            res.status(500).send('Error reading JSON file');
        } else {
            try {
                const jsonData = JSON.parse(data);
                res.json(jsonData);
            } catch (parseErr) {
                console.error('Error parsing JSON:', parseErr);
                res.status(500).send('Error parsing JSON');
            }
        }
    });

});

// API 端點，獲取數據
// app.get('/api/students', (req, res) => {
//     const query = 'SELECT * FROM students';

//     db.all(query, [], (err, rows) => {
//         if (err) {
//             res.status(500).send({ error: err.message });
//             return;
//         }
//         res.json(rows);
//     });
// });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
