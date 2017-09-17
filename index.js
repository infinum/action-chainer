module.exports = function chainer(options) {
  var config = {
    reducer: options && options.reducer,
    argsTransformer: options && options.argsTransformer
  };
  var request = Promise.resolve().then(config.reducer);

  return {
    chain: function chain(func, args, ctx) {
      var chainRequest = request.then(function executeChain(state) {
        var opts = config.argsTransformer ? config.argsTransformer(args, state) : args;
        return func.apply(ctx, opts);
      });
      request = chainRequest.then(config.reducer);
      return chainRequest;
    }
  };
};
