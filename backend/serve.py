from flask import Flask, request
from flask_socketio import SocketIO, join_room, leave_room
from helper import generate_room_name

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Store active rooms with their passwords
rooms = {}

@socketio.on('create-room')
def create_room(data):
    # Generate a unique room ID and associate it with a password
    room_id = generate_room_name()
    if(len(rooms) > 20):
        socketio.emit('message', {'message': 'too many rooms, try again later'}, to=request.sid)
    
    else:
        while(room_id in rooms):
            room_id = generate_room_name()
        password = data['password']
        rooms[room_id] = {'password': password, 'haiku': []}
        socketio.emit('room-created', {'room_id': room_id, 'message': 'Room created successfully!'}, room=request.sid)

@socketio.on('join')
def handle_join(data):
    username = data['username']
    room = data['room']
    password = data['password']

    if room in rooms and rooms[room]['password'] == password:
        join_room(room)
        socketio.emit('room-joined', {'room_id': room, 'message': f"{username} has joined."}, to=room)
    else:
        socketio.emit('message', {'message': 'Incorrect room ID or password.'}, to=request.sid)

@socketio.on('new-line')
def handle_message(data):
    room = data['room']
    message = data['haiku']

    if room in rooms:
        if rooms[room]['haiku']:
            rooms[room]['haiku'].append(message)
        else:
            rooms[room]['haiku'] = [message]
        socketio.emit('new-line', {'haiku': rooms[room]['haiku']}, to=room)

@socketio.on('clean-slate')
def handle_message(data):
    room = data['room']

    if room in rooms:
        rooms[room].pop('haiku')
        socketio.emit('clean-slate', to=room)

@socketio.on('leave')
def handle_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    socketio.emit('room-joined', {'message': f"{username} has left."}, to=room)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
