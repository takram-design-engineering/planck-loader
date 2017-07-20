import { EventDispatcher } from '@takram/planck-event';
import { Namespace } from '@takram/planck-core';

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

const internal = Namespace('DataLoader');

class DataLoader extends EventDispatcher {
  constructor(target) {
    super();
    const scope = internal(this);
    scope.request = null;
    if (target !== undefined) {
      scope.url = target.url || target;
      scope.size = target.size || 0;
    } else {
      scope.url = null;
      scope.size = 0;
    }
    scope.progress = 0;
    scope.determinate = false;
    scope.completed = false;
    scope.failed = false;
  }

  get request() {
    const scope = internal(this);
    return scope.request;
  }

  get url() {
    const scope = internal(this);
    return scope.url;
  }

  get size() {
    const scope = internal(this);
    return scope.size;
  }

  get progress() {
    const scope = internal(this);
    return scope.progress;
  }

  get determinate() {
    const scope = internal(this);
    return scope.determinate;
  }

  get completed() {
    const scope = internal(this);
    return scope.completed;
  }

  get failed() {
    const scope = internal(this);
    return scope.failed;
  }

  load() {
    const scope = internal(this);
    if (scope.promise !== undefined) {
      return scope.promise;
    }
    if (this.url === null) {
      return Promise.reject();
    }
    scope.promise = new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      scope.handlers = {
        init: handleInit.bind(this),
        progress: handleProgress.bind(this),
        loadend: handleLoadend.bind(this)
      };
      request.addEventListener('progress', scope.handlers.init, false);
      request.addEventListener('progress', scope.handlers.progress, false);
      request.addEventListener('loadend', scope.handlers.loadend, false);
      request.open('get', this.url);
      request.send();
      scope.request = request;
      scope.resolve = resolve;
      scope.reject = reject;
    });
    return scope.promise;
  }

  abort() {
    const scope = internal(this);
    if (scope.promise === undefined) {
      return;
    }
    scope.request.abort();
  }
}

function handleInit(event) {
  const scope = internal(this);
  const request = event.target;
  request.removeEventListener('progress', scope.handlers.init, false);
  if (request.status !== 200) {
    return;
  }
  if (scope.size === 0) {
    setSize(this, event.total);
  }
  if (scope.size !== 0) {
    setDeterminate(this, true);
  }
}

function handleProgress(event) {
  const scope = internal(this);
  if (scope.determinate) {
    setProgress(this, Math.min(1, event.loaded / scope.size));
  }
}

function handleLoadend(event) {
  const scope = internal(this);
  const request = event.target;
  request.removeEventListener('progress', scope.handlers.progress, false);
  request.removeEventListener('loadend', scope.handlers.loadend, false);
  if (!scope.determinate) {
    setDeterminate(this, true);
  }
  if (request.status === 200) {
    setProgress(this, 1);
    scope.resolve(request);
    setCompleted(this, true);
  } else {
    // Rejecting before setting this as failed gives this status as the promise
    // rejection reason when aggregated.
    scope.reject(request.status);
    setFailed(this, true);
  }
}

function setSize(target, value) {
  const scope = internal(target);
  if (value !== scope.size) {
    scope.size = value;
    target.dispatchEvent({ type: 'size', target });
  }
}

function setProgress(target, value) {
  const scope = internal(target);
  if (value !== scope.progress) {
    scope.progress = value;
    target.dispatchEvent({ type: 'progress', target });
  }
}

function setDeterminate(target, value) {
  const scope = internal(target);
  if (value !== scope.determinate) {
    scope.determinate = value;
    target.dispatchEvent({ type: 'determinate', target });
  }
}

function setCompleted(target, value) {
  const scope = internal(target);
  if (value !== scope.completed) {
    scope.completed = value;
    target.dispatchEvent({ type: 'completed', target });
  }
}

function setFailed(target, value) {
  const scope = internal(target);
  if (value !== scope.failed) {
    scope.failed = value;
    target.dispatchEvent({ type: 'failed', target });
  }
}

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

const internal$2 = Namespace('ScriptLoader');

class ScriptLoader extends DataLoader {
  load() {
    const scope = internal$2(this);
    if (scope.promise !== undefined) {
      return scope.promise;
    }
    scope.promise = new Promise((resolve, reject) => {
      super.load().then(request => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.url;
        script.onload = () => {
          resolve(request);
        };
        script.onerror = () => {
          reject(request.status);
        };
        const scripts = document.getElementsByTagName('script');
        const target = scripts[scripts.length - 1];
        target.parentNode.insertBefore(script, target);
      });
    });
    return scope.promise;
  }
}

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

const internal$1 = Namespace('Loader');

class Loader extends EventDispatcher {
  constructor(...sequence) {
    super();
    const scope = internal$1(this);
    scope.determinate = false;
    scope.completed = false;
    scope.failed = false;
    scope.handlers = {
      size: handleSize.bind(this),
      progress: handleProgress$1.bind(this),
      determinate: handleDeterminate.bind(this),
      completed: handleCompleted.bind(this),
      failed: handleFailed.bind(this)
    };
    scope.sequence = construct(sequence);
    scope.loaders = expand(scope.sequence);
    scope.loaders.forEach(loader => {
      loader.addEventListener('size', scope.handlers.size, false);
      loader.addEventListener('progress', scope.handlers.progress, false);
      loader.addEventListener('determinate', scope.handlers.determinate, false);
      loader.addEventListener('completed', scope.handlers.completed, false);
      loader.addEventListener('failed', scope.handlers.failed, false);
    });
  }

