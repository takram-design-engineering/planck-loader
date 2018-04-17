Planck Loader
=============

Provides for parallel and sequential data loading and progress observation.

[![License](http://img.shields.io/badge/license-MIT-lightgrey.svg?style=flat
)](http://mit-license.org)
[![npm version](https://badge.fury.io/js/%40takram%2Fplanck-loader.svg)](http://badge.fury.io/js/%40takram%2Fplanck-loader)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Build Status](https://travis-ci.org/takram-design-engineering/planck-loader.svg?branch=master)](https://travis-ci.org/takram-design-engineering/planck-loader)
[![Sauce Test Status](https://saucelabs.com/buildstatus/planck-loader)](https://saucelabs.com/u/planck-loader)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/planck-loader.svg)](https://saucelabs.com/u/planck-loader)

## Getting Started

### Installing

```sh
npm install @takram/planck-loader
```

## Example

The example below will load `data1.json`, `data2.json` and `lib.js` in parallel (in a JavaScript sense), whereas `main.js` will be loaded after loading `lib.js`.

```js
import { Loader } from '@takram/planck-loader'

const progressBar = document.querySelector('#progress-bar')

const loader = new Loader([
  'path/to/data1.json',
  'path/to/data2.json',
  ['path/to/lib.js', 'path/to/main.js'],
])

loader.addEventListener('determinate', event => {
  progressBar.classList.remove('indeterminate')
})

loader.addEventListener('progress', event => {
  progressBar.style.width = `${event.target.progress * 100}%`
})

loader.load().then(requests => {
  progressBar.classList.add('completed')
  loader.loaders.forEach(loader => {
    console.log(loader.url, loader.request.response)
  })
}).catch(code => {
  progressBar.classList.add('failed')
  console.error(code)
})
```

## API Reference

### Loader

<a id="new-loader" href="#new-loader">#</a>
new **Loader**(*url1* [, *url2* [, ...]])

The constructor that takes a sequence of URLs or arrays of URLs. The top level arguments will be loaded sequentially, and the second level will be loaded in parallel. Any further depth of array repeats cycles its behavior.

```js
new Loader(a, b)
new Loader(a, [c, d], b)
new Loader(a, [c, [e, f], d], b)
```

- `a` and `b` are loaded sequentially
- `c` and `d` are loaded in parallel
- `e` and `f` are loaded sequentially

Likewise:

```js
new Loader([a, b])
new Loader([a, [c, d], b])
new Loader([a, [c, [e, f], d], b])
```

- `a` and `b` are loaded in parallel
- `c` and `d` are loaded sequentially
- `e` and `f` are loaded in parallel

<a id="loader-load" href="#loader-load">#</a>
*loader*.**load**()

Returns a `Promise` that resolves with an array of requests (`XMLHTTPRequest`). It rejects with a status code when one of the requests fails.

<a id="loader-size" href="#loader-size">#</a>
*loader*.**size**

`Number` that indicates the size of total payloads in bytes, dispatching an `size` event when the value changes.

<a id="loader-progress" href="#loader-progress">#</a>
*loader*.**progress**

`Number` that indicates the loading progress between 0-1 in total, dispatching an `progress` event when the value changes.

<a id="loader-determinate" href="#loader-determinate">#</a>
*loader*.**determinate**

`Boolean` Becomes when the loader becomes able to determine the progress, dispatching an `determinate` event when the value changes.

<a id="loader-completed" href="#loader-completed">#</a>
*loader*.**completed**

`Boolean` Becomes true when all of the requests completes loadind, dispatching a `complete` event when the value changes.

<a id="loader-failed" href="#loader-failed">#</a>
*loader*.**failed**

`Boolean` Becomes true when any loader fails to load, dispatching an `error` event when the value changes.

## License

The MIT License

Copyright (C) 2016-Present Shota Matsuda

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
