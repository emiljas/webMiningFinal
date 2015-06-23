var _ = require('lodash');
var fulltextsearchlight = require('full-text-search-light');

var indexPath = '/media/emil/dell/index';

function Searcher() {
  var self = this;

  var searcher = new fulltextsearchlight({
    index_amount: 1
  });

  this.add = function(item) {
    return new Promise(function(resolve) {
      searcher.add(item);
      resolve();
    });
  };

  this.saveIndex = function() {
    return new Promise(function(resolve) {
      searcher.saveSync(indexPath);
      resolve();
    });
  };

  this.loadIndex = function() {
    return new Promise(function(resolve) {
      searcher = fulltextsearchlight.loadSync(indexPath);
      resolve();
    });
  };

  this.search = function(query, mode) {
    return new Promise(function(resolve) {
      var results = [];
      if(mode == 'word' || mode == 'exactly') {
        results = searcher.search(query);
        resolve(results);
      }
      else if(mode == 'words') {
        var words = query.split(' ');
        var searchPromises = _.map(words, function(word) { return self.search(word, 'word'); });
        Promise.all(searchPromises)
        .then(function(results) {
          var result = [];
          var rankIndex = 0;

          for(var resultsIndex = results.length - 1; resultsIndex >= 0; resultsIndex--) {
            var currentResults = results[resultsIndex];

            if(currentResults.length == rankIndex)
              results.splice(resultsIndex, 1);
            else
              result.push(currentResults[rankIndex]);

            if(resultsIndex == 0 && results.length > 0) {
              resultsIndex = results.length;
              rankIndex++;
            }
          }

          resolve(result);
        });
      }
    });
  };

}

module.exports = Searcher;
