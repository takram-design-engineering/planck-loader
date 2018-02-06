// The MIT License
// Copyright (C) 2017-Present Shota Matsuda

import DataLoader from './DataLoader'

export default class ScriptLoader extends DataLoader {
  onAfterLoading(request) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = this.url
      script.onload = () => {
        resolve()
      }
      script.onerror = error => {
        reject(error)
      }
      const scripts = document.getElementsByTagName('script')
      const target = scripts[scripts.length - 1]
      target.parentNode.insertBefore(script, target)
    })
  }
}
