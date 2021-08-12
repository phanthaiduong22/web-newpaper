module.exports = function (app) {
  app.use('/', require('../controllers/home.route'));

  app.use('/account/', require('../controllers/account.route'));

  app.use('/admin/categories/', require('../controllers/category.route'));

  app.use('/tags/', require('../controllers/tag.route'));

  app.use('/admin/', require('../controllers/admin.route'));

  app.use('/editor/', require('../controllers/editor.route'));

  app.use('/writer/', require('../controllers/writer.route'));

  app.use('/papers/', require('../controllers/paper.route'));

  app.use('/search/', require('../controllers/search.route'));
};
