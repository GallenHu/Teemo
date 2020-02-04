const qs = require('querystring');

const config = {};
const base = {
  domain: 'http://127.0.0.1:3000',
  githubOauth: '/ghoauth',
};

config.development = {
  db: {
    dialect: "sqlite",
    storage: "./db.sqlite"
  },
  siteName: '海风导航',
  oauth: {
    github: {
      client_id: process.env.GITHUB_CLIENT_ID || '',
      client_secret: process.env.GITHUB_CLIENT_SECRET || '',
      url: "https://github.com/login/oauth/authorize"
    }
  },
  jwtSecret: process.env.JWT_SECRET || '123456',
};

config.production = {...config.development};

module.exports = config;
