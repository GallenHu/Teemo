# Teemo
v4

## Dev
```
yarn serve

yarn build
bash scripts/gen_webroot.sh

# push dist folder to branch gh-pages
```

## Deploy
```sh
git clone -b gh-pages https://github.com/GallenHu/Teemo.git
cd Teemo

# docker rm teemo-php -f
# modify config.json
docker run -d -p 8760:80 --name teemo-php -v "$PWD":/var/www/html php:7.2-apache
```

## Use
```
visit: localhost:8760
# add cookie: userlist -> user1,user2
# document.cookie="userlist=u1,u2; expires=Thu, 18 Dec 2043 12:00:00 GMT; path=/";
```
