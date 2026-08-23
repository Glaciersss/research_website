from flask import Blueprint, jsonify, request
from app import db
from app.models import Project

projects_bp = Blueprint('projects', __name__)


@projects_bp.route('', methods=['GET'])
def get_projects():
    """获取学术成果列表"""
    project_type = request.args.get('type', 'all')
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)

    query = Project.query
    if project_type != 'all':
        query = query.filter_by(type=project_type)

    pagination = query.order_by(Project.year.desc().nullslast(), Project.created_at.desc()).paginate(
        page=page, per_page=limit, error_out=False
    )

    return jsonify({
        'items': [item.to_dict() for item in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page
    })


@projects_bp.route('/batch', methods=['GET'])
def get_projects_batch():
    """批量获取学术成果"""
    ids = request.args.get('ids', '')
    if not ids:
        return jsonify([])
    id_list = [int(i) for i in ids.split(',') if i.strip().isdigit()]
    projects = Project.query.filter(Project.id.in_(id_list)).all()
    return jsonify([p.to_dict() for p in projects])


@projects_bp.route('/<int:id>', methods=['GET'])
def get_project_by_id(id):
    """获取单个学术成果详情"""
    project = Project.query.get_or_404(id)
    return jsonify(project.to_dict())


@projects_bp.route('', methods=['POST'])
def create_project():
    """创建学术成果（需要认证）"""
    data = request.get_json()
    project = Project(
        title=data.get('title'),
        description=data.get('description'),
        type=data.get('type'),
        authors=data.get('authors'),
        year=data.get('year'),
        link=data.get('link')
    )
    db.session.add(project)
    db.session.commit()
    return jsonify(project.to_dict()), 201
