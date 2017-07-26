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

import Namespace from '@takram/planck-core/src/Namespace'

import DataLoader from './DataLoader'

export const internal = Namespace('ScriptLoader')

export default class ScriptLoader extends DataLoader {
  load() {
    const scope = internal(this)
    if (scope.promise !== undefined) {
      return scope.promise
    }
    scope.promise = new Promise((resolve, reject) => {
      super.load().then(request => {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = this.url
        script.onload = () => {
          resolve(request)
        }
        script.onerror = () => {
          reject(request.status)
        }
        const scripts = document.getElementsByTagName('script')
        const target = scripts[scripts.length - 1]
        target.parentNode.insertBefore(script, target)
      })
    })
    return scope.promise
  }
}
