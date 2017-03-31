const nock = require('nock');

module.exports = function mockApi({
  method = 'GET',
  url = '/',
  hostname = 'http://example.com',
  data,
  query = true,
  response,
  headers = {'content-type': 'application/json'},
  reqheaders = {},
  status = 200,
  delay = 0
}) {
  return nock(hostname, {reqheaders})
    .replyContentLength()
    .intercept(url, method, data)
    .query(query)
    .delay(delay)
    .reply(200, () => [status, response(url)], headers);
}
