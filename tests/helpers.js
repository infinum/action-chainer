var nock = require('nock');

module.exports = function mockApi(options) {
  var defaults = {
    method: 'GET',
    url: '/',
    hostname: 'http://example.com',
    query: true,
    headers: {'content-type': 'application/json'},
    reqheaders: {},
    status: 200,
    delay: 0
  };

  var opts = Object.assign({}, defaults, options);

  return nock(opts.hostname, {reqheaders: opts.reqheaders})
    .replyContentLength()
    .intercept(opts.url, opts.method, opts.data)
    .query(opts.query)
    .delay(opts.delay)
    .reply(200, function() {
      return [opts.status, opts.response];
    }, opts.headers);
};
