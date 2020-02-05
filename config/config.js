const config = {};

config.development = {
  db: {
    dialect: "sqlite",
    storage: "./database/db.sqlite",
    logging: false
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

config.production = JSON.parse(JSON.stringify(config.development));
config.production.db.logging = true;

module.exports = config;
