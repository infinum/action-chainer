/* global describe, it */

var chai = require('chai');
var mockApi = require('./helpers');
var originalFetch = require('isomorphic-fetch');
var Chainer = require('../index');

var expect = chai.expect;

var fetchInit = function(chain) {
  return function(input, init) {
    return chain(originalFetch, [input, init]);
  };
};

describe('api-chainer', function() {
  it('should make a single API call', function() {
    mockApi({response: {success: true}});

    var chainer = new Chainer();
    var fetch = fetchInit(chainer.chain);

    return fetch('http://example.com')
      .then(function(res) {
        return res.json();
      })
      .then(function(data) {
        expect(data.success).to.equal(true);
      });
  });

  it('should be able to make multiple API calls', function() {
    mockApi({response: {success: true}});
    mockApi({response: {success: false}});

    var chainer = new Chainer();
    var fetch = fetchInit(chainer.chain);

    var first = fetch('http://example.com')
      .then(function(res) {
        return res.json();
      })
      .then(function(data) {
        expect(data.success).to.equal(true);
      });

    var second = fetch('http://example.com')
      .then(function(res) {
        return res.json();
      })
      .then(function(data) {
        expect(data.success).to.equal(false);
      });

    return Promise.all([first, second]);
  });

  it('should be able to make sequential calls with header data', function() {
    mockApi({
      url: '/1/1',
      response: {success: 1},
      headers: {'x-value': '1'},
      delay: 10
    });

    mockApi({
      url: '/1/2',
      reqheaders: {'x-value': '1'},
      response: {success: 2},
      headers: {'x-value': '2'},
      delay: 5
    });

    mockApi({
      url: '/1/3',
      reqheaders: {'x-value': '2'},
      response: {success: 3}
    });

    var chainer = new Chainer({
      reducer: function(res) {
        var state = {
          headers: {
            'x-value': res ? res.headers.get('x-value') : null
          }
        };
        return state;
      },
      argsTransformer: function(args, state) {
        return [args[0], state];
      }
    });
    var fetch = fetchInit(chainer.chain);

    var requests = [
      fetch('http://example.com/1/1'),
      fetch('http://example.com/1/2'),
      fetch('http://example.com/1/3')
    ];

    return Promise.all(requests)
      .then(function(res) {
        return Promise.all(res.map(function(resp) {
          return resp.json();
        }));
      })
      .then(function(data) {
        expect(data[0].success).to.equal(1);
        expect(data[1].success).to.equal(2);
        expect(data[2].success).to.equal(3);
      });
  });
});
