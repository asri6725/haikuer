sudo apt install python3-gunicorn python3-eventlet
sudo apt install nginx

sudo cp /home/ubuntu/haikuer/devops/services/gunicorn.service /etc/systemd/system/gunicorn.service
systemctl start gunicorn.service