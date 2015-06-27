var _ = require('lodash');
var downloadPage = require('./downloadPage');
var cleanHtml = require('./cleanHtml');
var Searcher = require('./searcher');

var searcher = new Searcher();

var urlsLimit = 10;

var urls = [
  'http://www.onet.pl',
  'http://www.wp.pl',
  'http://www.gazeta.pl',
];

var doneUrls = {};
var doneUrlsCount = 0;

var urlsQueue = [urls];

function isDone() {
  return (doneUrlsCount >= urlsLimit);
}

function processPagesThenNext() {
  if(urlsQueue.length > 0) {
    return processPages(urlsQueue[0])
    .then(function() {
      if(isDone())
        return processPagesThenNext();
      else
        return Promise.resolve();
    });
  }
  else {
    return Promise.resolve();
  }
}

function processPages(urls) {
  var pagePromises = _.map(urls, function(url) { return processPage(url); });
  return Promise.all(pagePromises)
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
    doneUrlsCount++;

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

function generateIndex() {
  return processPagesThenNext();
}

function loadIndex() {
  return searcher.loadIndex();
}

function search(query) {
  return searcher.loadIndex()
  .then(function() {
    return searcher.search(query, 'words');
  });
}

module.exports = {
  generateIndex: generateIndex,
  loadIndex: loadIndex,
  search: search
};
