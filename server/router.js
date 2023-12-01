const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getFiles', mid.requiresLogin, controllers.File.getFiles);
  // app.get('/getImages', mid.requiresLogin, controllers.File.retrieveImage);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/maker', mid.requiresLogin, controllers.File.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.File.makeFile);
  app.post('/update', mid.requiresLogin, controllers.File.updateFile);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
