var root = document.querySelector('#root');

function ViewModel() {
  var self = this;

  this.query = ko.observable("");
  this.items = ko.observableArray(["a", "b", "c"]);

  ko.computed(function() {
    var query = self.query();

    self.items.push(query);
  });
}

var viewModel = new ViewModel();
ko.applyBindings(viewModel, root);
