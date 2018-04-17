// The MIT License
// Copyright (C) 2017-Present Shota Matsuda

/* eslint-env browser */

import EventDispatcher from '@takram/planck-event/src/EventDispatcher'
import Namespace from '@takram/planck-core/src/Namespace'

export const internal = Namespace('DataLoader')

function setSize (target, value) {
  const scope = internal(target)
  if (value !== scope.size) {
    scope.size = value
    target.dispatchEvent({ type: 'size' })
  }
}

function setProgress (target, value) {
  const scope = internal(target)
  if (value !== scope.progress) {
    scope.progress = value
    target.dispatchEvent({ type: 'progress' })
  }
}

function setDeterminate (target, value) {
  const scope = internal(target)
  if (value !== scope.determinate) {
    scope.determinate = value
    target.dispatchEvent({ type: 'determinate' })
  }
}

export default class DataLoader extends EventDispatcher {
  constructor (target) {
    super()

    // Intiial states
    const scope = internal(this)
    scope.request = null
    if (target !== undefined) {
      scope.url = target.url || target
      scope.size = target.size || 0
    } else {
      scope.url = null
      scope.size = 0
    }
    scope.progress = 0
    scope.determinate = false
    scope.completed = false
    scope.failed = false

    // Event handlers
    this.onInitialProgress = this.onInitialProgress.bind(this)
    this.onProgress = this.onProgress.bind(this)
    this.onLoadend = this.onLoadend.bind(this)
  }

  get request () {
    return internal(this).request
  }

  get url () {
    return internal(this).url
  }

  get size () {
    return internal(this).size
  }

  get progress () {
    return internal(this).progress
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
    if (this.url === null) {
      return Promise.reject(new Error('Attempt to load without url'))
    }
    scope.promise = new Promise((resolve, reject) => {
      const request = new XMLHttpRequest()
      request.addEventListener('progress', this.onInitialProgress, false)
      request.addEventListener('progress', this.onProgress, false)
      request.addEventListener('loadend', this.onLoadend, false)
      request.open('get', this.url)
      scope.request = request
      scope.resolve = resolve
      scope.reject = reject

      // TODO: Support promise return values
      this.onBeforeLoading(request)
      request.send()
    })
    return scope.promise
  }

  abort () {
    const scope = internal(this)
    if (scope.promise === undefined) {
      return
    }
    scope.request.abort()
  }

  onInitialProgress (event) {
    const scope = internal(this)
    const request = event.target
    request.removeEventListener('progress', this.onInitialProgress, false)
    if (request.status < 200 || request.status >= 300) {
      return
    }
    if (scope.size === 0) {
      if (event.lengthComputable) {
        setSize(this, event.total)
      } else {
        const size = request.getResponseHeader('X-Decompressed-Content-Length')
        setSize(this, +size || 0)
      }
    }
    if (scope.size !== 0) {
      setDeterminate(this, true)
    }
  }

  onProgress (event) {
    const scope = internal(this)
    if (scope.determinate) {
      setProgress(this, Math.min(1, event.loaded / scope.size))
    }
  }

  onLoadend (event) {
    const scope = internal(this)
    const request = event.target
    request.removeEventListener('progress', this.onInitialProgress, false)
    request.removeEventListener('progress', this.onProgress, false)
    request.removeEventListener('loadend', this.onLoadend, false)
    if (!scope.determinate) {
      setDeterminate(this, true)
    }
    if (request.status >= 200 && request.status < 300) {
      setProgress(this, 1)
      Promise.resolve(this.onAfterLoading(request))
        .then(() => {
          scope.completed = true
          scope.resolve(request)
          this.dispatchEvent({ type: 'complete' })
        })
        .catch(error => {
          scope.failed = true
          scope.reject(error)
          this.dispatchEvent({ type: 'error' })
        })
    } else {
      scope.failed = true
      scope.reject(request.status)
      this.dispatchEvent({ type: 'error' })
    }
  }

  onBeforeLoading (request) {}

  onAfterLoading (request) {}
}
