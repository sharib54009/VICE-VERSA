import os
from flask import Flask, render_template, request, jsonify, session, redirect
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS

from models import db, User, TextHistory

app = Flask(__name__)

# ---------------- CONFIG ---------------- #

app.config['SECRET_KEY'] = os.environ.get(
    'SECRET_KEY',
    'viceversa-secret'
)

# SQLite for local development and Render demo
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
    'DATABASE_URL',
    'sqlite:///viceversa.db'
)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Session settings
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'None'

# CORS
cors_origins = os.environ.get('CORS_ORIGINS')

if cors_origins:
    CORS(
        app,
        supports_credentials=True,
        origins=cors_origins.split(',')
    )
else:
    CORS(
        app,
        supports_credentials=True
    )

# ---------------- DATABASE ---------------- #

db.init_app(app)

with app.app_context():
    db.create_all()

# ---------------- RUN ---------------- #

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', '0') == '1'

    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug
    )