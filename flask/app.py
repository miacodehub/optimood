from flask import Flask, render_template, jsonify, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tiles.db'
db = SQLAlchemy(app)

class Tile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    rating = db.Column(db.Integer)
    last_engaged = db.Column(db.Date)

    def __init__(self, name, rating, last_engaged):
        self.name = name
        self.rating = rating
        self.last_engaged = last_engaged

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/tiles', methods=['GET'])
def get_tiles():
    tiles = Tile.query.all()
    tiles_list = [{
        'id': tile.id,
        'name': tile.name,
        'rating': tile.rating,
        'last_engaged': tile.last_engaged.strftime('%Y-%m-%d')
    } for tile in tiles]
    return jsonify(tiles_list)

@app.route('/tiles', methods=['POST'])
def add_tile():
    data = request.json
    tile = Tile(name=data['name'], rating=data['rating'], last_engaged=data['last_engaged'])
    db.session.add(tile)
    db.session.commit()
    return jsonify({'message': 'Tile added successfully'}), 201

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)
