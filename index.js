var restify = require('restify'),
    spider = require('./lib/spider'),
    server = restify.createServer();

server.use(restify.queryParser());
server.get('/ohio', spider(
  {
    regex: /mailto:(.+?)\b/gm, 
    map: function(match){
      console.log(match);
      return match[1] + match[2] + match[3] + match[4];
    }
  })
);
server.get('/', spider());

server.listen(8080);
