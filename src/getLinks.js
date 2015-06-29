var parseUrl = require('url').parse.bind(require('url'));
var cheerio = require("cheerio");

function getLinks(url, html) {
  var anchors = [];
  if(html) {
    var $ = cheerio.load(html);
    var anchorNodes = $("a");
    for(var i = 0; i < anchorNodes.length; i++) {
      var link = cheerio(anchorNodes[i]).attr("href");
      if(!link || link.indexOf('#') == 0)
        continue;
      else {
        if(link.indexOf('/') == 0) {
          var origin = parseUrl(link);
          link = origin.protocol + '//' + origin.hostname + link
        }
        anchors.push(link);
      }

    }
  }
  return anchors;
}

module.exports = getLinks;
