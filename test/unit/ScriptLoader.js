// The MIT License
// Copyright (C) 2017-Present Shota Matsuda

import 'source-map-support/register'

import chai from 'chai'

import { ScriptLoader } from '../..'

const { expect } = chai

// eslint-disable-next-line func-names
describe('ScriptLoader', function () {
  this.timeout(30000)

  it('supports instanceof', () => {
    expect(new ScriptLoader()).instanceof(ScriptLoader)
  })

  it('loads script', () => {
    // eslint-disable-next-line no-restricted-globals
    self.planck_script_loader_test_flag = undefined
    const loader = new ScriptLoader('/test/unit/data/script')
    return expect(loader.load()).fulfilled.then(() => {
      // eslint-disable-next-line no-restricted-globals
      expect(self.planck_script_loader_test_flag).not.undefined
    })
  })
})
