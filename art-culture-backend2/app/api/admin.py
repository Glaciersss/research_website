import os
import uuid
from datetime import datetime
from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from app import db
from app.models import News, Project, TeamMember, Notice, Event, Admin, ContactMessage, SiteSetting
from app.utils.decorators import admin_required

admin_bp = Blueprint('admin', __name__)

# 允许的图片和PDF格式
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'pdf'}
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB


def allowed_file(filename):
    """检查文件扩展名是否允许"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def save_uploaded_file(file, folder='uploads'):
    """保存上传的文件"""
    if file and allowed_file(file.filename):
        # 从原始文件名取扩展名（secure_filename 可能损坏中文文件名）
        file_extension = file.filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4().hex}.{file_extension}"

        upload_folder = os.path.join(current_app.root_path, 'static', folder)
        os.makedirs(upload_folder, exist_ok=True)

        filepath = os.path.join(upload_folder, unique_filename)
        file.save(filepath)

        return f"/static/{folder}/{unique_filename}"

    return None


# ==================== 新闻管理 ====================

@admin_bp.route('/news', methods=['GET'])
@jwt_required()
def get_all_news():
    """获取所有新闻（分页）"""
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)

    pagination = News.query.order_by(News.date.desc()).paginate(
        page=page, per_page=limit, error_out=False
    )

    return jsonify({
        'items': [item.to_dict() for item in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page
    })


@admin_bp.route('/news/<int:id>', methods=['GET'])
@jwt_required()
def get_news_detail(id):
    """获取新闻详情"""
    news = News.query.get_or_404(id)
    return jsonify(news.to_dict())


@admin_bp.route('/news', methods=['POST'])
@jwt_required()
def create_news():
    """创建新闻"""
    data = request.get_json()

    news = News(
        title=data.get('title'),
        content=data.get('content'),
        type=data.get('type', '投稿日历'),
        date=datetime.strptime(data.get('date'), '%Y-%m-%d').date() if data.get('date') else datetime.utcnow().date(),
        image_url=data.get('image_url'),
        related_project_ids=data.get('related_project_ids'),
        related_member_ids=data.get('related_member_ids')
    )

    db.session.add(news)
    db.session.commit()

    return jsonify({
        'message': '新闻创建成功',
        'data': news.to_dict()
    }), 201


@admin_bp.route('/news/<int:id>', methods=['PUT'])
@jwt_required()
def update_news(id):
    """更新新闻"""
    news = News.query.get_or_404(id)
    data = request.get_json()

    news.title = data.get('title', news.title)
    news.content = data.get('content', news.content)
    news.type = data.get('type', news.type)
    news.image_url = data.get('image_url', news.image_url)
    news.related_project_ids = data.get('related_project_ids', news.related_project_ids)
    news.related_member_ids = data.get('related_member_ids', news.related_member_ids)

    if data.get('date'):
        news.date = datetime.strptime(data['date'], '%Y-%m-%d').date()

    db.session.commit()

    return jsonify({
        'message': '新闻更新成功',
        'data': news.to_dict()
    })


@admin_bp.route('/news/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_news(id):
    """删除新闻"""
    news = News.query.get_or_404(id)
    db.session.delete(news)
    db.session.commit()

    return jsonify({'message': '新闻删除成功'})


# ==================== 学术成果管理 ====================

@admin_bp.route('/projects', methods=['GET'])
@jwt_required()
def get_all_projects():
    """获取所有学术成果"""
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)

    pagination = Project.query.order_by(Project.year.desc().nullslast(), Project.created_at.desc()).paginate(
        page=page, per_page=limit, error_out=False
    )

    return jsonify({
        'items': [item.to_dict() for item in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page
    })


@admin_bp.route('/projects/<int:id>', methods=['GET'])
@jwt_required()
def get_project_detail(id):
    """获取学术成果详情"""
    project = Project.query.get_or_404(id)
    return jsonify(project.to_dict())


@admin_bp.route('/projects', methods=['POST'])
@jwt_required()
def create_project():
    """创建学术成果"""
    data = request.get_json()

    project = Project(
        title=data.get('title'),
        description=data.get('description'),
        type=data.get('type'),
        authors=data.get('authors'),
        year=data.get('year'),
        link=data.get('link'),
        abstract=data.get('abstract'),
        keywords=data.get('keywords'),
        figure_url=data.get('figure_url'),
        figure_caption=data.get('figure_caption'),
        publication_info=data.get('publication_info'),
        citation=data.get('citation'),
        detail_content=data.get('detail_content'),
        related_member_ids=data.get('related_member_ids'),
        pdf_url=data.get('pdf_url'),
        code_url=data.get('code_url')
    )

    db.session.add(project)
    db.session.commit()

    return jsonify({
        'message': '学术成果创建成功',
        'data': project.to_dict()
    }), 201


@admin_bp.route('/projects/<int:id>', methods=['PUT'])
@jwt_required()
def update_project(id):
    """更新学术成果"""
    project = Project.query.get_or_404(id)
    data = request.get_json()

    project.title = data.get('title', project.title)
    project.description = data.get('description', project.description)
    project.type = data.get('type', project.type)
    project.authors = data.get('authors', project.authors)
    project.year = data.get('year', project.year)
    project.link = data.get('link', project.link)
    project.abstract = data.get('abstract', project.abstract)
    project.keywords = data.get('keywords', project.keywords)
    project.figure_url = data.get('figure_url', project.figure_url)
    project.figure_caption = data.get('figure_caption', project.figure_caption)
    project.publication_info = data.get('publication_info', project.publication_info)
    project.citation = data.get('citation', project.citation)
    project.detail_content = data.get('detail_content', project.detail_content)
    project.related_member_ids = data.get('related_member_ids', project.related_member_ids)
    project.pdf_url = data.get('pdf_url', project.pdf_url)
    project.code_url = data.get('code_url', project.code_url)

    db.session.commit()

    return jsonify({
        'message': '学术成果更新成功',
        'data': project.to_dict()
    })


@admin_bp.route('/projects/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_project(id):
    """删除学术成果"""
    project = Project.query.get_or_404(id)
    db.session.delete(project)
    db.session.commit()

    return jsonify({'message': '学术成果删除成功'})


# ==================== 团队成员管理 ====================

@admin_bp.route('/team', methods=['GET'])
@jwt_required()
def get_all_team_members():
    """获取所有团队成员，按角色层级排序"""
    from sqlalchemy import case
    role_sort = case(
        {'教授': 1, '助理教授': 2, '讲师': 3, '特聘研究员': 4, '研究员': 5, '助理研究员': 6, '博士研究生': 7, '硕士研究生': 8, '本科生': 9},
        value=TeamMember.role, else_=99
    )
    members = TeamMember.query.order_by(TeamMember.sort_order.asc(), role_sort, TeamMember.created_at.asc()).all()
    return jsonify([member.to_dict() for member in members])


@admin_bp.route('/team/sort', methods=['PUT'])
@jwt_required()
def update_team_sort():
    """批量更新团队成员排序"""
    data = request.get_json()
    items = data.get('items', [])
    for item in items:
        member = TeamMember.query.get(item['id'])
        if member:
            member.sort_order = item['sort_order']
    db.session.commit()
    return jsonify({'message': '排序更新成功'})


@admin_bp.route('/team/<int:id>', methods=['GET'])
@jwt_required()
def get_member_detail(id):
    """获取成员详情"""
    member = TeamMember.query.get_or_404(id)
    return jsonify(member.to_dict())


@admin_bp.route('/team', methods=['POST'])
@jwt_required()
def create_team_member():
    """添加团队成员"""
    data = request.get_json()

    member = TeamMember(
        name=data.get('name'),
        role=data.get('role'),
        category=data.get('category'),
        research=data.get('research'),
        email=data.get('email'),
        website=data.get('website'),
        avatar=data.get('avatar'),
        bio=data.get('bio'),
        achievements=data.get('achievements')
    )

    db.session.add(member)
    db.session.commit()

    return jsonify({
        'message': '团队成员添加成功',
        'data': member.to_dict()
    }), 201


@admin_bp.route('/team/<int:id>', methods=['PUT'])
@jwt_required()
def update_team_member(id):
    """更新团队成员信息"""
    member = TeamMember.query.get_or_404(id)
    data = request.get_json()

    member.name = data.get('name', member.name)
    member.role = data.get('role', member.role)
    member.category = data.get('category', member.category)
    member.research = data.get('research', member.research)
    member.email = data.get('email', member.email)
    member.website = data.get('website', member.website)
    member.avatar = data.get('avatar', member.avatar)
    member.bio = data.get('bio', member.bio)
    member.achievements = data.get('achievements', member.achievements)

    db.session.commit()

    return jsonify({
        'message': '团队成员信息更新成功',
        'data': member.to_dict()
    })


@admin_bp.route('/team/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_team_member(id):
    """删除团队成员"""
    member = TeamMember.query.get_or_404(id)
    db.session.delete(member)
    db.session.commit()

    return jsonify({'message': '团队成员删除成功'})


# ==================== 通知和活动管理 ====================

@admin_bp.route('/notices', methods=['GET'])
@jwt_required()
def get_all_notices():
    """获取所有通知"""
    notices = Notice.query.order_by(Notice.date.desc()).all()
    return jsonify([notice.to_dict() for notice in notices])


@admin_bp.route('/notices', methods=['POST'])
@jwt_required()
def create_notice():
    """创建通知"""
    data = request.get_json()

    notice = Notice(
        title=data.get('title'),
        link=data.get('link'),
        date=datetime.strptime(data.get('date'), '%Y-%m-%d').date() if data.get('date') else datetime.utcnow().date()
    )

    db.session.add(notice)
    db.session.commit()

    return jsonify({
        'message': '通知创建成功',
        'data': notice.to_dict()
    }), 201


@admin_bp.route('/notices/<int:id>', methods=['PUT', 'DELETE'])
@jwt_required()
def update_delete_notice(id):
    """更新或删除通知"""
    notice = Notice.query.get_or_404(id)

    if request.method == 'DELETE':
        db.session.delete(notice)
        db.session.commit()
        return jsonify({'message': '通知删除成功'})

    data = request.get_json()
    notice.title = data.get('title', notice.title)
    notice.link = data.get('link', notice.link)

    if data.get('date'):
        notice.date = datetime.strptime(data['date'], '%Y-%m-%d').date()

    db.session.commit()

    return jsonify({
        'message': '通知更新成功',
        'data': notice.to_dict()
    })


@admin_bp.route('/events', methods=['GET'])
@jwt_required()
def get_all_events():
    """获取所有活动"""
    events = Event.query.order_by(Event.date.asc()).all()
    return jsonify([event.to_dict() for event in events])


@admin_bp.route('/events', methods=['POST'])
@jwt_required()
def create_event():
    """创建活动"""
    data = request.get_json()

    event = Event(
        title=data.get('title'),
        date=datetime.strptime(data.get('date'), '%Y-%m-%d').date(),
        time=data.get('time'),
        location=data.get('location')
    )

    db.session.add(event)
    db.session.commit()

    return jsonify({
        'message': '活动创建成功',
        'data': event.to_dict()
    }), 201


@admin_bp.route('/events/<int:id>', methods=['PUT', 'DELETE'])
@jwt_required()
def update_delete_event(id):
    """更新或删除活动"""
    event = Event.query.get_or_404(id)

    if request.method == 'DELETE':
        db.session.delete(event)
        db.session.commit()
        return jsonify({'message': '活动删除成功'})

    data = request.get_json()
    event.title = data.get('title', event.title)
    event.time = data.get('time', event.time)
    event.location = data.get('location', event.location)

    if data.get('date'):
        event.date = datetime.strptime(data['date'], '%Y-%m-%d').date()

    db.session.commit()

    return jsonify({
        'message': '活动更新成功',
        'data': event.to_dict()
    })


# ==================== 文件上传 ====================

@admin_bp.route('/upload/image', methods=['POST'])
@jwt_required()
def upload_image():
    """上传图片"""
    if 'file' not in request.files:
        return jsonify({'error': '没有文件被上传'}), 400

    file = request.files['file']

    if not file.filename:
        return jsonify({'error': '未选择文件'}), 400

    if not allowed_file(file.filename) or file.filename.rsplit('.', 1)[1].lower() not in ALLOWED_IMAGE_EXTENSIONS:
        return jsonify({'error': '不支持的文件格式，仅支持：png, jpg, jpeg, gif, webp'}), 400

    # 检查文件大小
    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)

    if file_size > MAX_FILE_SIZE:
        return jsonify({'error': '文件大小不能超过50MB'}), 400

    # 保存文件
    filepath = save_uploaded_file(file, 'uploads')

    if filepath:
        return jsonify({
            'message': '文件上传成功',
            'url': filepath
        }), 200

    return jsonify({'error': '文件上传失败'}), 500


@admin_bp.route('/upload/pdf', methods=['POST'])
@jwt_required()
def upload_pdf():
    """上传PDF文件"""
    if 'file' not in request.files:
        return jsonify({'error': '没有文件被上传'}), 400

    file = request.files['file']

    if not file.filename:
        return jsonify({'error': '未选择文件'}), 400

    if not allowed_file(file.filename) or file.filename.rsplit('.', 1)[1].lower() != 'pdf':
        return jsonify({'error': '仅支持 PDF 格式'}), 400

    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)

    if file_size > MAX_FILE_SIZE:
        return jsonify({'error': '文件大小不能超过50MB'}), 400

    filepath = save_uploaded_file(file, 'pdfs')
    if filepath:
        return jsonify({'message': 'PDF上传成功', 'url': filepath}), 200

    return jsonify({'error': '文件上传失败'}), 500


# ==================== 站点设置 ====================

@admin_bp.route('/settings/hero-bg', methods=['GET'])
@jwt_required()
def get_hero_bg():
    """获取Hero背景图片URL列表"""
    import json
    setting = SiteSetting.query.filter_by(key='hero_background').first()
    if setting and setting.value:
        try:
            images = json.loads(setting.value)
        except (json.JSONDecodeError, TypeError):
            images = [setting.value] if setting.value else []
    else:
        images = []
    return jsonify({'images': images})


@admin_bp.route('/settings/hero-bg', methods=['PUT'])
@jwt_required()
def set_hero_bg():
    """设置Hero背景图片URL列表"""
    import json
    data = request.get_json()
    images = data.get('images', [])

    setting = SiteSetting.query.filter_by(key='hero_background').first()
    if setting:
        setting.value = json.dumps(images)
    else:
        setting = SiteSetting(key='hero_background', value=json.dumps(images))
        db.session.add(setting)

    db.session.commit()
    return jsonify({'message': 'Hero背景图片设置成功', 'images': images})


# ==================== 统计信息 ====================

@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    """获取数据统计"""
    stats = {
        'news_count': News.query.count(),
        'projects_count': Project.query.count(),
        'team_members_count': TeamMember.query.count(),
        'notices_count': Notice.query.count(),
        'events_count': Event.query.count(),
        'unread_messages_count': ContactMessage.query.filter_by(is_read=False).count()
    }

    return jsonify(stats)
