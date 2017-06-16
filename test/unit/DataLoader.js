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

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

import { DataLoader } from '../..'

const expect = chai.expect
chai.use(chaiAsPromised)
chai.use(sinonChai)

// eslint-disable-next-line func-names
describe('DataLoader', () => {
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
    expect(new DataLoader()).instanceof(DataLoader)
  })

  it('initializes properties', () => {
    const loader = new DataLoader()
    expect(loader.url).equal(null)
    expect(loader.size).equal(0)
    expect(loader.progress).equal(0)
    expect(loader.determinate).equal(false)
    expect(loader.completed).equal(false)
    expect(loader.failed).equal(false)
  })

  it('rejects loading when url is not set', () => {
    const loader = new DataLoader()
    return expect(loader.load()).rejected
  })

  it('resolves a request', () => {
    server.respondWith('GET', 'data', [200, {}, ''])
    const loader = new DataLoader('data')
    const promise = expect(loader.load()).fulfilled.then(request => {
      expect(request).instanceof(XMLHttpRequest)
    })
    return promise
  })

  it('rejects with a status code', () => {
    server.respondWith('GET', /.*/, [500, {}, ''])
    const loader = new DataLoader('data/null')
    const promise = expect(loader.load()).rejected.then(error => {
      expect(error).equal(500)
    })
    return promise
  })

  it('stores the requested url', () => {
    server.respondWith('GET', 'data', [200, {}, ''])
    const loader = new DataLoader('data')
    return expect(loader.load()).fulfilled.then(request => {
      expect(loader.url).equal('data')
    })
  })

  it('marks completed or failed after loading', () => {
    server.respondWith('GET', 'data/200', [200, {}, ''])
    server.respondWith('GET', 'data/404', [404, {}, ''])
    const loader1 = new DataLoader('data/200')
    const loader2 = new DataLoader('data/404')
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

  it('dispatches a size event while loading', () => {
    server.respondWith('GET', 'data', [200, {}, ''])
    const loader = new DataLoader('data')
    const spy = sinon.spy()
    loader.addEventListener('size', event => {
      spy(event.target.size)
    }, false)
    return loader.load().then(() => {
      expect(spy).calledOnce
    })
  })

  it('dispatches a determinate event while loading', () => {
    server.respondWith('GET', 'data', [200, {}, ''])
    const loader = new DataLoader('data')
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
    const loader = new DataLoader('data')
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
    const loader1 = new DataLoader('data/200')
    const loader2 = new DataLoader('data/404')
    const completionSpy1 = sinon.spy()
    const failureSpy1 = sinon.spy()
    const completionSpy2 = sinon.spy()
    const failureSpy2 = sinon.spy()
    loader1.addEventListener('completed', event => {
      completionSpy1(event.target.completed)
    }, false)
    loader1.addEventListener('failed', event => {
      failureSpy1(event.target.failed)
    }, false)
    loader2.addEventListener('completed', event => {
      completionSpy2(event.target.completed)
    }, false)
    loader2.addEventListener('failed', event => {
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
    const loader = new DataLoader({ url: 'data', size: 1024 })
    expect(loader.size).equal(1024)
    return expect(loader.load()).fulfilled
  })

  it('supports aborting', () => {
    server.autoRespond = false
    server.respondWith('GET', 'data', [200, {}, ''])
    const loader = new DataLoader('data')
    const completionSpy = sinon.spy()
    const failureSpy = sinon.spy()
    loader.addEventListener('completed', event => {
      completionSpy(event.target.failed)
    }, false)
    loader.addEventListener('failed', event => {
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
})
