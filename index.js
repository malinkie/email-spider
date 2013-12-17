var restify = require('restify'),
    spider = require('./lib/spider'),
    server = restify.createServer();

server.use(restify.queryParser());
server.get('/ohio', spider(
  {
    regex: /mailto:(.+)\shref/gm, 
    map: function(match){
      debugger;
      return match[1].replace(/['\+'"]/g, "");
    }
  })
);
server.get('/', spider());

server.listen(8080);
