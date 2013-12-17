var Q = require('Q'),
    http = require('http'),
    https = require('https'),
    unique = require('mout/array/unique'),
    EMAIL_REGEX = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)\b/gmi;

function getRequest (url) {
  var dfd = Q.defer(),
  requester = (/^https:\/\//.test(url)) ? https : http;
  requester.get(url, function(res){
    var data = ""; 
    res.on('data', function(chunk){
      data += chunk;
    });
    res.on('end', function(){
      dfd.resolve(data);
    });
  })
  .on('error', dfd.reject);
  return dfd.promise;
}

function getEmails(options){

  options = options || {};
  var regex = options.regex || EMAIL_REGEX,
      map = options.map || function(match) {return match;};

  return function(data){
    var dfd = Q.defer(),
        matches = "",
        match = regex.exec(data);

    while (match){
      matches += map(match) + '\n';
      match = regex.exec(data);
    }

    dfd.resolve(unique(matches));
    return dfd.promise;
  };
}

module.exports = function (options){
  return function(req, res, next){
    getRequest(req.query.url || "")
    .then(getEmails(options))
    .then(
      function success(data){
        res.header('Content-Type', 'text/plain');
        res.send(200, data);
      }
    ) 
    .fail(
      function failure(){
        res.send(418, 'I\'m a teapot!');
      }
    );
  };
};
