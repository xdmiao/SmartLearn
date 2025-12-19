
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3002; // 修改端口为 3002，避免 3001 冲突

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Configuration
// 注意：请根据您的本地 MySQL 配置修改 user 和 password
const dbConfig = {
  host: 'localhost',
  user: 'root',      
  password: '',      
  database: 'smart_learn',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Test Connection on Start
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ 数据库连接失败:', err.message);
    console.error('👉 请确保 MySQL 已启动，并检查 server/index.js 中的用户名和密码是否正确。');
    console.error('👉 请确保已运行 server/schema.sql 初始化数据库。');
  } else {
    console.log('✅ 成功连接到 MySQL 数据库');
    connection.release();
  }
});

// Helper to execute queries
const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// API Routes

// 1. Get all mastered IDs
app.get('/api/mastery', async (req, res) => {
  try {
    const results = await query('SELECT question_id FROM mastered_questions');
    const ids = results.map(row => row.question_id);
    res.json(ids);
  } catch (err) {
    console.error('Query Error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 2. Add mastery
app.post('/api/mastery/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await query('INSERT IGNORE INTO mastered_questions (question_id) VALUES (?)', [id]);
    res.json({ success: true, id });
  } catch (err) {
    console.error('Insert Error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 3. Remove mastery
app.delete('/api/mastery/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM mastered_questions WHERE question_id = ?', [id]);
    res.json({ success: true, id });
  } catch (err) {
    console.error('Delete Error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 后端服务器运行在 http://localhost:${PORT}`);
});
