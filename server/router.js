const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getFiles', mid.requiresLogin, controllers.File.getFiles);
  app.get('/retrieve', mid.requiresLogin, controllers.File.retrieveImage);
  app.post('/upload', mid.requiresLogin, controllers.File.uploadImage);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.get('/password', mid.requiresLogin, controllers.Account.passwordPage);

  app.get('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.post('/passwordChange', mid.requiresLogin, controllers.Account.changePassword);
  app.post('/subscribe', mid.requiresLogin, controllers.File.becomeSubscriber);

  app.get('/maker', mid.requiresLogin, controllers.File.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.File.makeFile);
  app.post('/update', mid.requiresLogin, controllers.File.updateFile);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  app.get('*', controllers.NotFound.missingPage);
};

module.exports = router;
