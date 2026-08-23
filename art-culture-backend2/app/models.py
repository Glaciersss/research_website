from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app import db


class Admin(db.Model):
    """管理员用户模型"""
    __tablename__ = 'admins'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(120), unique=True)
    name = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        """设置密码哈希"""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """验证密码"""
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'name': self.name,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class News(db.Model):
    """新闻模型"""
    __tablename__ = 'news'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(50), default='投稿日历')
    date = db.Column(db.Date, default=datetime.utcnow)
    image_url = db.Column(db.String(500))
    related_project_ids = db.Column(db.String(500))
    related_member_ids = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'type': self.type,
            'date': self.date.isoformat() if self.date else None,
            'image_url': self.image_url,
            'related_project_ids': self.related_project_ids,
            'related_member_ids': self.related_member_ids,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Project(db.Model):
    """学术成果/项目模型"""
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(50), nullable=False)  # publication, project, teaching
    authors = db.Column(db.String(500))
    year = db.Column(db.Integer)
    link = db.Column(db.String(500))
    abstract = db.Column(db.Text)
    keywords = db.Column(db.String(500))
    figure_url = db.Column(db.String(500))
    figure_caption = db.Column(db.String(500))
    publication_info = db.Column(db.String(500))
    pdf_url = db.Column(db.String(500))
    code_url = db.Column(db.String(500))
    citation = db.Column(db.Text)
    detail_content = db.Column(db.Text)
    related_member_ids = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'type': self.type,
            'authors': self.authors,
            'year': self.year,
            'link': self.link,
            'abstract': self.abstract,
            'keywords': self.keywords,
            'figure_url': self.figure_url,
            'figure_caption': self.figure_caption,
            'publication_info': self.publication_info,
            'pdf_url': self.pdf_url,
            'code_url': self.code_url,
            'citation': self.citation,
            'detail_content': self.detail_content,
            'related_member_ids': self.related_member_ids,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class TeamMember(db.Model):
    """团队成员模型"""
    __tablename__ = 'team_members'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(50), nullable=False)  # 教授, 博士研究生, 硕士研究生
    category = db.Column(db.String(50), nullable=False)  # faculty, researcher, student
    research = db.Column(db.String(200))
    email = db.Column(db.String(100))
    website = db.Column(db.String(200))
    avatar = db.Column(db.String(200))
    bio = db.Column(db.Text)
    achievements = db.Column(db.Text)
    sort_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'role': self.role,
            'category': self.category,
            'research': self.research,
            'email': self.email,
            'website': self.website,
            'avatar': self.avatar,
            'bio': self.bio,
            'achievements': self.achievements,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class ContactMessage(db.Model):
    """联系留言模型"""
    __tablename__ = 'contact_messages'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'subject': self.subject,
            'message': self.message,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Notice(db.Model):
    """通知公告模型"""
    __tablename__ = 'notices'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    link = db.Column(db.String(200))
    date = db.Column(db.Date, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'link': self.link,
            'date': self.date.isoformat() if self.date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class SiteSetting(db.Model):
    """站点设置键值存储"""
    __tablename__ = 'site_settings'

    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(100), unique=True, nullable=False)
    value = db.Column(db.Text)

    def to_dict(self):
        return {
            'id': self.id,
            'key': self.key,
            'value': self.value
        }


class Event(db.Model):
    """投稿日历模型"""
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.String(50))
    location = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'date': self.date.isoformat() if self.date else None,
            'time': self.time,
            'location': self.location,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
