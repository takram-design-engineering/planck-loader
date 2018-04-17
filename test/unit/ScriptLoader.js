// The MIT License
// Copyright (C) 2017-Present Shota Matsuda

/* eslint-disable no-unused-expressions */

import 'source-map-support/register'

import chai from 'chai'

import { Global } from '@takram/planck-core'

import { ScriptLoader } from '../..'

const { expect } = chai

describe('ScriptLoader', function () {
  this.timeout(30000)

  it('supports instanceof', () => {
    expect(new ScriptLoader()).instanceof(ScriptLoader)
  })

  it('loads script', () => {
    // eslint-disable-next-line no-restricted-globals
    Global.scope.planck_script_loader_test_flag = undefined
    const loader = new ScriptLoader('/test/unit/data/script')
    return expect(loader.load()).fulfilled.then(() => {
      // eslint-disable-next-line no-restricted-globals
      expect(Global.scope.planck_script_loader_test_flag).not.undefined
    })
  })
})
