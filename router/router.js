const _ = require('koa-route');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const oauth = require('../utils/oauth');
const categoryController = require('../controllers/category');
const siteController = require('../controllers/site');
const userController = require('../controllers/user');
const jwtUtils = require('../utils/jwt');

module.exports = (app) => {
  // 登录认证 GET /ghoauth
  app.use(_.get('/ghoauth', async (ctx) => {
    const { code } = ctx.request.query;
    if (!code) {
      ctx.body = 'Error: no code';
    } else {
      const reqToken = await oauth.getGithubToken({
        code,
        client_id: config.oauth.github.client_id,
        client_secret: config.oauth.github.client_secret,
      });
      const { access_token } = reqToken;
      if (!access_token) {
        ctx.body = 'Error: ' + reqToken.error;
      } else {
        const info = await oauth.getGithubInfo(access_token);
        const user = await userController.createOrGetUser({
          email: info.email,
          avator: info.avatar_url,
          username: info.login,
          nickname: info.name
        });
        if (user && user.id) {
          const token = jwtUtils.generateToken({
            avator: info.avatar_url,
            id: user.id,
            nickname: info.name
          });
          ctx.cookies.set('token', token, {
            expires: new Date('2099-12-31'),
            httpOnly: true,
            overwrite: true
          });
          ctx.redirect('/');
        }
        ctx.body = info;
      }
    }
  }));

  app.use(_.get('/logout', async (ctx) => {
    ctx.request.user = null;
    ctx.cookies.set('token', null);
    ctx.redirect('/');
  }));

  // 创建Profile POST /category/create
  app.use(_.post('/category/create', async (ctx) => {
    const { name, order, remark } = ctx.request.body;

    if (!ctx.request.user) {
      ctx.body = {
        code: 401,
        data: '权限认证失败',
        success: false
      };
      return;
    }

    if (name) {
      try {
        const category = await categoryController.createCategory(ctx.request.user, {
          name,
          remark: remark || '',
          order: Number(order) || 0
        });
        ctx.body = {
          code: 200,
          data: category,
          success: true
        }
      } catch (err) {
        console.error(err);
        ctx.body = {
          code: 500,
          data: err.message || err,
          success: false
        }
      }
    } else {
      ctx.body = {
        code: 400,
        data: '请输入 name',
        success: false
      };
    }
  }));

  // 创建Site POST /site/create
  app.use(_.post('/site/create', async (ctx) => {
    const { name, url, icon, order, remark, categoryId } = ctx.request.body;

    if (!ctx.request.user) {
      ctx.body = {
        code: 401,
        data: '权限认证失败',
        success: false
      };
      return;
    }

    if (name && url && categoryId) {
      const category = await categoryController.getCategoryById(ctx.request.user, Number(categoryId));
      console.log('category');
      console.log(category);
      try {
        const site = await siteController.createSite(category, {
          name,
          url,
          icon,
          order: Number(order) || 0,
          remark: remark || ''
        });
        ctx.body = {
          code: 200,
          data: site,
          success: true
        }
      } catch (err) {
        console.error(err);
        ctx.body = {
          code: 500,
          data: err.message || err,
          success: false
        }
      }
    } else {
      ctx.body = {
        code: 400,
        data: '请输入 name, url, categoryId',
        success: false
      };
    }
  }));
};
