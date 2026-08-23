from flask import Blueprint, jsonify, request
from sqlalchemy import case
from app import db
from app.models import TeamMember

team_bp = Blueprint('team', __name__)

ROLE_ORDER = {
    '教授': 1,
    '助理教授': 2,
    '讲师': 3,
    '特聘研究员': 4,
    '研究员': 5,
    '助理研究员': 6,
    '博士研究生': 7,
    '硕士研究生': 8,
    '本科生': 9,
}


@team_bp.route('', methods=['GET'])
def get_team_members():
    """获取团队成员列表，按角色层级排序"""
    category = request.args.get('category', 'all')

    query = TeamMember.query
    if category != 'all':
        query = query.filter_by(category=category)

    role_sort = case(ROLE_ORDER, value=TeamMember.role, else_=99)
    members = query.order_by(TeamMember.sort_order.asc(), role_sort, TeamMember.created_at.asc()).all()
    return jsonify([member.to_dict() for member in members])


@team_bp.route('/batch', methods=['GET'])
def get_members_batch():
    """批量获取成员"""
    ids = request.args.get('ids', '')
    if not ids:
        return jsonify([])
    id_list = [int(i) for i in ids.split(',') if i.strip().isdigit()]
    members = TeamMember.query.filter(TeamMember.id.in_(id_list)).all()
    return jsonify([m.to_dict() for m in members])


@team_bp.route('/<int:id>', methods=['GET'])
def get_member_by_id(id):
    """获取单个成员详情"""
    member = TeamMember.query.get_or_404(id)
    return jsonify(member.to_dict())


@team_bp.route('', methods=['POST'])
def create_member():
    """添加团队成员（需要认证）"""
    data = request.get_json()
    member = TeamMember(
        name=data.get('name'),
        role=data.get('role'),
        category=data.get('category'),
        research=data.get('research'),
        email=data.get('email'),
        website=data.get('website'),
        avatar=data.get('avatar')
    )
    db.session.add(member)
    db.session.commit()
    return jsonify(member.to_dict()), 201
