# Teemo
v4

## Deploy
```sh
git clone -b gh-pages https://github.com/GallenHu/Teemo.git
cd Teemo
# modify config.json
docker run -d -p 8000:80 --name teemo-php -v "$PWD":/var/www/html php:7.2-apache
```
