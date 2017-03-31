const {expect} = require('chai');
const mockApi = require('./helpers');
const originalFetch = require('isomorphic-fetch');
const {init, fetch} = require('./index');

describe('api-chainer', () => {
  it('should make a single API call', () => {
    mockApi({
      response: () => ({success: true})
    });

    init({fetch: originalFetch});

    return fetch('http://example.com')
      .then((res) => res.json())
      .then((data) => {
        expect(data.success).to.equal(true);
      });
  });

  it('should be able to make multiple API calls', () => {
    mockApi({
      response: () => ({success: true})
    });

    mockApi({
      response: () => ({success: false})
    });

    init({fetch: originalFetch});

    return fetch('http://example.com')
      .then((res) => res.json())
      .then((data) => {
        expect(data.success).to.equal(true);
      })
      .then(() => {
        return fetch('http://example.com');
      })
      .then((res) => res.json())
      .then((data) => {
        expect(data.success).to.equal(false);
      });
  });

  it('should be able to make sequential calls with header data', () => {
    mockApi({
      url: '/1/1',
      response: () => ({success: 1}),
      headers: {'x-value': '1'},
      delay: 10
    });

    mockApi({
      url: '/1/2',
      reqheaders: {'x-value': '1'},
      response: () => ({success: 2}),
      headers: {'x-value': '2'},
      delay: 5
    });

    mockApi({
      url: '/1/3',
      reqheaders: {'x-value': '2'},
      response: () => ({success: 3})
    });

    init({
      fetch: originalFetch,
      reducer(res) {
        const state = {
          headers: {
            'x-value': res ? res.headers.get('x-value') : null
          }
        };
        return state;
      },
      requestTransformer(url, head, state) {
        return state;
      }
    });

    const requests = [
      fetch('http://example.com/1/1'),
      fetch('http://example.com/1/2'),
      fetch('http://example.com/1/3')
    ];

    return Promise.all(requests)
      .then((ress) => Promise.all(ress.map((res) => res.json())))
      .then((data) => {
        expect(data[0].success).to.equal(1);
        expect(data[1].success).to.equal(2);
        expect(data[2].success).to.equal(3);
      });
  });
});
