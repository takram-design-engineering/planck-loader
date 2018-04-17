// The MIT License
// Copyright (C) 2017-Present Shota Matsuda

import EventDispatcher from '@takram/planck-event/src/EventDispatcher'
import Namespace from '@takram/planck-core/src/Namespace'

import DataLoader from './DataLoader'
import ScriptLoader from './ScriptLoader'

export const internal = Namespace('Loader')

function construct (entries) {
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

function expand (entries) {
  return entries.reduce((loaders, entry) => {
    if (Array.isArray(entry)) {
      return loaders.concat(expand(entry))
    }
    loaders.push(entry)
    return loaders
  }, [])
}

export default class Loader extends EventDispatcher {
  constructor (...sequence) {
    super()

    // Initial states
    const scope = internal(this)
    scope.determinate = false
    scope.completed = false
    scope.failed = false

    // Event handlers
    this.onSize = this.onSize.bind(this)
    this.onProgress = this.onProgress.bind(this)
    this.onDeterminate = this.onDeterminate.bind(this)
    this.onComplete = this.onComplete.bind(this)
    this.onError = this.onError.bind(this)

    scope.sequence = construct(sequence)
    scope.loaders = expand(scope.sequence)
    scope.loaders.forEach(loader => {
      loader.addEventListener('size', this.onSize, false)
      loader.addEventListener('progress', this.onProgress, false)
      loader.addEventListener('determinate', this.onDeterminate, false)
      loader.addEventListener('complete', this.onComplete, false)
      loader.addEventListener('error', this.onError, false)
    })
  }

  get loaders () {
    const scope = internal(this)
    return [...scope.loaders]
  }

  get size () {
    const scope = internal(this)
    return scope.loaders.reduce((size, loader) => {
      return size + loader.size
    }, 0)
  }

  get progress () {
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

  get determinate () {
    return internal(this).determinate
  }

  get completed () {
    return internal(this).completed
  }

  get failed () {
    return internal(this).failed
  }

  load () {
    const scope = internal(this)
    if (scope.promise !== undefined) {
      return scope.promise
    }
    if (this.loaders.length === 0) {
      return Promise.reject(new Error('Attempt to load without a target'))
    }
    scope.promise = this.constructor.loadSequentially(scope.sequence)
    return scope.promise
  }

  abort () {
    const scope = internal(this)
    if (scope.promise === undefined) {
      return
    }
    scope.loaders.forEach(loader => {
      loader.abort()
    })
  }

  static loadParallelly (loaders) {
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

  static loadSequentially (loaders) {
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

  onSize (event) {
    event.target.removeEventListener('size', this.onSize, false)
    this.dispatchEvent({ type: 'size' })
  }

  onProgress (event) {
    this.dispatchEvent({ type: 'progress' })
  }

  onDeterminate (event) {
    event.target.removeEventListener('determinate', this.onDeterminate, false)
    const scope = internal(this)
    const value = scope.loaders.every(loader => {
      return loader.determinate
    })
    if (value !== scope.determinate) {
      scope.determinate = value
      this.dispatchEvent({ type: 'determinate' })
    }
  }

  onComplete (event) {
    const scope = internal(this)
    const value = scope.loaders.every(loader => {
      return loader.completed
    })
    if (value !== scope.completed) {
      scope.completed = value
      this.dispatchEvent({ type: 'complete' })
    }
  }

  onError (event) {
    const scope = internal(this)
    const value = scope.loaders.some(loader => {
      return loader.failed
    })
    if (value !== scope.failed) {
      scope.failed = value
      this.dispatchEvent({ type: 'error' })

      // Abort all the loaders
      if (scope.failed) {
        this.abort()
      }
    }
  }
}
