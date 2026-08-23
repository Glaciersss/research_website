from app import create_app, db
from app.models import Admin

app = create_app('development')
with app.app_context():
    admin = Admin.query.filter_by(username='admin').first()
    if admin:
        admin.username = '123'
        admin.set_password('123')
        db.session.commit()
        print('账户已更新')
        print(f'新用户名: {admin.username}')
        print('新密码: 123')
    else:
        print('未找到管理员账户，创建新账户...')
        new_admin = Admin(username='123', email='admin@example.com', name='管理员')
        new_admin.set_password('123')
        db.session.add(new_admin)
        db.session.commit()
        print('新账户已创建')
        print('用户名: 123')
        print('密码: 123')
