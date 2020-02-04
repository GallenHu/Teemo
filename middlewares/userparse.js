const userController = require('../controllers/user');
const jwtUtils = require('../utils/jwt');

module.exports = async (ctx, next) => {
  const token = ctx.cookies.get('token');

  if (token) {
    const decoded = jwtUtils.verifyToken(token);
    if (decoded && decoded.data.id) {
      ctx.request.user = await userController.getUser(decoded.data.id);
    } else {
      ctx.cookies.set('token', null);
    }
  }

  await next();
}
