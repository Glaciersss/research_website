from flask import Blueprint, jsonify
from app import db
from app.models import Event

events_bp = Blueprint('events', __name__)


@events_bp.route('', methods=['GET'])
def get_events():
    events = Event.query.order_by(Event.date.asc()).all()
    return jsonify([event.to_dict() for event in events])
