# Action Chainer

Chain async actions one after another. Makes it easy to do async actions when they depend on each other.

***

[![Build Status](https://travis-ci.org/infinum/action-chainer.svg?branch=master)](https://travis-ci.org/infinum/action-chainer)
[![Test Coverage](https://codeclimate.com/github/infinum/action-chainer/badges/coverage.svg)](https://codeclimate.com/github/infinum/action-chainer/coverage)
[![npm version](https://badge.fury.io/js/action-chainer.svg)](https://badge.fury.io/js/action-chainer)

[![Dependency Status](https://david-dm.org/infinum/action-chainer.svg)](https://david-dm.org/infinum/action-chainer)
[![devDependency Status](https://david-dm.org/infinum/action-chainer/dev-status.svg)](https://david-dm.org/infinum/action-chainer#info=devDependencies)
[![Greenkeeper badge](https://badges.greenkeeper.io/infinum/action-chainer.svg)](https://greenkeeper.io/)

# Installation

```bash
npm install action-chainer
```

## Example: API calls that need to pass headers from one to other

This example will take the `x-value` header from the previous call, and set it for the next one:

```javascript
const Chainer = require('action-chainer');
const chainer = new Chainer({

  // Sets the state after a successful action
  reducer: function(res) {
    var state = {
      headers: {
        'x-value': res ? res.headers.get('x-value') : null
      }
    };
    return state;
  },

  // Prepares the action arguments based on the given arguments and state
  argsTransformer: function([input, init], state) {
    return [input, state];
  }
});

// Wraps around the fetch API
const chainableFetch = (input, init) => chain(window.fetch, [input, init], window);

Promise.all([
  chainableFetch('/foo'),
  chainableFetch('/bar'),
  chainableFetch('/baz')
]).then((responses) => {
  // Handle the responses
  // Fetch calls were done one after another and the `x-value` header was passed from one to another
});
```

## Docs

### Constructor

The constructor accepts an options object that can contain two methods:

#### reducer(result)

The reducer method receives the action result, and should return a new state

#### argsTransformer(functionArgs, state)

The argsTransformer receives a list of arguments given to the chained function (as an array) and the state returned by the reducer of the previous action. It should return an array of arguments that should be passed to the original wrapped action function

### chain(func, args, ctx)

The chainer instance has only one method - chain. It receives the function we want to call, an array of arguments we want to pass to it and the context we want to use (optional).
Chain can be used for one time chained calls, but it can also be used to wrap functions for multiple uses (like in the example above)

## License

The [MIT License](LICENSE)

## Credits

action-chainer is maintained and sponsored by
[Infinum](http://www.infinum.co).

<img src="https://infinum.co/infinum.png" width="264">