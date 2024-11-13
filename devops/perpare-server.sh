sudo apt install python3-gunicorn python3-eventlet
sudo apt install nginx


gunicorn --worker-class eventlet -w 1 -b 0.0.0.0:5000 serve:app