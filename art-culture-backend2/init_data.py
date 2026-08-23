"""初始化示例数据"""
from datetime import datetime, date
from app import create_app, db
from app.models import News, Project, TeamMember, Notice, Event, Admin


def init_sample_data():
    """初始化示例数据"""
    app = create_app('development')

    with app.app_context():
        # 清空现有数据
        db.drop_all()
        db.create_all()

        # 创建默认管理员账户
        admin = Admin(
            username='admin',
            email='admin@example.com',
            name='系统管理员'
        )
        admin.set_password('admin123')
        db.session.add(admin)

        # 创建示例新闻
        news_items = [
            News(
                title='第一届中国文化智能大会China CI 2025会议',
                content='首届中国文化智能大会（ChinaCI 2025）于2025年10月19日在浙江杭州顺利闭幕...',
                type='学术活动',
                date=date(2025, 10, 18)
            ),
            News(
                title='中国文化计算研究新进展',
                content='本团队在中国传统绘画大模型研究方面取得新进展...',
                type='研究成果',
                date=date(2025, 10, 15)
            ),
            News(
                title='中国传统绘画数字化展览开幕',
                content='中国传统绘画数字化展览于今日在浙江大学开幕...',
                type='展览活动',
                date=date(2025, 10, 10)
            )
        ]

        # 创建示例学术成果
        projects = [
            Project(
                title='ScrollTimes: Tracing the Provenance of Paintings as a Window Into History',
                description='The study of cultural artifact provenance, tracing ownership and preservation...',
                type='publication',
                authors='Wei Zhang, Wong Kam-Kwai, Yitian Chen, et al.',
                year=2024,
                link='https://ieeexplore.ieee.org/document/xxx'
            ),
            Project(
                title='中国古籍数字化保护与研究',
                description='该项目旨在利用现代数字技术对中国珍贵古籍进行数字化处理与保护...',
                type='project',
                authors='李华',
                year=2023
            ),
            Project(
                title='基于人工智能的中国绘画传承与创新',
                description='本课程立足新时代文化数字化背景，探索传统艺术与前沿科技的深度融合...',
                type='teaching',
                authors='陈为、张玮、尹琳',
                year=2024,
                link='https://coursehome.zhihuishu.com/courseHome/1000141895'
            )
        ]

        # 创建示例团队成员
        team_members = [
            TeamMember(
                name='陈为',
                role='教授',
                category='faculty',
                research='研究方向：中国传统绘画大模型'
            ),
            TeamMember(
                name='张玮',
                role='教授',
                category='faculty',
                research='研究方向：中国传统绘画大模型'
            ),
            TeamMember(
                name='古晓燕',
                role='硕士研究生',
                category='researcher',
                research='研究方向：中国传统绘画大模型'
            ),
            TeamMember(
                name='郑雯清',
                role='博士研究生',
                category='researcher',
                research='研究方向：中国传统绘画大模型'
            )
        ]

        # 创建示例通知公告
        notices = [
            Notice(title='2025年度学术会议征稿通知', date=date(2025, 10, 20)),
            Notice(title='学术讲座：AI在艺术研究中的应用', date=date(2025, 10, 18)),
            Notice(title='研究生招生信息', date=date(2025, 10, 15)),
            Notice(title='项目合作需求发布', date=date(2025, 10, 10))
        ]

        # 创建示例学术活动
        events = [
            Event(
                title='学术讲座：中国国画艺术的美学特征',
                date=date(2025, 10, 18),
                time='14:00-16:00',
                location='浙江大学紫金港校区'
            ),
            Event(
                title='文化计算研讨会',
                date=date(2025, 10, 25),
                time='09:00-12:00',
                location='线上会议'
            ),
            Event(
                title='传统文化与AI工作坊',
                date=date(2025, 11, 5),
                time='13:30-17:30',
                location='浙江大学CAD&CG实验室'
            )
        ]

        # 添加所有数据到数据库
        db.session.add_all(news_items)
        db.session.add_all(projects)
        db.session.add_all(team_members)
        db.session.add_all(notices)
        db.session.add_all(events)

        db.session.commit()
        print('示例数据初始化完成！')


if __name__ == '__main__':
    init_sample_data()
