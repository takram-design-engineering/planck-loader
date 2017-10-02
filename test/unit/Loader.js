//
//  The MIT License
//
//  Copyright (C) 2017-Present Shota Matsuda
//
//  Permission is hereby granted, free of charge, to any person obtaining a
//  copy of this software and associated documentation files (the "Software"),
//  to deal in the Software without restriction, including without limitation
//  the rights to use, copy, modify, merge, publish, distribute, sublicense,
//  and/or sell copies of the Software, and to permit persons to whom the
//  Software is furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
//  THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
//  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
//  DEALINGS IN THE SOFTWARE.
//

import 'source-map-support/register'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

import { Loader } from '../..'

const expect = chai.expect
chai.use(chaiAsPromised)
chai.use(sinonChai)

describe('Loader', () => {
  let server = null

  beforeEach(() => {
    server = sinon.fakeServer.create()
    server.autoRespond = true
    server.respondImmediately = false
    server.xhr.useFilters = true
    server.xhr.addFilter((method, url) => !url.startsWith('data'))
  })

  afterEach(() => {
    server.restore()
    server = null
  })

  it('supports instanceof', () => {
    expect(new Loader()).instanceof(Loader)
  })

  it('initializes properties', () => {
    const loader = new Loader()
    expect(loader.size).equal(0)
    expect(loader.progress).equal(0)
    expect(loader.determinate).equal(false)
    expect(loader.completed).equal(false)
    expect(loader.failed).equal(false)
  })

  it('rejects loading when url is not set', () => {
    const loader = new Loader()
    return expect(loader.load()).rejected
  })

  it('resolves requests', () => {
    server.respondWith('GET', 'data', [200, {}, ''])
    const loader = new Loader(['data', 'data'])
    return expect(loader.load()).fulfilled.then(requests => {
      expect(requests.length).equal(2)
      expect(requests[0]).instanceof(XMLHttpRequest)
      expect(requests[1]).instanceof(XMLHttpRequest)
    })
  })

  it('rejects with a status code', () => {
    server.respondWith('GET', 'data/200', [200, {}, ''])
    server.respondWith('GET', 'data/404', [404, {}, ''])
    const loader = new Loader(['data/200', 'data/404'])
    return expect(loader.load()).rejected.then(error => {
      expect(error).equal(404)
    })
  })

  it('stores the requested loaders', () => {
    server.respondWith('GET', 'data/1', [200, {}, ''])
    server.respondWith('GET', 'data/2', [200, {}, ''])
    const loader = new Loader(['data/1', 'data/2'])
    return expect(loader.load()).fulfilled.then(request => {
      expect(loader.loaders.length).equal(2)
      expect(loader.loaders[0].url).equal('data/1')
      expect(loader.loaders[1].url).equal('data/2')
    })
  })

  it('marks completed or failed after loading', () => {
    server.respondWith('GET', 'data/200', [200, {}, ''])
    server.respondWith('GET', 'data/404', [404, {}, ''])
    const loader1 = new Loader(['data/200', 'data/200'])
    const loader2 = new Loader(['data/200', 'data/404'])
    return Promise.all([
      expect(loader1.load()).fulfilled.then(() => {
        expect(loader1.completed).equal(true)
        expect(loader1.failed).equal(false)
      }),
      expect(loader2.load()).rejected.then(() => {
        expect(loader2.completed).equal(false)
        expect(loader2.failed).equal(true)
      }),
    ])
  })

  it('dispatches at least one size event while loading', () => {
    server.respondWith('GET', 'data', [200, {}, ''])
    const loader = new Loader(['data', 'data'])
    const spy = sinon.spy()
    loader.addEventListener('size', event => {
      spy(event.target.size)
    }, false)
    return loader.load().then(() => {
      expect(spy).calledTwice
    })
  })

  it('dispatches a determinate event while loading', () => {
    server.respondWith('GET', 'data', [200, {}, ''])
    const loader = new Loader(['data', 'data'])
    const spy = sinon.spy()
    loader.addEventListener('determinate', event => {
      spy(event.target.determinate)
    }, false)
    return loader.load().then(() => {
      expect(spy).calledOnce
    })
  })

  it('dispatches at least one progress event while loading', () => {
    server.respondWith('GET', 'data', [200, {}, ''])
    const loader = new Loader(['data', 'data'])
    const spy = sinon.spy()
    loader.addEventListener('progress', event => {
      spy(event.target.progress)
    }, false)
    return loader.load().then(() => {
      expect(spy).called
      expect(spy.lastCall).calledWith(1)
    })
  })

  it('dispatches a completed or failed event while loading', () => {
    server.respondWith('GET', 'data/200', [200, {}, ''])
    server.respondWith('GET', 'data/404', [404, {}, ''])
    const loader1 = new Loader(['data/200', 'data/200'])
    const loader2 = new Loader(['data/200', 'data/404'])
    const completionSpy1 = sinon.spy()
    const failureSpy1 = sinon.spy()
    const completionSpy2 = sinon.spy()
    const failureSpy2 = sinon.spy()
    loader1.addEventListener('complete', event => {
      completionSpy1(event.target.completed)
    }, false)
    loader1.addEventListener('error', event => {
      failureSpy1(event.target.failed)
    }, false)
    loader2.addEventListener('complete', event => {
      completionSpy2(event.target.completed)
    }, false)
    loader2.addEventListener('error', event => {
      failureSpy2(event.target.failed)
    }, false)
    return Promise.all([
      expect(loader1.load()).fulfilled.then(() => {
        expect(completionSpy1).calledWith(true)
        expect(failureSpy1).not.called
      }),
      expect(loader2.load()).rejected.then(() => {
        expect(completionSpy2).not.called
        expect(failureSpy2).calledWith(true)
      }),
    ])
  })

  it('supports explicit size override', () => {
    server.respondWith('GET', 'data', [200, {}, ''])
    const loader = new Loader([
      'data',
      { url: 'data', size: 1024 },
    ])
    expect(loader.size).equal(1024)
    return expect(loader.load()).fulfilled
  })

  it('supports aborting', () => {
    server.autoRespond = false
    server.respondWith('GET', 'data', [200, {}, ''])
    const loader = new Loader(['data', 'data'])
    const completionSpy = sinon.spy()
    const failureSpy = sinon.spy()
    loader.addEventListener('complete', event => {
      completionSpy(event.target.failed)
    }, false)
    loader.addEventListener('error', event => {
      failureSpy(event.target.failed)
    }, false)
    const promise = expect(loader.load()).rejected.then(() => {
      expect(completionSpy).not.called
      expect(failureSpy).calledWith(true)
      expect(loader.completed).equal(false)
      expect(loader.failed).equal(true)
    })
    loader.abort()
    server.respond()
    return promise
  })

  it('loads sequentially', () => {
    server.autoRespond = false
    const sequence = [1, 2, 3]
    server.respondWith('GET', /data\/\d+/, request => {
      const id = parseInt(request.url.split('/')[1], 10)
      expect(id).equal(sequence.shift())
      request.respond(200, {}, '')
      setTimeout(() => server.respond())
    })
    const loader = new Loader(
      'data/1',
      'data/2',
      'data/3')
    const spies = loader.loaders.map(loader => {
      const spy = sinon.spy()
      loader.addEventListener('complete', event => {
        spy(event.target.url)
      }, false)
      return spy
    })
    const promise = expect(loader.load()).fulfilled.then(() => {
      expect(spies[0]).calledWith('data/1')
      expect(spies[0]).calledBefore(spies[1])
      expect(spies[1]).calledWith('data/2')
      expect(spies[1]).calledBefore(spies[2])
      expect(spies[2]).calledWith('data/3')
    })
    server.respond()
    return promise
  })

  it('loads parallelly', () => {
    server.autoRespond = false
    const loader = new Loader([
      'data/3',
      'data/2',
      'data/1',
    ])
    const spies = loader.loaders.map(loader => {
      const spy = sinon.spy()
      loader.addEventListener('complete', event => {
        spy(event.target.url)
      }, false)
      return spy
    })
    const promise = expect(loader.load()).fulfilled.then(() => {
      expect(spies[2]).calledWith('data/1')
      expect(spies[2]).calledBefore(spies[1])
      expect(spies[1]).calledWith('data/2')
      expect(spies[1]).calledBefore(spies[0])
      expect(spies[0]).calledWith('data/3')
    })
    setTimeout(() => {
      server.requests.find(request => {
        return request.url === 'data/1'
      }).respond(200, {}, '')
    }, 10)
    setTimeout(() => {
      server.requests.find(request => {
        return request.url === 'data/2'
      }).respond(200, {}, '')
    }, 20)
    setTimeout(() => {
      server.requests.find(request => {
        return request.url === 'data/3'
      }).respond(200, {}, '')
    }, 30)
    return promise
  })

  it('loads both sequentially and parallelly', () => {
    server.autoRespond = false
    const sequence = [1, [2, 3], 4, [5, 6], 7]
    server.respondWith('GET', /data\/(1|4|7)/, request => {
      const id = parseInt(request.url.split('/')[1], 10)
      expect(id).equal(sequence.shift())
      request.respond(200, {}, '')
      if (sequence.length !== 0) {
        let index = 0
        Promise.all(sequence.shift().map(id => {
          return new Promise(resolve => {
            setTimeout(() => {
              server.requests.find(request => {
                return request.url === `data/${id}`
              }).respond(200, {}, '')
              resolve()
            }, 10 * ++index)
          })
        })).then(() => {
          setTimeout(() => server.respond())
        })
      }
    })
    const loader = new Loader(
      'data/1',
      ['data/3', 'data/2'],
      'data/4',
      ['data/6', 'data/5'],
      'data/7')
    const spies = loader.loaders.map(loader => {
      const spy = sinon.spy()
      loader.addEventListener('complete', event => {
        spy(event.target.url)
      }, false)
      return spy
    })
    const promise = expect(loader.load()).fulfilled.then(() => {
      expect(spies.length).equal(7)
      expect(spies[0]).calledWith('data/1')
      expect(spies[0]).calledBefore(spies[2])
      expect(spies[2]).calledWith('data/2')
      expect(spies[2]).calledBefore(spies[1])
      expect(spies[1]).calledWith('data/3')
      expect(spies[1]).calledBefore(spies[3])
      expect(spies[3]).calledWith('data/4')
      expect(spies[3]).calledBefore(spies[5])
      expect(spies[5]).calledWith('data/5')
      expect(spies[5]).calledBefore(spies[4])
      expect(spies[4]).calledWith('data/6')
      expect(spies[4]).calledBefore(spies[6])
      expect(spies[6]).calledWith('data/7')
    })
    server.respond()
    return promise
  })
})
