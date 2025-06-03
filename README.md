# Todo App

一个基于Vue 3和Express的待办事项管理应用。

## 功能特点

- 用户注册和登录
- 待办事项的增删改查
- 实时状态更新
- 响应式设计
- JWT认证

## 技术栈

### 前端
- Vue 3
- Vue Router
- Axios
- Vite

### 后端
- Node.js
- Express
- JWT
- bcryptjs

## 项目结构

```
Todo-App/
├── src/                # 前端源代码
│   ├── components/     # Vue组件
│   ├── config/        # 配置文件
│   ├── utils/         # 工具函数
│   └── App.vue        # 根组件
├── server/            # 后端源代码
│   └── index.js       # 服务器入口文件
└── package.json       # 项目依赖配置
```

## 快速开始

### 前端开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 后端开发

```bash
# 进入server目录
cd server

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## API文档

详细的API文档请参考 [API.md](./API.md)

## 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0

## 开发进度

请参考 [PROGRESS.md](./PROGRESS.md) 