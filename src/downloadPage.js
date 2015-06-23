var request = require("request");
var charset = require("charset");
var iconv = require("iconv-lite");

function downloadPage(url) {
  return new Promise(function(resolve, reject) {
    request.get({
         uri: url,
         encoding: null,
         timeout: 10000
       }, function(err, res, body) {
         if(err)
          reject(err);

         try {
           var encoding = charset(res.headers, body);
           var content;
           if(encoding != null)
             content = iconv.decode(body, encoding);
           else
             content = body.toString();
           resolve(content);
         }
         catch(err) {
           reject(err);
         }
       }
    ).on("error", function(err) {
         reject(err);
     });
  });
}

module.exports = downloadPage;
