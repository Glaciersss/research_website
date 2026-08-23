from functools import wraps
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Admin


def admin_required():
    """要求管理员权限的装饰器"""
    def decorator(fn):
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            current_admin_id = get_jwt_identity()
            admin = Admin.query.get(current_admin_id)

            if not admin:
                return jsonify({'error': '未授权访问'}), 401

            return fn(*args, **kwargs)
        return wrapper
    return decorator
