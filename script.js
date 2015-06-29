var main = require('./src/main.js');

var root = document.querySelector('#root');

function ViewModel() {
  var self = this;

  this.isInProgress = ko.observable(false);

  this.searchMode= ko.observable("exactly");

  this.generateIndex = function() {
    self.isInProgress(true);

    main.generateIndex()
    .then(function() {
      self.isInProgress(false);
    });
  };

  this.loadIndex = function() {
    self.isInProgress(true);

    main.loadIndex()
    .then(function() {
      self.isInProgress(false);
    });
  };

  this.query = ko.observable("");
  this.results = ko.observableArray();
  this.search = function() {
    self.isInProgress(true);

    main.search(self.query(), this.searchMode())
    .then(function(results) {
      console.log(results);
      self.results(results);
      self.isInProgress(false);
    });
  };
}

var viewModel = new ViewModel();
ko.applyBindings(viewModel, root);
