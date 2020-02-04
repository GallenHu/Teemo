require('dotenv').config();

const path = require('path');
const views = require('koa-views');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const app = module.exports = new Koa();
const models = require('./models');
const env = process.env.NODE_ENV || 'development';
const config = require('./config/config')[env];
const siteController = require('./controllers/site');
const categoryController = require('./controllers/category');
const routeRegister = require('./router/router');
const userparseMiddleware = require('./middlewares/userparse');

app.use(bodyParser());

// static
app.use(require('koa-static')(__dirname + '/static'));

// setup views, appending .ejs
// when no extname is given to render()

app.use(views(path.join(__dirname, '/views'), { extension: 'ejs' }));

app.use(userparseMiddleware);
routeRegister(app);

// render
app.use(async function(ctx) {
  const data = {
    siteName: config.siteName,
    oauth: config.oauth,
    sites: []
  };

  if (ctx.request.user) {
    const user = ctx.request.user;
    console.log('\nuser:');
    console.log(user);
    data.user = user;
    data.userId = user.id;
    data.nickname = user.nickname;
    data.avator = user.avator;
    data.currentCategory = user.current_category; // id number
    data.categories = await categoryController.getAllCategories(user);

    const category = await categoryController.getCategoryById(user, data.currentCategory);
    data.sites = await siteController.getAllSites(category);
  }

  await ctx.render('index', { data });
});

(async () => {
  await models.sequelize.sync();
  if (!module.parent) app.listen(3000, () => {
    console.info(`\nEnv: ${process.env.NODE_ENV}`);
    console.info('\nExpress server listening on port 3000');
  });
})();
