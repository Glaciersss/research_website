from flask import Blueprint, jsonify
from app import db
from app.models import Notice

notices_bp = Blueprint('notices', __name__)


@notices_bp.route('', methods=['GET'])
def get_notices():
    notices = Notice.query.order_by(Notice.date.desc()).all()
    return jsonify([notice.to_dict() for notice in notices])
