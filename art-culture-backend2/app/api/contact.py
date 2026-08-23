from flask import Blueprint, jsonify, request
from app import db
from app.models import ContactMessage

contact_bp = Blueprint('contact', __name__)


@contact_bp.route('', methods=['POST'])
def submit_contact():
    """提交联系表单"""
    data = request.get_json()

    # 验证必填字段
    required_fields = ['name', 'email', 'subject', 'message']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400

    # 创建留言记录
    message = ContactMessage(
        name=data.get('name'),
        email=data.get('email'),
        subject=data.get('subject'),
        message=data.get('message')
    )
    db.session.add(message)
    db.session.commit()

    return jsonify({
        'message': '留言提交成功',
        'data': message.to_dict()
    }), 201


@contact_bp.route('/messages', methods=['GET'])
def get_messages():
    """获取留言列表（需要认证）"""
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)

    pagination = ContactMessage.query.order_by(
        ContactMessage.created_at.desc()
    ).paginate(page=page, per_page=limit, error_out=False)

    return jsonify({
        'items': [item.to_dict() for item in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page
    })
