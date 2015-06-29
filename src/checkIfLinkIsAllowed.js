var robots = require('cyborg.txt');

var bot = new robots.Bot({
  agent: 'Webcrawler',
  maxAge: 60000
});

var limit = 4;
var i = 0;
var timeout = 5000;

setInterval(function() {
  console.log('checkIfUrlIsAllowed', i);
}, 5000);


function checkIfUrlIsAllowed(url) {
  // console.log(url);

  if(i >= limit) {
    return new Promise(function(resolve) {
      setTimeout(resolve, 1000);
    })
    .then(function() {
      return checkIfUrlIsAllowed(url);
    });
  }
  else {
    return new Promise(function(resolve) {
      i++;
      var timeoutId = setTimeout(function() { resolve(false); }, timeout)
      bot.allows(url, function() { clearTimeout(timeoutId); resolve(true); });
      bot.disallows(url, function() { clearTimeout(timeoutId); resolve(false); });
    })
    .then(function(isAllowed) {
      i--;
      return Promise.resolve(isAllowed);
    })
    .catch(function(err) {
      i--;
      return Promise.reject(err);
    });
  }
}

module.exports = checkIfUrlIsAllowed;
