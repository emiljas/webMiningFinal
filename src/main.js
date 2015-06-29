var _ = require('lodash');
var downloadPage = require('./downloadPage');
var cleanHtml = require('./cleanHtml');
var getLinks = require('./getLinks');
var checkIfUrlIsAllowed = require('./checkIfLinkIsAllowed');
var Searcher = require('./searcher');

var searcher = new Searcher();

var urlsLimit = 3000;

var urls = [
   'http://www.onet.pl',
   'http://www.wp.pl',
   'http://www.gazeta.pl',
   'http://www.google.pl'

];

var doneUrls = {};
var doneUrlsCount = 0;

var urlsQueue = [urls];

function isDone() {
  return (doneUrlsCount >= urlsLimit);
}

function processPagesThenNext() {
  if (urlsQueue.length > 0) {
    return processPages(urlsQueue[0])
      .then(function() {
        if (isDone())
          return Promise.resolve();
        else {
          urlsQueue.splice(0, 1);
          return processPagesThenNext();
        }
      })
      .catch(function(err) {
        // console.log('processPagesThenNext', err);
      });
  } else {
    return Promise.resolve();
  }
}

function processPages(urls) {
  var pagePromises = _.map(urls, function(url) {
    return processPage(url);
  });

  var timeoutPromise = new Promise(function(resolve) {
    setTimeout(resolve, 10 * 60 * 1000);
  });

  var allPromise = Promise.all(pagePromises)
  .then(function() {
    // console.log('PROCESS PAGES DONE')
  })
  .catch(function(err) {
    // console.log('PROCESS PAGES ERR', err);
  });

  return Promise.race([allPromise, timeoutPromise]);
}

function processPage(url) {
  if (isDone() || doneUrls[url] !== undefined) {
    return Promise.resolve();
  }
  else {
    doneUrls[url] = url;



    // var timeout = new Promise(function(resolve) {
    //   setTimeout(resolve, 5000);
    // });


    /*var promise = */ return checkIfUrlIsAllowed(url)
    .then(function(isAllowed) {
      if(isAllowed) {
        return downloadPage(url)
        .then(function(html) {
          var urls = getLinks(url, html);
          urlsQueue.push(urls);
          return cleanHtml(html);
        })
        .then(function(text) {
          return searcher.add({
            url: url,
            text: text
          });
        })
        .then(function() {
          doneUrlsCount++;
        })
        .catch(function(err) {
          // console.log('processPage', urls.length, doneUrlsCount, url, err);
        });
      }
      else return Promise.resolve();
    })
    .catch(function() {
      // console.log("processPage ERR")
    });


    // return Promise.race([timeout, promise]);




  }
}

setInterval(function() {
  console.log("done", doneUrlsCount);
}, 5000);

function generateIndex() {
  return processPagesThenNext()
    .then(function() {
      console.log('saving index');
      return searcher.saveIndex();
    });
}

function loadIndex() {
  return searcher.loadIndex();
}

function search(query, mode) {
  return searcher.loadIndex()
    .then(function() {
      return searcher.search(query, mode);
    });
}

module.exports = {
  generateIndex: generateIndex,
  loadIndex: loadIndex,
  search: search
};
