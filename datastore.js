const AWS = require('aws-sdk');
const url = require('url');

var dynamodb = new AWS.DynamoDB();

function save_put(req, res, bayeux) {
    var uri = url.parse(req.url);
    
    var id = uri.pathname.substring(6); // remove /save/
    
    var body = "";
    
    req.on('data', function(data) {
        body += data;
    });
    
    req.on('end', function() {
        
        var newItem = {
            "name": {
                S: id
            },
            "data": {
                S: body
            }
        };
        
        dynamodb.putItem({
            Item: newItem,
            TableName: "characters"
        }, function(err, data) {
            
            if(err) {
                res.writeHead(500, {"Content-Type": "application/json"});
                res.write(JSON.stringify(err));
                res.end();
                return;
            }
            
            //notify clients
            bayeux.getClient().publish('/' + id + '/character', JSON.parse(body));
            
            res.writeHead(200, { "Content-Type": "application/json"});
            res.write("{\"ok\":true}");
            res.end();
        });
        
        
    }).resume();
}

function save_get(req, res, beyeux) {
    var uri = url.parse(req.url);
    
    var id = uri.pathname.substring(6); // remove /save/
    
    req.on('end', function() {
        
        var params = {
            Key: {
                "name": {
                    S: id
                }
            },
            TableName: "characters"
        }
        
        dynamodb.getItem(params, function(err, data) {
            if(err) {
                res.writeHead(500, {"Content-Type": "application/json"});
                res.write(JSON.stringify(err));
                res.end();
                return;
            }
            
            if(data.Item == null) {
                res.writeHead(404, {"Content-Type": "application/json"});
                res.write("{\"ok\":false}");
                res.end();
                return;
            }
            
            res.writeHead(200, { "Content-Type": "application/json"});
            
            var item = data.Item.data.S;
            
            res.write(item);
            
            res.end();
        });
        
        
    }).resume();
}

module.exports = {
    save: function(req, res, bayeux) {
        if(req.method == "PUT")
        {
            return save_put(req, res, bayeux);
        }
        else if(req.method == "GET")
        {
            return save_get(req, res, bayeux);
        }
    }
};