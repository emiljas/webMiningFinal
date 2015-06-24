var _ = require('lodash');
var downloadPage = require('./downloadPage');
var cleanHtml = require('./cleanHtml');
var Searcher = require('./searcher');

// var urls = [
//   'http://www.onet.pl',
//   'http://www.wp.pl',
//   'http://www.gazeta.pl',
// ];

var urls = [
  "http://www.altpress.org/",
  "http://www.nzfortress.co.nz",
  "http://www.evillasforsale.com",
  "http://www.playingenemy.com/",
  "http://www.richardsonscharts.com",
  "http://www.xenith.net",
  "http://www.tdbrecords.com",
  "http://www.electrichumanproject.com/",
  "http://tweekerchick.blogspot.com/",
  "http://www.besound.com/pushead/home.html",
  "http://www.porkchopscreenprinting.com/",
  "http://www.kinseyvisual.com",
  "http://www.rathergood.com",
  "http://www.lepoint.fr/",
  "http://www.revhq.com",
  "http://www.poprocksandcoke.com",
  "http://www.samuraiblue.com/",
  "http://www.openbsd.org/cgi-bin/man.cgi",
  "http://www.sysblog.com",
  "http://www.voicesofsafety.com",
  "http://www.lambgoat.com/",
  "http://paul.kedrosky.com/",
  "http://www.sallyskrackers.com",
  "http://www.starmen.net",
  "http://www.casbahmusic.com/",
  "http://www.bowlingshirt.com",
  "http://www.ems.org/",
  "http://www.primedeep.com",
  "http://www.lovehammers.com/",
  "http://www.lifehacker.com",
  "http://danklife.com",
  "http://www.whichisworse.com",
  "http://www.getmusic.com/",
  "http://www.apple.com/support/",
  "http://www.brunching.com/toys/toy-alanislyrics.html",
  "http://www.loftkoeln.de/loftframes.html",
  "http://www.monoroid.com",
  "http://www.diyordie.com",
  "http://you.alterFin.org/",
  "http://www.atarimagazines.com/",
  "http://www.reforms.net",
  "http://screwattack.com/",
  "http://www.gaijinagogo.com",
  "http://www.yarrah.com"
];

var searcher = new Searcher();

function generateIndex() {
  var pagePromises = _.map(urls, function(url) { return processPage(url); });
  Promise.all(pagePromises)
  .then(function() {
    return searcher.saveIndex();
  })
  .then(function() {
    console.log("INDEX SAVED");
  })
  .catch(function(err) {
    console.log(err);
  });

  function processPage(url) {
    return downloadPage(url)
    .then(function(html) {
      return cleanHtml(html);
    })
    .then(function(text) {
      return searcher.add({
        url: url,
        text: text
      });
    })
    .then(function() {
      console.log("DONE");
    })
    .catch(function(err) {
      console.log(err);
    });
  }
}

function search(query) {
  return searcher.loadIndex()
  .then(function() {
    return searcher.search(query, 'word');
  });
}

module.exports = {
  generateIndex: generateIndex,
  search: search
};
