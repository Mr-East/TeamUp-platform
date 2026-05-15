# TeamUp Platform - 校园竞赛组队平台

![GitHub repo size](https://img.shields.io/github/repo-size/Mr-East/TeamUp-platform)
![GitHub license](https://img.shields.io/github/license/Mr-East/TeamUp-platform)

TeamUp Platform 是一个面向大学生的竞赛组队平台，旨在帮助学生快速找到志同道合的队友，组队参加各类学术竞赛。

## 📋 目录

- [项目简介](#项目简介)
- [技术栈](#技术栈)
- [功能特性](#功能特性)
- [项目结构](#项目结构)
- [环境要求](#环境要求)
- [快速开始](#快速开始)
  - [后端服务](#后端服务)
  - [前端项目](#前端项目)
  - [管理后台](#管理后台)
- [API接口](#api接口)
- [数据库结构](#数据库结构)
- [开发说明](#开发说明)
- [许可证](#许可证)

## 📝 项目简介

TeamUp Platform 是一个专为大学生设计的竞赛组队平台，主要功能包括：
- 发布竞赛招募信息
- 寻找队友或团队
- 人才广场展示个人技能
- 消息私信沟通
- 组队申请管理

## 🛠️ 技术栈

### 前端
- **框架**: UniApp
- **语言**: Vue 3 + JavaScript
- **平台**: 微信小程序

### 后端
- **框架**: Express.js
- **语言**: Node.js
- **数据库**: MySQL + Sequelize ORM
- **认证**: JWT
- **文件上传**: Multer

### 管理后台
- **框架**: Vue 3 + Vite
- **UI**: 原生组件

## ✨ 功能特性

### 用户功能
- ✅ 用户注册与登录
- ✅ 个人信息管理
- ✅ 技能标签设置
- ✅ 头像上传

### 竞赛广场
- ✅ 招募信息列表展示
- ✅ 搜索与筛选
- ✅ 招募详情查看
- ✅ 发布招募需求（找队友/求组队）

### 人才广场
- ✅ 人才卡片展示
- ✅ 技能匹配搜索
- ✅ 查看个人主页

### 消息系统
- ✅ 私信聊天
- ✅ 通知中心
- ✅ 组队申请管理

## 📁 项目结构

```
TeamUp-platform/
├── components/           # 公共组件
│   └── TalentCard/      # 人才卡片组件
├── pages/               # 小程序页面
│   ├── login/           # 登录页
│   ├── register/        # 注册页
│   ├── index/           # 首页
│   ├── square/          # 竞赛广场
│   ├── message/         # 消息中心
│   ├── chat/            # 私信聊天
│   ├── profile/         # 个人中心
│   ├── publish/         # 发布页面
│   ├── invites/         # 通知与申请
│   └── personInfo/      # 个人主页
├── server/              # 后端服务
│   ├── app/
│   │   ├── config/      # 配置文件
│   │   ├── controllers/ # 控制器
│   │   ├── middleware/  # 中间件
│   │   ├── models/      # 数据模型
│   │   ├── routes/      # 路由
│   │   ├── services/    # 业务逻辑
│   │   └── utils/       # 工具函数
│   ├── uploads/         # 上传文件存储
│   └── index.js         # 服务入口
├── web/                 # 管理后台
│   └── src/             # 后台源码
├── static/              # 静态资源
├── unpackage/           # 构建产物
├── App.vue              # 小程序入口组件
├── main.js              # 小程序入口文件
├── pages.json           # 页面路由配置
└── manifest.json        # 应用配置
```

## 📦 环境要求

- **Node.js**: >= 18.x
- **MySQL**: >= 8.0
- **微信开发者工具**: 最新版本

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/Mr-East/TeamUp-platform.git
cd TeamUp-platform
```

### 2. 后端服务配置

```bash
cd server
npm install
```

创建 `.env` 文件：

```env
# 服务器配置
PORT=3000
NODE_ENV=development

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=academic_pulse
DB_USER=root
DB_PASSWORD=your_password

# JWT配置
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
JWT_REFRESH_EXPIRES_IN=30d

# 密码加密配置
BCRYPT_SALT_ROUNDS=10
```

启动服务：

```bash
node index.js
```

### 3. 前端项目运行

使用微信开发者工具打开项目根目录，配置小程序 AppID 后即可预览。

### 4. 管理后台

```bash
cd web
npm install
npm run dev
```

访问 http://localhost:5173 查看管理后台。


