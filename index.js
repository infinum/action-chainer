var fetch = typeof window !== 'undefined' && window.fetch;
var request = Promise.resolve();
var config = {fetch: fetch};

module.exports = {
  init: function initChainer(options) {
    config.fetch = options.fetch || fetch;
    config.reducer = options.reducer;
    config.requestTransformer = options.requestTransformer;
    request = Promise.resolve().then(config.reducer);
  },

  fetch: function fetchChainer(input, init) {
    var fetchRequest = request.then(function executeChainedFetch(state) {
      var opts = config.requestTransformer ? config.requestTransformer(input, init, state) : init;
      return config.fetch(input, opts);
    });
    request = fetchRequest.then(config.reducer);
    return fetchRequest;
  }
};
