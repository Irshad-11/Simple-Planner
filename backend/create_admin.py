# create_admin.py
from run import app
from models import db, User

with app.app_context():
    if User.query.filter_by(username='admin').first():
        print("Admin already exists!")
    else:
        admin = User(
            first_name='Admin',
            last_name='Super',
            username='admin',
            email='admin@example.com',
            role='admin'
        )
        admin.set_password('admin123')          # ← change this!
        db.session.add(admin)
        db.session.commit()
        print('Admin user created!')