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
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    refresh = require('gulp-livereload'),
    plumber = require('gulp-plumber'),
    gutil = require("gulp-util"),
    preprocess = require('gulp-preprocess'),
    replace = require('gulp-replace'),
    static = require('serve-static'),
    testem = require('testem'),
    http = require('http'),
    server = require('tiny-lr')(),
    connect = require("connect"),
    open = require("open"),
    fs = require('fs'),
    path = require('path');

var log = gutil.log,
    colors = gutil.colors;

// production env options: "dev" "test" "prod"
process.env.NODE_ENV = "dev";

// Clean old files in the build folder
gulp.task('clean', function () {

    log('');
    log(colors.gray("-----------------------------------"));
    log("Build Status: " + colors.green("Build Cleaned"));
    log(colors.gray("-----------------------------------"));
    log('');

   return gulp.src(['build', 'coverage', 'coverage.json'], {
            read: false
        })
        .pipe(clean({
            force: true
        }));
});

// Load Script files es6 modules
gulp.task('scripts', function () {

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
gulp.task('templates', function () {

    log('');
    log(colors.gray("-----------------------------------"));
    log("Build Status: " + colors.yellow("Compiling Templates"));
    log(colors.gray("-----------------------------------"));
    log('');

    gulp.src(['app/**/*.hbs'])
        .pipe(plumber())
        .pipe(handlebars({
            outputType: "amd",
            namespace: "appkit"
        }))
        .pipe(concat('templates.js'))
        .pipe(gulp.dest('build/assets/js'))
        .pipe(refresh(server));
});

// Run Test Files / jshint for code cleanup
gulp.task('jshint', function () {

    log('');
    log(colors.gray("-----------------------------------"));
    log("Build Status: " + colors.green("Testing"));
    log(colors.gray("-----------------------------------"));
    log('');

    gulp.src(['app/**/*.js'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'));
});


// Copy all static assets
gulp.task('copy', function () {

    log('');
    log(colors.gray("-----------------------------------"));
    log("Build Status: " + colors.yellow("Copying Files"));
    log(colors.gray("-----------------------------------"));
    log('');

    gulp.src('app/img/**')
        .pipe(gulp.dest('build/assets/img/'));

    gulp.src('app/styles/**')
        .pipe(gulp.dest('build/assets/styles/'))
        .pipe(refresh(server));

    gulp.src(['public/assets/**'])
        .pipe(gulp.dest('build/assets/'));

    gulp.src('vendor/**/**')
        .pipe(gulp.dest('build/assets/vendor/'));

    gulp.src('app/*.html')
        .pipe(preprocess({
            context: {
                ENV: JSON.stringify(require("./config/environment")(process.env.NODE_ENV))
            }
        }))
        .pipe(gulp.dest('build'));
});


// Live Reload Server for instant file change reload
gulp.task('livereload', function () {
    log('');
    log(colors.gray("-----------------------------------"));
    log("Build Status: " + colors.yellow("Starting Live Reload Server"));
    log(colors.gray("-----------------------------------"));
    log('');

    server.listen(35729, function (err) {
        if (err) return console.log(err);
    });
});


// Deploy code to Folder use: "gulp deploy"
gulp.task('deploy', ['clean', 'build'],function () {
    gulp.src('build/**')
        .pipe(gulp.dest('dist/'));
});

gulp.task('coverage', function () {

    // added coverage to api-stub server
    var expressServer = require('./api-stub/routes.js');
    expressServer(log, gutil.colors);

    log('');
    log(colors.gray("-----------------------------------"));
    log("Listening on port: " + colors.yellow(3000));
    log(colors.gray("-----------------------------------"));
    log('');

});

gulp.task('testem', ['build', 'copy-tests'], function () {

    var file = __dirname + '/testem.json';
    return fs.readFile(file, 'utf8', function (err, data) {

        data = JSON.parse(data);
        var api = new testem();
        return api.startCI(data);

        // console.dir(data);
    });
});

gulp.task('copy-tests', function(){

    gulp.src('tests/*.html')
        .pipe(preprocess({
            context: {
                ENV: JSON.stringify(require("./config/environment")(process.env.NODE_ENV))
            }
        }))
        .pipe(gulp.dest('build'));

    // Test
    gulp.src("tests/**/**/*.js")
        .pipe(plumber())
        .pipe(es6ModuleTranspiler({
            type: "amd",
            namespace: "appkit/tests"
        }))
        .pipe(concat('tests.js'))
        .pipe(gulp.dest("build/tests/"));

    gulp.src("test/*.js")
        .pipe(gulp.dest("build/tests/"));
});


//Server
gulp.task('servers', function (callback) {
    var log = gutil.log,
        colors = gutil.colors;

    log('');
    log(colors.gray("-----------------------------------"));
    log("Build Status: " + colors.yellow("Starting Servers"));
    log(colors.gray("-----------------------------------"));
    log('');

    var SERVER_PORT = 8000;

    //devApp = connect().use(static('build'));
    // console.log(devApp);

    var apiServer = require('./api-stub/routes.js');
        apiServer(log, colors);

    var webServer = require('./api-stub/server.js');
        webServer({
          port: SERVER_PORT, //set server port
          log: log,
          colors: colors
        });
});

//gulp watch
gulp.task('watch', function () {

    log('');
    log(colors.gray("-----------------------------------"));
    log("Build Status: " + colors.yellow("Watching for Changes"));
    log(colors.gray("-----------------------------------"));
    log('');

    var watcher = gulp.watch(['app/adapters/**', 'app/components/**', 'app/controllers/**', 'app/helpers/**', 'app/models/**', 'app/routes/**', 'app/views/**', 'app/*.js'], ['scripts']);
    gulp.watch(['app/styles/**', 'app/*.html'], ['copy']);
    gulp.watch(['app/templates/**'], ['templates']);

    watcher.on('change', function (event) {
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
gulp.task('build', ['scripts', 'jshint', 'copy', 'templates'], function () {

    log('');
    log(colors.gray("-----------------------------------"));
    log("Build Status: " + colors.green("Compiling Build"));
    log(colors.gray("-----------------------------------"));
    log('');
});


// The default task (called when you run `gulp`)
gulp.task('default', ['livereload', 'jshint', 'scripts', 'copy', 'templates', 'servers', 'watch'], function () {

    log('');
    log(colors.gray("-----------------------------------"));
    log("Build Status: " + colors.green("Completed"));
    log(colors.gray("-----------------------------------"));
    log('');
});
