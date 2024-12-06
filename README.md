This is a [Next.js](https://nextjs.org) project that designed to collect and display websites as the home page for a browser.

## Tech Stack

- Next.js v15 with TypeScript
- Auth.js v5 (OAuth2 Login)
- MongoDB
- @dnd-kit
- Docker containerization

## Deploying with Docker

```sh
$ cp .env.example .env
$ docker-compose up
```

## Local Development

```sh
$ cp .env.example .env
$ docker-compose -f ./docker-compose.dev.yml up
$ npm run dev
```
