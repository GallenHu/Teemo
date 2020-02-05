# Teemo
A simple navigation site.

## Require
- node 10.16.x
- sequelize 5

## Dev
```
npm install
npm run dev
```

## Run with Docker
```sh
vim /home/www/.env
docker run --name teemo -d -p 3000:3000 \
  -v /home/www/.env:/app/.env \
  -v /home/www/database:/app/database \
  hvanke/teemo:latest
```
