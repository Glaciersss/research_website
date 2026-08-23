# 艺术与文化智能计算 - 后端 API

基于 Flask 的 RESTful API 后端服务。

## 技术栈

- **框架**: Flask 3.1
- **数据库**: SQLAlchemy (SQLite/PostgreSQL)
- **迁移**: Flask-Migrate
- **跨域**: Flask-CORS

## 项目结构

```
art-culture-backend/
├── app/
│   ├── __init__.py       # 应用工厂
│   ├── models.py         # 数据模型
│   └── api/              # API 蓝图
│       ├── __init__.py
│       ├── main.py       # 根路由
│       ├── news.py       # 新闻 API
│       ├── projects.py   # 学术成果 API
│       ├── team.py       # 团队成员 API
│       └── contact.py    # 联系表单 API
├── config.py             # 配置文件
├── run.py               # 启动文件
├── init_data.py         # 数据初始化脚本
├── requirements.txt     # 依赖列表
└── .env.example         # 环境变量示例
```

## 安装步骤

### 1. 创建虚拟环境

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 2. 安装依赖

```bash
pip install -r requirements.txt
```

### 3. 配置环境变量

```bash
copy .env.example .env
```

编辑 `.env` 文件，设置必要的配置。

### 4. 初始化数据库

```bash
python init_data.py
```

### 5. 启动服务

```bash
python run.py
```

服务将在 http://localhost:5000 启动。

## API 端点

### 基础端点

- `GET /api` - API 信息
- `GET /api/health` - 健康检查

### 新闻相关

- `GET /api/news` - 获取新闻列表
- `GET /api/news/<id>` - 获取新闻详情
- `POST /api/news` - 创建新闻
- `PUT /api/news/<id>` - 更新新闻
- `DELETE /api/news/<id>` - 删除新闻
- `GET /api/news/notices` - 获取通知公告
- `GET /api/news/events` - 获取学术活动

### 学术成果相关

- `GET /api/projects` - 获取学术成果列表
- `GET /api/projects/<id>` - 获取成果详情
- `POST /api/projects` - 创建学术成果

### 团队成员相关

- `GET /api/team` - 获取团队成员列表
- `GET /api/team/<id>` - 获取成员详情
- `POST /api/team` - 添加团队成员

### 联系表单

- `POST /api/contact` - 提交联系表单
- `GET /api/contact/messages` - 获取留言列表

## 数据模型

### News (新闻)
- id, title, content, type, date, created_at, updated_at

### Project (学术成果)
- id, title, description, type, authors, year, link, created_at, updated_at

### TeamMember (团队成员)
- id, name, role, category, research, email, website, avatar, created_at, updated_at

### ContactMessage (联系留言)
- id, name, email, subject, message, is_read, created_at

### Notice (通知公告)
- id, title, link, date, created_at

### Event (学术活动)
- id, title, date, time, location, created_at

## 前端集成

前端项目在 `../art-culture-react/` 目录。

API 基础 URL: `http://localhost:5000/api`
