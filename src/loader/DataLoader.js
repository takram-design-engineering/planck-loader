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

import { EventDispatcher } from 'planck-event'

import Namespace from '../core/Namespace'

export const internal = Namespace('DataLoader')

export default class DataLoader extends EventDispatcher {
  constructor(target) {
    super()
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
  }

  get request() {
    const scope = internal(this)
    return scope.request
  }

  get url() {
    const scope = internal(this)
    return scope.url
  }

  get size() {
    const scope = internal(this)
    return scope.size
  }

  get progress() {
    const scope = internal(this)
    return scope.progress
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
    if (this.url === null) {
      return Promise.reject()
    }
    scope.promise = new Promise((resolve, reject) => {
      const request = new XMLHttpRequest()
      scope.handlers = {
        init: handleInit.bind(this),
        progress: handleProgress.bind(this),
        loadend: handleLoadend.bind(this),
      }
      request.addEventListener('progress', scope.handlers.init, false)
      request.addEventListener('progress', scope.handlers.progress, false)
      request.addEventListener('loadend', scope.handlers.loadend, false)
      request.open('get', this.url)
      request.send()
      scope.request = request
      scope.resolve = resolve
      scope.reject = reject
    })
    return scope.promise
  }

  abort() {
    const scope = internal(this)
    if (scope.promise === undefined) {
      return
    }
    scope.request.abort()
  }
}

function handleInit(event) {
  const scope = internal(this)
  const request = event.target
  request.removeEventListener('progress', scope.handlers.init, false)
  if (request.status !== 200) {
    return
  }
  if (scope.size === 0) {
    setSize(this, event.total)
  }
  if (scope.size !== 0) {
    setDeterminate(this, true)
  }
}

function handleProgress(event) {
  const scope = internal(this)
  if (scope.determinate) {
    setProgress(this, Math.min(1, event.loaded / scope.size))
  }
}

function handleLoadend(event) {
  const scope = internal(this)
  const request = event.target
  request.removeEventListener('progress', scope.handlers.progress, false)
  request.removeEventListener('loadend', scope.handlers.loadend, false)
  if (!scope.determinate) {
    setDeterminate(this, true)
  }
  if (request.status === 200) {
    setProgress(this, 1)
    scope.resolve(request)
    setCompleted(this, true)
  } else {
    // Rejecting before setting this as failed gives this status as the promise
    // rejection reason when aggregated.
    scope.reject(request.status)
    setFailed(this, true)
  }
}

function setSize(target, value) {
  const scope = internal(target)
  if (value !== scope.size) {
    scope.size = value
    target.dispatchEvent({ type: 'size', target })
  }
}

function setProgress(target, value) {
  const scope = internal(target)
  if (value !== scope.progress) {
    scope.progress = value
    target.dispatchEvent({ type: 'progress', target })
  }
}

function setDeterminate(target, value) {
  const scope = internal(target)
  if (value !== scope.determinate) {
    scope.determinate = value
    target.dispatchEvent({ type: 'determinate', target })
  }
}

function setCompleted(target, value) {
  const scope = internal(target)
  if (value !== scope.completed) {
    scope.completed = value
    target.dispatchEvent({ type: 'completed', target })
  }
}

function setFailed(target, value) {
  const scope = internal(target)
  if (value !== scope.failed) {
    scope.failed = value
    target.dispatchEvent({ type: 'failed', target })
  }
}
