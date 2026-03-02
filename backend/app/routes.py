from flask import Blueprint, jsonify

# Define the blueprint
routes = Blueprint('routes', __name__)

# Define a route
@routes.route('/flask/data')
def flask_data():
    return jsonify({'message': 'Data from Flask API'})