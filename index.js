module.exports = function(options) {
  var request = Promise.resolve();
  var config = {};
  config.reducer = options && options.reducer;
  config.argsTransformer = options && options.argsTransformer;
  request = Promise.resolve().then(config.reducer);

  return {
    chain: function chainer(func, args, ctx) {
      var chainRequest = request.then(function executeChain(state) {
        var opts = config.argsTransformer ? config.argsTransformer(args, state) : args;
        return func.apply(ctx, opts);
      });
      request = chainRequest.then(config.reducer);
      return chainRequest;
    }
  };
};
