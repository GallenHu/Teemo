const request = require('request');

module.exports = {
  getGithubToken: function(params) {
    console.log('get github info params:');
    console.log(params);

    return new Promise((resolve, reject) => {
      request.post(
        'https://github.com/login/oauth/access_token',
        {
          json: params
        },
        (err, httpResponse, body) => {
          if (err) {
            reject(err);
          } else {
            resolve(body);
          }
        }
      );
    });
  },

  getGithubInfo: function(token) {
    return new Promise((resolve, reject) => {
      request(
        {
          url: 'https://api.github.com/user',
          headers: {
            accept: 'application/json',
            Authorization: `token ${token}`,
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36'
          }
        },
        (err, httpResponse, body) => {
          if (err) {
            reject(err);
          } else {
            resolve(JSON.parse(body));
          }
        }
      );
    });
  },
};
