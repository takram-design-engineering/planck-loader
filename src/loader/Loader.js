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

import { EventDispatcher } from '@takram/planck-event'
import { Namespace } from '@takram/planck-core'

import DataLoader from '../loader/DataLoader'
import ScriptLoader from '../loader/ScriptLoader'

export const internal = Namespace('Loader')

export default class Loader extends EventDispatcher {
  constructor(...sequence) {
    super()
    const scope = internal(this)
    scope.determinate = false
    scope.completed = false
    scope.failed = false
    scope.handlers = {
      size: handleSize.bind(this),
      progress: handleProgress.bind(this),
      determinate: handleDeterminate.bind(this),
      completed: handleCompleted.bind(this),
      failed: handleFailed.bind(this),
    }
    scope.sequence = construct(sequence)
    scope.loaders = expand(scope.sequence)
    scope.loaders.forEach(loader => {
      loader.addEventListener('size', scope.handlers.size, false)
      loader.addEventListener('progress', scope.handlers.progress, false)
      loader.addEventListener('determinate', scope.handlers.determinate, false)
      loader.addEventListener('completed', scope.handlers.completed, false)
      loader.addEventListener('failed', scope.handlers.failed, false)
    })
  }

  get loaders() {
    const scope = internal(this)
    return [...scope.loaders]
  }

  get size() {
    const scope = internal(this)
    return scope.loaders.reduce((size, loader) => {
      return size + loader.size
    }, 0)
  }

  get progress() {
    const scope = internal(this)

    // Calculate the aggregate progress by the number of loaders when the sizes
    // of all of the loaders are zero.
    if (this.size === 0) {
      return Math.min(1, scope.loaders.reduce((progress, loader) => {
        return progress + loader.progress / scope.loaders.length
      }, 0))
    }

    // Use the mean size of non-zero loaders for zero loaders.
    const loaders = scope.loaders.filter(loader => loader.size !== 0)
    const mean = loaders.reduce((sum, loader) => {
      return sum + loader.size
    }, 0) / loaders.length
    const total = mean * scope.loaders.length
    return Math.min(1, scope.loaders.reduce((progress, loader) => {
      return progress + loader.progress * (loader.size || mean) / total
    }, 0))
  }

  get determinate() {
    const scope = internal(this)
    return scope.determinate
  }

  get completed() {
    const scope = internal(this)
    return scope.completed
  }

  get failed() {
    const scope = internal(this)
    return scope.failed
  }

  load() {
    const scope = internal(this)
    if (scope.promise !== undefined) {
      return scope.promise
    }
    if (this.loaders.length === 0) {
      return Promise.reject()
    }
    scope.promise = this.constructor.loadSequentially(scope.sequence)
    return scope.promise
  }

  abort() {
    const scope = internal(this)
    if (scope.promise === undefined) {
      return
    }
    scope.loaders.forEach(loader => {
      loader.abort()
    })
  }

  static loadParallelly(loaders) {
    return Promise.all(loaders.map(loader => {
      if (Array.isArray(loader)) {
        return this.loadSequentially(loader)
      }
      return loader.load().then(request => {
        return [].concat(request)
      })
    })).then(requests => {
      return [].concat(...requests)
    })
  }

  static loadSequentially(loaders) {
    if (loaders.length === 0) {
      return Promise.resolve([])
    }
    return loaders.reduce((promise, loader) => {
      if (promise === null) {
        if (Array.isArray(loader)) {
          return this.loadParallelly(loader)
        }
        return loader.load().then(request => {
          return [].concat(request)
        })
      }
      if (Array.isArray(loader)) {
        return promise.then(requests => {
          return this.loadParallelly(loader).then(request => {
            return [].concat(requests, request)
          })
        })
      }
      return promise.then(requests => {
        return loader.load().then(request => {
          return [].concat(requests, request)
        })
      })
    }, null)
  }
}

function construct(entries) {
  return entries.map(entry => {
    if (Array.isArray(entry)) {
      return construct(entry)
    }
    if (entry && typeof entry.load === 'function') {
      return entry
    }
    const url = entry.url || entry
    if (url.endsWith('.js')) {
      return new ScriptLoader(entry)
    }
    return new DataLoader(entry)
  })
}

function expand(entries) {
  return entries.reduce((loaders, entry) => {
    if (Array.isArray(entry)) {
      return loaders.concat(expand(entry))
    }
    loaders.push(entry)
    return loaders
  }, [])
}

function handleSize(event) {
  this.dispatchEvent({ type: 'size', target: this })
}

function handleProgress(event) {
  this.dispatchEvent({ type: 'progress', target: this })
}

function handleDeterminate(event) {
  updateDeterminate(this)
}

function handleCompleted(event) {
  updateCompleted(this)
}

function handleFailed(event) {
  updateFailed(this)
}

function updateDeterminate(target) {
  const scope = internal(target)
  const value = scope.loaders.every(loader => {
    return loader.determinate
  })
  if (value !== scope.determinate) {
    scope.determinate = value
    target.dispatchEvent({ type: 'determinate', target })
  }
}

function updateCompleted(target) {
  const scope = internal(target)
  const value = scope.loaders.every(loader => {
    return loader.completed
  })
  if (value !== scope.completed) {
    scope.completed = value
    target.dispatchEvent({ type: 'completed', target })
  }
}

function updateFailed(target) {
  const scope = internal(target)
  const value = scope.loaders.some(loader => {
    return loader.failed
  })
  if (value !== scope.failed) {
    scope.failed = value
    target.dispatchEvent({ type: 'failed', target })

    // Abort all the loaders
    if (scope.failed) {
      target.abort()
    }
  }
}
