# Gunicorn and nginx setup

sudo apt install python3-gunicorn python3-eventlet
sudo apt install nginx

cd /home/ubuntu/haikuer/
sudo cp devops/services/gunicorn.service /etc/systemd/system/gunicorn.service
systemctl start gunicorn.service
sudo cp devops/nginx_sites_enabled.conf /etc/nginx/sites-available/haikuer
sudo ln -s /etc/nginx/sites-available/haikuer /etc/nginx/sites-enabled
sudo nginx -t
sudo systemctl restart nginx

# add ssl certificate
sudo apt update
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.haikuer.auguilin.com



# Certbot output:
# Successfully received certificate.
# Certificate is saved at: /etc/letsencrypt/live/api.haikuer.auguilin.com/fullchain.pem
# Key is saved at:         /etc/letsencrypt/live/api.haikuer.auguilin.com/privkey.pem
# This certificate expires on 2025-02-11.
# These files will be updated when the certificate renews.
# Certbot has set up a scheduled task to automatically renew this certificate in the background.

# Deploying certificate
# Successfully deployed certificate for api.haikuer.auguilin.com to /etc/nginx/sites-enabled/haikuer
# Congratulations! You have successfully enabled HTTPS on https://api.haikuer.auguilin.com