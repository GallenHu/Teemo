const jwt = require('jsonwebtoken');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

module.exports = {
  generateToken: function(userInfo) {
    return jwt.sign({
      data: userInfo
    }, config.jwtSecret, { expiresIn: '30d' });
  },

  verifyToken(token) {
    try {
      return jwt.verify(token, config.jwtSecret);
    } catch(err) {
      console.error(err);
      return '';
    }
  }
};
