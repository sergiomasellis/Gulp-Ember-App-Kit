# Gulp Ember App Kit [![Build Status](https://travis-ci.org/sargentsurg/Gulp-Ember-App-Kit.png?branch=master)](https://travis-ci.org/sargentsurg/Gulp-Ember-App-Kit)

Ember App Kit using Gulp (based off EAK and Ember-cli)

## Prerequisites

- Node [Install](http://nodejs.org/download/)
- Gulp `npm install -g gulp-cli`
- Istanbul `npm install -g istanbul` used for test coverage

## Installation

- Download Gulp Ember app kit or use Git.
- Go to the downloaded folder in your command prompt or Terminal (osx)
- Type `npm install` or `sudo npm install` (depends on your setup)
- Next lets install our bower dependencies using `bower install`
- If everything was setup correctly you can now run `gulp`
- Finally go to `http://localhost:8000/`

## Config
- For basic changes to your app environment go to `config/environments.js`

## Basic Commands
- `gulp` This is the default task it "transpiles" your ember app then serves it from the `./build/` dirrectory. It even starts a live reload server to make it easy to get started.
- `gulp clean` Some times you just want a fresh start this deletes the build folder.
- `gulp build` This task will build your project and place it in the build directory.
- `gulp testem` This is a little command to run the testem ci module. The test can be configured on the `testem.json` file.
- `gulp converage` Test converage using [istanbul](https://github.com/gotwarlost/istanbul) and testem. Setup with Qunit.

## API Stub
A small [express](http://expressjs.com/4x/api.html) stub server is included for you to use this server is run on port 3000.
