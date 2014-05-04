/*
  Author: Sergio Masellis
  Company: ""
  Version: 0.0.1
  Description: Enables use of Ember App Kit with Gulp streaming builder
  Find plugins at https://npmjs.org/browse/keyword/gulpplugin
*/
// Required Plugins
var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  handlebars = require('gulp-handlebars'),
  jshint = require('gulp-jshint'),
  es6ModuleTranspiler = require("gulp-es6-module-transpiler"),
  concat = require('gulp-concat-sourcemap'),
  clean = require('gulp-clean'),
  refresh = require('gulp-livereload'),
  plumber = require('gulp-plumber'),
  gutil = require("gulp-util"),
  testem = require('gulp-testem'),
  preprocess = require('gulp-preprocess'),
  http = require('http'),
  server = require('tiny-lr')(),
  connect = require("connect"),
  open = require("open"),
  fs = require('fs'),
  exec = require('child_process').exec,
  http = require('http'),
  open = require('open'),
  qunit = require('gulp-qunit'),
  _ = require('underscore'),
  path = require('path');

var log = gutil.log,
  colors = gutil.colors;

// production env options: "dev" "test" "prod"
process.env.NODE_ENV = "dev";

// Clean old files in the build folder
gulp.task('clean', function() {

  log('');
  log(colors.gray("-----------------------------------"));
  log("Build Status: " + colors.green("Build Cleaned"));
  log(colors.gray("-----------------------------------"));
  log('');

  gulp.src(['build', 'coverage', 'coverage.json'], {
    read: false
  })
    .pipe(clean({
      force: true
    }));
});

// Load Script files es6 modules
gulp.task('scripts', function() {

  log('');
  log(colors.gray("-----------------------------------"));
  log("Build Status: " + colors.yellow("Compiling Scripts"));
  log(colors.gray("-----------------------------------"));
  log('');

  gulp.src("app/**/**/*.js")
    .pipe(plumber())
    .pipe(es6ModuleTranspiler({
      type: "amd",
      namespace: "appkit"
    }))
    .pipe(uglify())
    .pipe(concat('app.js'))
    .pipe(gulp.dest("build/assets/js"))
    .pipe(refresh(server));
});

