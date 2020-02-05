FROM node:10.18.1-alpine3.11

WORKDIR /app

COPY . /app
RUN npm install --registry=https://registry.npm.taobao.org

EXPOSE 3001

CMD ["npm", "start"]
