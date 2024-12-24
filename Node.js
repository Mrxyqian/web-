const express = require('express'); // 导入express库以创建服务器
const mysql = require('mysql');  // 导入mysql库以与MySQL数据库进行交互
const bodyParser = require('body-parser'); // 导入body-parser库以解析请求体
const cors = require('cors'); // 导入cors库以处理跨域资源共享

const bcrypt = require('bcrypt');  // 导入bcrypt库以进行密码哈希
const saltRounds = 10;  // 定义bcrypt哈希的盐轮数

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// 创建与MySQL数据库的连接
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123',
  database: 'webwork'
});

connection.connect();

// 用户注册路由
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // 密码加密
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = { username, password: hashedPassword };
  connection.query('INSERT INTO users SET ?', user, (error, results) => {
    if (error) {
      res.status(500).json({ message: 'Error registering user' });
    } else {
      res.status(200).json({ message: 'User registered' });
    }
  });
});

// 用户登录路由
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  connection.query('SELECT * FROM users WHERE username = ?', [username], async (error, results) => {
    if (error) {
      res.status(500).json({ message: 'Error during login' });
    } else if (results.length === 0) {
      res.status(401).json({ message: 'User not found' });
    } else {
      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        res.status(200).json({ message: 'Login successful' });
      } else {
        res.status(401).json({ message: 'Incorrect password' });
      }
    }
  });
});


app.post('/post-comment', (req, res) => {
  const { username, content } = req.body;
  const comment = { user: username, content: content, create_time: new Date() };

  connection.query('INSERT INTO comments SET ?', comment, (error, results) => {
    if (error) {
      res.status(500).send('Error posting comment');
    } else {
      res.status(200).send('Comment posted');
    }
  });
});

app.get('/get-comments', (req, res) => {
  connection.query('SELECT * FROM comments ORDER BY create_time DESC', (error, results) => {
    if (error) {
      res.status(500).send('Error fetching comments');
    } else {
      res.status(200).json(results);
    }
  });
});

app.delete('/delete-comment/:id', (req, res) => {
  const commentId = req.params.id;
  connection.query('DELETE FROM comments WHERE id = ?', [commentId], (error, results) => {
    if (error) {
      res.status(500).send('Error deleting comment');
    } else {
      res.status(200).send('Comment deleted');
    }
  });
});

app.put('/edit-comment/:id', (req, res) => {
  const commentId = req.params.id;
  const newContent = req.body.content;
  connection.query('UPDATE comments SET content = ? WHERE id = ?', [newContent, commentId], (error, results) => {
    if (error) {
      res.status(500).send('Error editing comment');
    } else {
      res.status(200).send('Comment edited');
    }
  });
});

app.get('/search-comments/:username', (req, res) => {
  const username = req.params.username;
  connection.query('SELECT * FROM comments WHERE user = ? ORDER BY create_time DESC', [username], (error, results) => {
    if (error) {
      res.status(500).send('Error searching comments');
    } else {
      res.status(200).json(results);
    }
  });
});

// 监听端口5500
app.listen(5500, () => {
  console.log('Server is running on port 5500');
});
