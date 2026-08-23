from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import config

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_name='development'):
    """应用工厂函数"""
    app = Flask(__name__)

    # 加载配置
    app.config.from_object(config[config_name])

    # JWT 配置
    app.config['JWT_SECRET_KEY'] = app.config['SECRET_KEY']
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 86400  # 24小时

    # 初始化扩展
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # 配置 CORS
    CORS(app, origins=app.config['CORS_ORIGINS'])

    # 注册蓝图
    from app.api.main import main_bp
    from app.api.news import news_bp
    from app.api.projects import projects_bp
    from app.api.team import team_bp
    from app.api.contact import contact_bp
    from app.api.notices import notices_bp
    from app.api.events import events_bp
    from app.api.auth import auth_bp
    from app.api.admin import admin_bp

    app.register_blueprint(main_bp, url_prefix='/api')
    app.register_blueprint(news_bp, url_prefix='/api/news')
    app.register_blueprint(projects_bp, url_prefix='/api/projects')
    app.register_blueprint(team_bp, url_prefix='/api/team')
    app.register_blueprint(contact_bp, url_prefix='/api/contact')
    app.register_blueprint(notices_bp, url_prefix='/api/notices')
    app.register_blueprint(events_bp, url_prefix='/api/events')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    # 创建数据库表 & 迁移
    with app.app_context():
        db.create_all()
        # 为已有表添加新字段（兼容旧数据库）
        from sqlalchemy import inspect, text
        inspector = inspect(db.engine)
        if 'team_members' in inspector.get_table_names():
            cols = [c['name'] for c in inspector.get_columns('team_members')]
            if 'bio' not in cols:
                db.session.execute(text('ALTER TABLE team_members ADD COLUMN bio TEXT'))
            if 'achievements' not in cols:
                db.session.execute(text('ALTER TABLE team_members ADD COLUMN achievements TEXT'))
        if 'projects' in inspector.get_table_names():
            proj_cols = [c['name'] for c in inspector.get_columns('projects')]
            proj_new = {
                'abstract': 'TEXT', 'keywords': 'VARCHAR(500)',
                'figure_url': 'VARCHAR(500)', 'figure_caption': 'VARCHAR(500)',
                'publication_info': 'VARCHAR(500)', 'citation': 'TEXT',
                'detail_content': 'TEXT', 'pdf_url': 'VARCHAR(500)',
                'code_url': 'VARCHAR(500)'
            }
            for cname, ctype in proj_new.items():
                if cname not in proj_cols:
                    db.session.execute(text(f'ALTER TABLE projects ADD COLUMN {cname} {ctype}'))
        if 'news' in inspector.get_table_names():
            news_cols = [c['name'] for c in inspector.get_columns('news')]
            if 'image_url' not in news_cols:
                db.session.execute(text('ALTER TABLE news ADD COLUMN image_url VARCHAR(500)'))
            if 'related_project_ids' not in news_cols:
                db.session.execute(text('ALTER TABLE news ADD COLUMN related_project_ids VARCHAR(500)'))
            if 'related_member_ids' not in news_cols:
                db.session.execute(text('ALTER TABLE news ADD COLUMN related_member_ids VARCHAR(500)'))
        if 'projects' in inspector.get_table_names():
            proj_cols = [c['name'] for c in inspector.get_columns('projects')]
            if 'related_member_ids' not in proj_cols:
                db.session.execute(text('ALTER TABLE projects ADD COLUMN related_member_ids VARCHAR(500)'))
            db.session.commit()

    return app
