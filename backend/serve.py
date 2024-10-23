from flask import Flask
from flask_socketio import SocketIO, send, join_room, leave_room
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
    send({'room_id': room_id, 'message': 'Room created successfully!'}, room=request.sid)

@socketio.on('join')
def handle_join(data):
    username = data['username']
    room = data['room']
    password = data['password']

    if room in rooms and rooms[room]['password'] == password:
        join_room(room)
        send(f"{username} has joined the room.", to=room)
    else:
        send('Incorrect room ID or password.', room=request.sid)

@socketio.on('message')
def handle_message(data):
    room = data['room']
    message = data['message']

    if room in rooms:
        rooms[room]['messages'].append(message)
        send(message, to=room)  # Send the message to the specific room

@socketio.on('leave')
def handle_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    send(f"{username} has left the room.", to=room)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