  get loaders() {
    const scope = internal$1(this);
    return [...scope.loaders];
  }

  get size() {
    const scope = internal$1(this);
    return scope.loaders.reduce((size, loader) => {
      return size + loader.size;
    }, 0);
  }

  get progress() {
    const scope = internal$1(this);

    // Calculate the aggregate progress by the number of loaders when the sizes
    // of all of the loaders are zero.
    if (this.size === 0) {
      return Math.min(1, scope.loaders.reduce((progress, loader) => {
        return progress + loader.progress / scope.loaders.length;
      }, 0));
    }

    // Use the mean size of non-zero loaders for zero loaders.
    const loaders = scope.loaders.filter(loader => loader.size !== 0);
    const mean = loaders.reduce((sum, loader) => {
      return sum + loader.size;
    }, 0) / loaders.length;
    const total = mean * scope.loaders.length;
    return Math.min(1, scope.loaders.reduce((progress, loader) => {
      return progress + loader.progress * (loader.size || mean) / total;
    }, 0));
  }

  get determinate() {
    const scope = internal$1(this);
    return scope.determinate;
  }

  get completed() {
    const scope = internal$1(this);
    return scope.completed;
  }

  get failed() {
    const scope = internal$1(this);
    return scope.failed;
  }

  load() {
    const scope = internal$1(this);
    if (scope.promise !== undefined) {
      return scope.promise;
    }
    if (this.loaders.length === 0) {
      return Promise.reject();
    }
    scope.promise = this.constructor.loadSequentially(scope.sequence);
    return scope.promise;
  }

  abort() {
    const scope = internal$1(this);
    if (scope.promise === undefined) {
      return;
    }
    scope.loaders.forEach(loader => {
      loader.abort();
    });
  }

  static loadParallelly(loaders) {
    return Promise.all(loaders.map(loader => {
      if (Array.isArray(loader)) {
        return this.loadSequentially(loader);
      }
      return loader.load().then(request => {
        return [].concat(request);
      });
    })).then(requests => {
      return [].concat(...requests);
    });
  }

  static loadSequentially(loaders) {
    if (loaders.length === 0) {
      return Promise.resolve([]);
    }
    return loaders.reduce((promise, loader) => {
      if (promise === null) {
        if (Array.isArray(loader)) {
          return this.loadParallelly(loader);
        }
        return loader.load().then(request => {
          return [].concat(request);
        });
      }
      if (Array.isArray(loader)) {
        return promise.then(requests => {
          return this.loadParallelly(loader).then(request => {
            return [].concat(requests, request);
          });
        });
      }
      return promise.then(requests => {
        return loader.load().then(request => {
          return [].concat(requests, request);
        });
      });
    }, null);
  }
}

function construct(entries) {
  return entries.map(entry => {
    if (Array.isArray(entry)) {
      return construct(entry);
    }
    if (entry && typeof entry.load === 'function') {
      return entry;
    }
    const url = entry.url || entry;
    if (url.endsWith('.js')) {
      return new ScriptLoader(entry);
    }
    return new DataLoader(entry);
  });
}

function expand(entries) {
  return entries.reduce((loaders, entry) => {
    if (Array.isArray(entry)) {
      return loaders.concat(expand(entry));
    }
    loaders.push(entry);
    return loaders;
  }, []);
}

function handleSize(event) {
  this.dispatchEvent({ type: 'size', target: this });
}

function handleProgress$1(event) {
  this.dispatchEvent({ type: 'progress', target: this });
}

function handleDeterminate(event) {
  updateDeterminate(this);
}

function handleCompleted(event) {
  updateCompleted(this);
}

function handleFailed(event) {
  updateFailed(this);
}

function updateDeterminate(target) {
  const scope = internal$1(target);
  const value = scope.loaders.every(loader => {
    return loader.determinate;
  });
  if (value !== scope.determinate) {
    scope.determinate = value;
    target.dispatchEvent({ type: 'determinate', target });
  }
}

function updateCompleted(target) {
  const scope = internal$1(target);
  const value = scope.loaders.every(loader => {
    return loader.completed;
  });
  if (value !== scope.completed) {
    scope.completed = value;
    target.dispatchEvent({ type: 'completed', target });
  }
}

function updateFailed(target) {
  const scope = internal$1(target);
  const value = scope.loaders.some(loader => {
    return loader.failed;
  });
  if (value !== scope.failed) {
    scope.failed = value;
    target.dispatchEvent({ type: 'failed', target });

    // Abort all the loaders
    if (scope.failed) {
      target.abort();
    }
  }
}

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

export { DataLoader, Loader, ScriptLoader };
//# sourceMappingURL=planck-loader.module.js.map
