from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from app.models import Admin

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/login', methods=['POST'])
def login():
    """管理员登录"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': '用户名和密码不能为空'}), 400

    admin = Admin.query.filter_by(username=username).first()

    if admin and admin.check_password(password):
        access_token = create_access_token(identity=str(admin.id))
        return jsonify({
            'message': '登录成功',
            'access_token': access_token,
            'admin': admin.to_dict()
        }), 200

    return jsonify({'error': '用户名或密码错误'}), 401


@auth_bp.route('/verify', methods=['POST'])
@jwt_required()
def verify_token():
    """验证 Token 有效性"""
    current_admin_id = get_jwt_identity()
    admin = Admin.query.get(current_admin_id)

    if admin:
        return jsonify({
            'valid': True,
            'admin': admin.to_dict()
        }), 200

    return jsonify({'valid': False}), 401


@auth_bp.route('/register', methods=['POST'])
def register():
    """注册新管理员（需要认证）"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    name = data.get('name')

    if not username or not password:
        return jsonify({'error': '用户名和密码不能为空'}), 400

    # 检查用户名是否已存在
    if Admin.query.filter_by(username=username).first():
        return jsonify({'error': '用户名已存在'}), 400

    admin = Admin(
        username=username,
        email=email,
        name=name
    )
    admin.set_password(password)

    db.session.add(admin)
    db.session.commit()

    return jsonify({
        'message': '注册成功',
        'admin': admin.to_dict()
    }), 201
