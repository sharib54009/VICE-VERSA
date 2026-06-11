from flask import Flask, render_template, request, jsonify, session, redirect
from werkzeug.security import generate_password_hash, check_password_hash

from models import db, User, TextHistory

from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True)

app.config['SECRET_KEY'] = 'viceversa-secret'

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///viceversa.db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()


# ---------------- HOME ---------------- #

@app.route('/')
def index():

    if 'user_id' in session:
        return redirect('/app')

    return render_template('index.html')


@app.route('/app')
def app_page():

    if 'user_id' not in session:
        return redirect('/')

    return render_template(
        'app.html',
        username=session.get('username')
    )


@app.route('/logout')
def logout():

    session.clear()

    return redirect('/')


# ---------------- SIGNUP ---------------- #

@app.route('/signup', methods=['POST'])
def signup():

    try:

        data = request.get_json()

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username or not email or not password:

            return jsonify({
                'success': False,
                'message': 'All fields required'
            })

        existing_user = User.query.filter_by(email=email).first()

        if existing_user:

            return jsonify({
                'success': False,
                'message': 'Email already exists'
            })

        hashed_password = generate_password_hash(password)

        new_user = User(
            username=username,
            email=email,
            password=hashed_password
        )

        db.session.add(new_user)

        db.session.commit()

        session['user_id'] = new_user.id
        session['username'] = new_user.username

        return jsonify({
            'success': True,
            'message': 'Signup successful'
        })

    except Exception as e:

        return jsonify({
            'success': False,
            'message': str(e)
        })


# ---------------- LOGIN ---------------- #

@app.route('/login', methods=['POST'])
def login():

    try:

        data = request.get_json()

        email = data.get('email')

        password = data.get('password')

        user = User.query.filter_by(email=email).first()

        if user and check_password_hash(user.password, password):

            session['user_id'] = user.id

            session['username'] = user.username

            return jsonify({
                'success': True,
                'message': 'Login successful'
            })

        return jsonify({
            'success': False,
            'message': 'Invalid credentials'
        })

    except Exception as e:

        return jsonify({
            'success': False,
            'message': str(e)
        })


# ---------------- SAVE TEXT ---------------- #

@app.route('/save-text', methods=['POST'])
def save_text():

    if 'user_id' not in session:

        return jsonify({
            'success': False,
            'message': 'Login required'
        })

    data = request.get_json()

    text = data.get('text')

    if not text:

        return jsonify({
            'success': False,
            'message': 'Text empty'
        })

    item = TextHistory(
        text=text,
        user_id=session['user_id']
    )

    db.session.add(item)

    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Saved'
    })


# ---------------- HISTORY ---------------- #

@app.route('/history')
def history():

    if 'user_id' not in session:

        return jsonify({
            'history': []
        })

    items = TextHistory.query.filter_by(
        user_id=session['user_id']
    ).order_by(
        TextHistory.timestamp.desc()
    ).all()

    return jsonify({
        'history': [
            {
                'text': item.text,
                'timestamp': item.timestamp.strftime('%Y-%m-%d %H:%M')
            }
            for item in items
        ]
    })


# ---------------- RUN ---------------- #

if __name__ == '__main__':

   app.run(host="0.0.0.0", port=5000, debug=True)