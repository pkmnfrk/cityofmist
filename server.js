const AWS = require('aws-sdk');

AWS.config.update({region: 'us-east-1'});

const http = require('http');
const faye = require('faye');
const static = require('node-static');
const datastore = require("./datastore");
const url = require('url');


var bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});
var fileServer = new static.Server('./static', { cache: 0 });

var server = http.createServer(function (req, res) {
    var uri = url.parse(req.url);
    
    if(uri.pathname.startsWith("/save/")) {
        return datastore.save(req, res, bayeux);
    }
    
    req.addListener('end', function() {
        fileServer.serve(req, res);
    }).resume();
    
});

bayeux.attach(server);
server.listen(process.env.PORT || 8000);