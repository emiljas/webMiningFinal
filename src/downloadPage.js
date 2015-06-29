var request = require("request");
var charset = require("charset");
var iconv = require("iconv-lite");

var connectionsLimit = 4;
var connectionCount = 0;

setInterval(function() {
  console.log('downloadPage', connectionCount);
}, 5000);

function downloadPage(url) {
  if (connectionCount >= connectionsLimit) {
    return new Promise(function(resolve) {
      setTimeout(resolve, 1000);
    })
    .then(function() {
      return downloadPage(url);
    });
  }
  else {
    return new Promise(function(resolve, reject) {
        connectionCount++;
        request.get({
          uri: url,
          encoding: null,
          timeout: 20000
        }, function(err, res, body) {
          if (err)
            reject(err);

          try {
            var encoding = charset(res.headers, body);
            var content;
            if (encoding != null)
              content = iconv.decode(body, encoding);
            else
              content = body.toString();
            resolve(content);
          } catch (err) {
            reject(err);
          }
        }).on("error", function(err) {
          reject(err);
        });
    })
    .then(function(html) {
      connectionCount--;
      return Promise.resolve(html);
    })
    .catch(function(err) {
      connectionCount--;
      return Promise.reject(err);
    });
  }
}

module.exports = downloadPage;
