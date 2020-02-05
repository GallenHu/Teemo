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
docker run -d -p 3000:3000 teemo:v3 --name teemo

# backup database
docker cp teemo:/app/database/db.sqlite ~/db.sqlite
```
