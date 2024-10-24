from flask import Flask, request
from flask_socketio import SocketIO, join_room, leave_room
import uuid

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Store active rooms with their passwords
rooms = {}

@socketio.on('create_room')
def create_room(data):
    # Generate a unique room ID and associate it with a password
    room_id = str(uuid.uuid4())
    password = data['password']
    rooms[room_id] = {'password': password, 'messages': []}
    socketio.emit('room_created', {'room_id': room_id, 'message': 'Room created successfully!'}, room=request.sid)


@socketio.on('join')
def handle_join(data):
    username = data['username']
    room = data['room']
    password = data['password']

    if room in rooms and rooms[room]['password'] == password:
        join_room(room)
        socketio.emit('room_joined', {'room_id': room, 'message': f"{username} has joined."}, to=room)
    else:
        socketio.emit('message', {'message': 'Incorrect room ID or password.'}, to=request.sid)

@socketio.on('new_line')
def handle_message(data):
    room = data['room']
    message = data['haiku']

    if room in rooms:
        rooms[room]['messages']= message
        socketio.emit('new_line', {'haiku': message}, to=room)

@socketio.on('clean_slate')
def handle_message(data):
    room = data['room']

    if room in rooms:
        socketio.emit('clean_slate', to=room)

@socketio.on('leave')
def handle_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    socketio.emit('room_joined', {'message': f"{username} has left."}, to=room)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
