# run container
docker run -d \
  --name=simple-webserver \
  --restart=unless-stopped \
  --volume=$(pwd)/logs:/opt/app/logs \
  -p 127.0.0.1:30300:3000/tcp \
  simple-webserver
