var http      = require('http'),
    path      = require('path'),
    express   = require('express'),
    morgan         = require('morgan'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    errorhandler = require('errorhandler');

module.exports = function (opts) {
  var app = express(),
      log = opts.log,
      colors = opts.colors;

  app.set('port', opts.port || 8000);
  app.set('views', path.join(process.cwd(), 'build'));
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(methodOverride());
  app.use(express.static(path.join(process.cwd(), 'build')));
  app.use(express.static(path.join(process.cwd(), 'public')));

  if (app.get('env') === 'dev') {
    app.use(errorhandler());
  }

  function index(req, res) {
    res.render('index.html');
  }

  app.get('/', index);
  app.get(/^\/?[A-Za-z0-9\/_]+$/, index);

  var server = http.createServer(app).listen(app.get('port'), function() {
    log('');
    log(colors.gray("-----------------------------------"));
    log("Express Web Server: " + colors.green("Started"));
    log("Listening on port: " + colors.yellow(app.get('port')));
    log(colors.gray("-----------------------------------"));
    log('');
  });

  return server;
};
