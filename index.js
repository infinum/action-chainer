var fetch = typeof window !== 'undefined' && window.fetch;
var request = Promise.resolve();
var config = {fetch: fetch};

var chainer = {
  init: function initChainer(options) {
    config.fetch = options.fetch || fetch;
    config.reducer = options.reducer;
    config.argsTransformer = options.argsTransformer;
    request = Promise.resolve().then(config.reducer);
  },

  chain: function chainer(func, args, ctx) {
    var chainRequest = request.then(function executeChain(state) {
      var opts = config.argsTransformer ? config.argsTransformer(args, state) : args;
      return func.apply(ctx, opts);
    });
    request = chainRequest.then(config.reducer);
    return chainRequest;
  },

  fetch: function fetchChainer(input, init) {
    return chainer.chain(config.fetch, [input, init]);
  }
};

module.exports = chainer;
