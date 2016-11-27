# Express user API

A simple API rest made with express and ES6+.

## Instructions

To run this project you must install [node.js](https://nodejs.org/en/) 6.6+

I recommend using the latest LTS version

## Installing

1. Clone this repository `git clone https://github.com/ortense/express-user-api.git`.
2. In the project folder, run `npm install`, this process could take a while.

## Running the tests

For all tests
```
npm test
```

For lint with [eslit](http://eslint.org)
```
npm run lint
```

For unit tests with [mocha](https://mochajs.org) and [chai](http://chaijs.com)
```
npm run test-unit
```

For integration tests with [mocha](https://mochajs.org), [chai](http://chaijs.com) and [supertest](https://www.npmjs.com/package/supertest)
```
npm run test-integration
```

For contract tests with [mocha](https://mochajs.org), [joi](https://www.npmjs.com/package/joi) and [joi-assert](https://www.npmjs.com/package/joi-assert)
```
npm run test-contract
```

## Running project in development mode

In development mode this project use [nodemon](http://nodemon.io) for automatically restart for each changes in source code.

```
npm run dev
```

## Running project in production

Just run `npm start`

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
