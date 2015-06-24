var main = require('./src/main.js');

var root = document.querySelector('#root');

function ViewModel() {
  var self = this;

  this.generateIndex = main.generateIndex;

  this.query = ko.observable("");
  this.results = ko.observableArray(["a", "b"]);
  this.search = function() {
    main.search(self.query())
    .then(function(results) {
      self.results(results);
    });
  };
}

var viewModel = new ViewModel();
ko.applyBindings(viewModel, root);
