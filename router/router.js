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
  app.use(_.post('/category/update', async (ctx) => {
    const { id, name, order, remark } = ctx.request.body;

    if (!ctx.request.user) {
      ctx.body = {
        code: 401,
        data: '权限认证失败',
        success: false
      };
      return;
    }

    if (id && name) {
      try {
        const category = await categoryController.getCategoryById(ctx.request.user, id);
        category.update({
          name,
          order: Number(order),
          remark: remark || ''
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
        data: '请输入 id, name',
        success: false
      };
    }
  }));
  app.use(_.post('/category/delete', async (ctx) => {
    const { id } = ctx.request.body;

    if (!ctx.request.user) {
      ctx.body = {
        code: 401,
        data: '权限认证失败',
        success: false
      };
      return;
    }

    if (id) {
      try {
        await categoryController.deleteCategory(ctx.request.user, id);

        ctx.body = {
          code: 200,
          data: null,
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
        data: '请输入 id',
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

      try {
        const site = await siteController.createSite(category, {
          name,
          url,
          icon,
          order: Number(order) || 0,
          remark: remark || '',
          UserId: ctx.request.user.id
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
  app.use(_.post('/site/update', async (ctx) => {
    const { id, name, url, iconUrl, order, remark } = ctx.request.body;

    if (!ctx.request.user) {
      ctx.body = {
        code: 401,
        data: '权限认证失败',
        success: false
      };
      return;
    }

    if (name && url && id) {
      const user = ctx.request.user;
      try {
        let site = await siteController.getSiteById(user, id);
        if (site) {
          site = await site.update({
            name,
            url,
            icon: iconUrl,
            order,
            remark
          });
          ctx.body = {
            code: 200,
            data: site,
            success: true
          }
        } else {
          ctx.body = {
            code: 400,
            data: '未查找到站点信息，请确认您是否有权限',
            success: false
          }
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
  app.use(_.post('/site/delete', async (ctx) => {
    const { id } = ctx.request.body;

    if (!ctx.request.user) {
      ctx.body = {
        code: 401,
        data: '权限认证失败',
        success: false
      };
      return;
    }

    if (id) {
      const user = ctx.request.user;
      try {
        await siteController.deleteSite(user, id);
        ctx.body = {
          code: 200,
          data: null,
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
        data: '请输入 id',
        success: false
      };
    }
  }));

  // 设置当前Profile POST /user/currentcategory/update
  app.use(_.post('/user/currentcategory/update', async (ctx) => {
    const { categoryId } = ctx.request.body;

    if (!ctx.request.user) {
      ctx.body = {
        code: 401,
        data: '权限认证失败',
        success: false
      };
      return;
    }

    if (categoryId) {
      let user = ctx.request.user;

      try {
        user = await userController.updateCurrentCategory(user, categoryId);
        ctx.body = {
          code: 200,
          data: user,
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
        data: '请输入 categoryId',
        success: false
      };
    }
  }));
};
