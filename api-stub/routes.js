module.exports = function(log, colors) {
    var express = require('express');
    var fs = require('fs');
    var expressServer = express();

    expressServer.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

    expressServer.get('/accounts/all', function(req, res) {
        var accounts = {
            "user": [{
                "id": 1,
                "email": "sergio@domain.com",
                "password": "abc123"
            },
            {
                "id": 2,
                "email": "devon@domain.com",
                "password": "abc45"
            }
            ]
        };
        res.send(accounts);
    });

    expressServer.post('/coverage', function(req, res){
      req.pipe(fs.createWriteStream('./coverage.json'))
      res.send('hello world');
      res.end()
    });


    expressServer.listen(3000);

    log('');
    log(colors.gray("-----------------------------------"));
    log("Express Api Server: " + colors.green("Started"));
    log("Listening on port: " + colors.yellow(3000));
    log(colors.gray("-----------------------------------"));
    log('');
};
