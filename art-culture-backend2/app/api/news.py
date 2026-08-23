from flask import Blueprint, jsonify, request
from app import db
from app.models import News, Notice, Event

news_bp = Blueprint('news', __name__)


@news_bp.route('', methods=['GET'])
def get_news():
    """获取新闻列表"""
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)

    news_query = News.query.order_by(News.date.desc())
    pagination = news_query.paginate(page=page, per_page=limit, error_out=False)

    return jsonify({
        'items': [item.to_dict() for item in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page
    })


@news_bp.route('/<int:id>', methods=['GET'])
def get_news_by_id(id):
    """获取单条新闻详情"""
    news = News.query.get_or_404(id)
    return jsonify(news.to_dict())


@news_bp.route('', methods=['POST'])
def create_news():
    """创建新闻（需要认证）"""
    data = request.get_json()
    news = News(
        title=data.get('title'),
        content=data.get('content'),
        type=data.get('type', '投稿日历')
    )
    db.session.add(news)
    db.session.commit()
    return jsonify(news.to_dict()), 201


@news_bp.route('/<int:id>', methods=['PUT', 'DELETE'])
def update_delete_news(id):
    """更新或删除新闻（需要认证）"""
    news = News.query.get_or_404(id)

    if request.method == 'DELETE':
        db.session.delete(news)
        db.session.commit()
        return jsonify({'message': 'Deleted successfully'}), 200

    data = request.get_json()
    news.title = data.get('title', news.title)
    news.content = data.get('content', news.content)
    news.type = data.get('type', news.type)
    db.session.commit()
    return jsonify(news.to_dict()), 200


@news_bp.route('/notices', methods=['GET'])
def get_notices():
    """获取通知公告列表"""
    notices = Notice.query.order_by(Notice.date.desc()).limit(10).all()
    return jsonify([notice.to_dict() for notice in notices])


@news_bp.route('/events', methods=['GET'])
def get_events():
    """获取投稿日历"""
    events = Event.query.order_by(Event.date.asc()).limit(10).all()
    return jsonify([event.to_dict() for event in events])
