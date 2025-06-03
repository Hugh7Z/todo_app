const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'your-secret-key'; // 在实际生产环境中应该使用环境变量

// 错误处理中间件
process.on('uncaughtException', (err) => {
  console.error('未捕获的异常:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('未处理的Promise拒绝:', err);
});

// 中间件
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// 内存数据存储（实际项目中应该使用数据库）
let users = [];
let todos = [];

// 测试路由
app.get('/', (req, res) => {
  console.log('收到根路由请求');
  res.json({ message: '服务器运行正常' });
});

// 中间件：验证token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: '未提供认证令牌' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: '无效的认证令牌' });
    }
    req.user = user;
    next();
  });
};

// 注册接口
app.post('/login', async (req, res) => {
  console.log('收到注册请求:', req.body);
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      console.log('注册失败: 用户名或密码为空');
      return res.status(400).json({ success: false, message: '用户名和密码不能为空' });
    }

    if (users.find(u => u.username === username)) {
      console.log('注册失败: 用户名已存在');
      return res.status(400).json({ success: false, message: '用户名已存在' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now().toString(),
      username,
      password: hashedPassword
    };

    users.push(newUser);
    console.log('注册成功:', { id: newUser.id, username: newUser.username });
    res.json({ success: true, message: '注册成功' });
  } catch (error) {
    console.error('注册过程出错:', error);
    res.status(500).json({ success: false, message: '注册失败，请稍后再试' });
  }
});

// 登录接口
app.post('/sign', async (req, res) => {
  console.log('收到登录请求:', req.body);
  try {
    const { username, password } = req.body;
    
    const user = users.find(u => u.username === username);
    if (!user) {
      console.log('登录失败: 用户不存在');
      return res.status(404).json({ success: false, message: '用户不存在' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log('登录失败: 密码错误');
      return res.status(401).json({ success: false, message: '密码错误' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
    console.log('登录成功:', { id: user.id, username: user.username });
    res.json({
      success: true,
      code: 200,
      token,
      userData: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('登录过程出错:', error);
    res.status(500).json({ success: false, message: '登录失败，请稍后再试' });
  }
});

// 获取待办事项列表
app.get('/get_list', authenticateToken, (req, res) => {
  const userTodos = todos.filter(todo => todo.userId === req.user.id);
  res.json({ list: userTodos });
});

// 添加待办事项
app.post('/add_list', authenticateToken, (req, res) => {
  const { value } = req.body;
  
  if (!value || value.trim() === '') {
    return res.status(400).json({ success: false, message: '待办事项内容不能为空' });
  }

  const newTodo = {
    id: Date.now().toString(),
    value,
    isComplete: false,
    userId: req.user.id
  };

  todos.push(newTodo);
  res.json({ success: true, message: '添加成功' });
});

// 更新待办事项状态
app.post('/update_list', authenticateToken, (req, res) => {
  const { id, isComplete } = req.body;
  
  const todo = todos.find(t => t.id === id && t.userId === req.user.id);
  if (!todo) {
    return res.status(404).json({ success: false, message: '待办事项不存在' });
  }

  todo.isComplete = isComplete;
  res.json({ success: true, message: '更新成功' });
});

// 删除待办事项
app.post('/del_list', authenticateToken, (req, res) => {
  const { id } = req.body;
  
  const index = todos.findIndex(t => t.id === id && t.userId === req.user.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: '待办事项不存在' });
  }

  todos.splice(index, 1);
  res.json({ success: true, message: '删除成功' });
});

// 404处理
app.use((req, res) => {
  console.log('404 Not Found:', req.method, req.url);
  res.status(404).json({ success: false, message: '接口不存在' });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({ success: false, message: '服务器内部错误' });
});

// 启动服务器
const server = app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('收到 SIGTERM 信号，准备关闭服务器');
  server.close(() => {
    console.log('服务器已关闭');
    process.exit(0);
  });
}); 