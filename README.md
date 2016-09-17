<center><img src="sandshark.png?raw=true" height="245" /></center><br/>
*Image is not under MIT license (c) [Cryptid-Creations](http://cryptid-creations.deviantart.com/)*

# sandshark
- zero dependencies!
- aiming for 100% test coverage, currently @ ~70%
- express.js syntax like with raw http performance
- setup & middlewares should work right out of the box with your expressjs project
- this is still "work in progress"!

# currently in TODO
- improving performance for inc. connections (not better than expressjs on benchmark results with keep-alive missing)
- implement more express apis, a lot of stuff is still missing e.g. res.type(), app.disable()
- implement custom cookie, query & body parser that can be toggled via config
- microbench to reach 99,5% performance of raw http module
- improve test coverage to 100%

# run example
- via `npm start`

# run tests
- via `npm test`

# run benchmarks

```
npm run benchmark sandshark
npm run benchmark express
npm run benchmark raw
npm run benchmark restify
npm run benchmark hapi
```

- or run all benchmarks in comparison via `npm run benchmarks` or `npm run benchmark all`
- to compare expressjs and sandshark run `npm run compare`

- each benchmark will spawn a server and worker making requests in their own child processes
- the loadtest worker is limited to a single thread and makes at least 2500 requests
- the benchmarks currently lack additional features such as body parsing, query params, path variables and cookies
- there is a good chance to have far more place for optimizations
- since hapi feels rather slow, feel free to send a pull requests if you think that I got something wrong

# benchmark results
- on a MacBook Air 11' 2014 Intel i5 quad @ 1.4 GHz
- node version 6.5.0 & server modules are present in package.json devDependencies

```javascript
[
  { raw: 1725 },
  { sandshark: 1692 },
  { express: 1223 },
  { restify: 1084 },
  { hapi: 687 }
]
```

- with keep-alive turned off

```javascript
[
  { express: 488 },
  { raw: 426 },
  { sandshark: 373 },
  { restify: 318 },
  { hapi: 314 }
]
```

# disclaimer
- i started this project after reading [Node Performance hapi vs express vs restify](https://raygun.com/blog/2015/03/node-performance-hapi-express-js-restify/)
- since their benchmarks are from March 2015, i guess they are outdated ;)
- in their benchmarks raw http performance hits 8500 req/s and express only 3000 req/s
- my benchmarks actually show expressjs way closer to raw http performance so another guess is
that their benchmarks contain possible errors, sadly they have not posted them online

# furthermore
- i would love to have further discussions on this, so please feel free to open issues
 or hit me up on twitter @silentleave or my [website](http://5cf.de)
