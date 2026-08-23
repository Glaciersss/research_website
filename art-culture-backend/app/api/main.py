from flask import Blueprint, jsonify
from app.models import SiteSetting

main_bp = Blueprint('main', __name__)


@main_bp.route('/')
def index():
    """API 根路径"""
    return jsonify({
        'message': '艺术与文化智能计算 API',
        'version': '1.0.0',
        'endpoints': {
            'news': '/api/news',
            'projects': '/api/projects',
            'team': '/api/team',
            'contact': '/api/contact'
        }
    })


@main_bp.route('/health')
def health():
    """健康检查"""
    return jsonify({'status': 'ok'})


@main_bp.route('/public/hero-bg')
def get_public_hero_bg():
    """公开获取Hero背景图片URL列表"""
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