// Compile Handlebar Templates
gulp.task('templates', function() {

  log('');
  log(colors.gray("-----------------------------------"));
  log("Build Status: " + colors.yellow("Compiling Templates"));
  log(colors.gray("-----------------------------------"));
  log('');

  gulp.src(['app/**/*.hbs'])
    .pipe(plumber())
    .pipe(handlebars({
      outputType: "amd",
      templateRoot: "appkit"
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('build/assets/js'))
    .pipe(refresh(server));
});

// Run Test Files / jshint for code cleanup
gulp.task('test', function() {

  log('');
  log(colors.gray("-----------------------------------"));
  log("Build Status: " + colors.green("Testing"));
  log(colors.gray("-----------------------------------"));
  log('');

  gulp.src(['app/**/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));

  // Test
  gulp.src("tests/**/**/*.js")
    .pipe(plumber())
    .pipe(es6ModuleTranspiler({
      type: "amd"
    }))
    .pipe(concat('tests.js'))
    .pipe(gulp.dest("build/tests/"));

  gulp.src("test/*.js")
    .pipe(gulp.dest("build/tests/"));
});


// Copy all static assets
gulp.task('copy', function() {

  log('');
  log(colors.gray("-----------------------------------"));
  log("Build Status: " + colors.yellow("Copying Files"));
  log(colors.gray("-----------------------------------"));
  log('');

  gulp.src('app/img/**')
    .pipe(gulp.dest('build/assets/img'))
    .pipe(refresh(server));

  gulp.src('app/styles/**')
    .pipe(gulp.dest('build/assets/styles/'))
    .pipe(refresh(server));

  gulp.src(['public/assets/**'])
    .pipe(gulp.dest('build/assets/'));

  gulp.src('vendor/**/**')
    .pipe(gulp.dest('build/assets/vendor/'));



  gulp.src('app/*.html')
    .pipe(preprocess())
    .pipe(gulp.dest('build'));
});


// Live Reload Server for instant file change reload
gulp.task('lr-server', function() {
  log('');
  log(colors.gray("-----------------------------------"));
  log("Build Status: " + colors.yellow("Starting Live Reload Server"));
  log(colors.gray("-----------------------------------"));
  log('');

  server.listen(35729, function(err) {
    if (err) return console.log(err);
  });
});


// Deploy code to ./IOS Folder use: "gulp deploy"
gulp.task('deploy', function() {
  gulp.src('build/**')
    .pipe(gulp.dest('../../IOS/trunk/www/'));
});

gulp.task('testem', ['coverage'], function() {
  gulp.src([''])
    .pipe(testem({
      configFile: 'testem.json'
    }));
});

gulp.task('coverage', function() {

  var coverageServer = http.createServer(function(req, resp) {
    console.log(req, resp);
    req.pipe(fs.createWriteStream('coverage.json'))
    resp.end()
  });

  var port = 7358;
  coverageServer.listen(port);

  log('');
  log(colors.gray("-----------------------------------"));
  log("Listening on port: " + colors.yellow(port));
  log(colors.gray("-----------------------------------"));
  log('');

});

//Server
gulp.task('servers', function(callback) {
  var devApp, devServer, devAddress, devHost, url, log = gutil.log,
    colors = gutil.colors;

  log('');
  log(colors.gray("-----------------------------------"));
  log("Build Status: " + colors.yellow("Starting Servers"));
  log(colors.gray("-----------------------------------"));

  devApp = connect()
    .use(connect.static('build'));

  // change port and hostname to something static if you prefer
  devServer = http.createServer(devApp).listen(8000 /*, hostname*/ );

  devServer.on('error', function(error) {
    log(colors.underline(colors.red('ERROR')) + ' Unable to start server!');
    callback(error); // we couldn't start the server, so report it and quit gulp
  });

  devServer.on('listening', function() {
    devAddress = devServer.address();
    devHost = devAddress.address === '0.0.0.0' ? 'localhost' : devAddress.address;
    url = 'http://' + devHost + ':' + devAddress.port + '/index.html';

    log('');
    log('Started dev server at ' + colors.magenta(url));
    if (gutil.env.open) {
      log('Opening dev server URL in browser');
      open(url);
    } else {
      log(colors.gray('(Run with --open to automatically open URL on startup)'));
    }
    log('');
    callback(); // we're done with this task for now
  });
});

//gulp watch
gulp.task('watch', function() {

  log('');
  log(colors.gray("-----------------------------------"));
  log("Build Status: " + colors.yellow("Watching for Changes"));
  log(colors.gray("-----------------------------------"));
  log('');

  var watcher = gulp.watch(['app/adapters/**', 'app/components/**', 'app/controllers/**', 'app/helpers/**', 'app/models/**', 'app/routes/**', 'app/views/**', 'app/*.js'], ['scripts']);
  gulp.watch(['app/styles/**', 'app/*.html'], ['copy']);
  gulp.watch(['app/templates/**'], ['templates']);

  watcher.on('change', function(event) {
    log('');
    log(colors.gray("-----------------------------------"));
    log("Build Status: " + colors.yellow("Recompiling"));
    log(colors.gray("-----------------------------------"));
    log('');

    var fileName = event.path.split("/");
    log('File ' + colors.yellow(fileName[fileName.length - 2] + "/" + fileName[fileName.length - 1]) + ' was ' + event.type);
  });
});


// Build task
gulp.task('build', ['scripts', 'test', 'copy', 'templates'], function() {

  log('');
  log(colors.gray("-----------------------------------"));
  log("Build Status: " + colors.green("Compiling Build"));
  log(colors.gray("-----------------------------------"));
  log('');
});


// The default task (called when you run `gulp`)
gulp.task('default', ['lr-server', 'test', 'scripts', 'copy', 'templates', 'servers', 'watch'], function() {

  log('');
  log(colors.gray("-----------------------------------"));
  log("Build Status: " + colors.green("Completed"));
  log(colors.gray("-----------------------------------"));
  log('');
});
