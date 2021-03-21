import json

from flask import Flask, Blueprint, render_template, redirect, url_for, request
from functions import *

# from flask_jwt import JWT, jwt_required, current_identity


app = Flask(__name__)
auth = Blueprint('auth', __name__)
app.debug = True
app.config['SECRET_KEY'] = 'super-secret'

spec_modules = json.loads(open("dataset_disc.json", "r").read())
id2s = json.loads(open("id2s.json", "r").read())
id2uni = json.loads(open("id2uni.json", "r").read())
uni_info = json.loads(open("uni_info.json", "r").read())
#print(id2uni)
spec_repo = SpecialistRepo()
unic_repo = UniversityRepo()
user_repo = UserRepo()

@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/api/specialists')
def get_all_specialists():
    return { 'succeeded' : True, 'result' : spec_repo.get_all()}

@app.route('/api/specialists/<id>')
def get_specialist_by_id(id):
    return { 'succeeded' : True, 'result' : spec_repo.get_by_id(id)}

@app.route('/api/universities')
def get_all_universities():
    return { 'succeeded' : True, 'result' : unic_repo.get_all()}


@app.route('/api/get_speciality_modules/<id>')
def get_speciality_modules(id):
    spec = id2s[id]
    return {'succeeded': True, 'result': spec_modules[spec]}


@app.route('/api/get_uni_info/<id>')
def get_uni_info(id):
    uni_name = id2uni[id]
    return {'succeeded': True, 'result': [(id2s[str(s_id)], s_id) for s_id in uni_info[id]]}


@app.route('/api/universities/<id>')
def get_university_by_id(id):
    return { 'succeeded' : True, 'result' : unic_repo.get_by_id(id)}

@app.route('/api/profile/<id>')
# @jwt_required()
def profile(id):
    user = user_repo.get_by_id(id)
    if(user):
        return {
            'succeeded' : True,
            'result' : {
                'user' : user,
                'recent_results' : [],
                'interests': []
            }
        }
    return { 'succeeded' : False }


def login(username, password):
    return True


def identity(payload):
    user_id = payload['identity']
    return user_repo.get_by_id(user_id, None)

@app.route('/api/signup', methods=['POST'])
def signup():
    email = request.form.get('email')
    login = request.form.get('login')
    first_name = request.form.get('name')
    last_name = request.form.get('last_name')
    password = request.form.get('password')

    # if(user_repo.get_by_email(email)):
    #     return { 'succeeded' : False, 'result' : 'this email is already taken' }
    
    # if(user_repo.get_by_login(login)):
    #     return { 'succeeded' : False, 'result' : 'this login is already taken' }

    result = user_repo.create_user(email, login, first_name, last_name, password)
    return { 'succeeded' : result }

@app.route('/api/logout', methods=['POST'])
def logout():
    return 'Logout'

# jwt = JWT(app, login, identity)

if __name__ == '__main__':
    app.run()