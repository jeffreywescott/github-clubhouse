import path from 'path'
import fs from 'fs'

import test from 'tape'

import {saveConfig, loadConfig} from '../config'

const _configPathname = () => path.resolve('/tmp', `.github-clubhouse-${Date.now()}`)

test('util/config', t => {
  t.test('saveConfig', tt => {
    tt.test('saves the configuration options', ttt => {
      ttt.plan(1)

      const pathname = _configPathname()
      const options = {save: 'me'}
      saveConfig(options, pathname)
      const savedOptions = JSON.parse(fs.readFileSync(pathname, {encoding: 'utf8'}))

      ttt.equal(savedOptions.save, options.save)
    })

    tt.end()
  })

  t.test('loadConfig', tt => {
    tt.test('returns an empty object if no configuration exists', ttt => {
      ttt.plan(1)

      const pathname = _configPathname()
      const loadedOptions = loadConfig(pathname)

      ttt.deepEqual(loadedOptions, {})
    })

    tt.test('returns the options as an object if the configuration exists', ttt => {
      ttt.plan(1)

      const pathname = _configPathname()
      const options = {save: 'me'}
      fs.writeFileSync(pathname, JSON.stringify(options), {encoding: 'utf8'})
      const loadedOptions = loadConfig(pathname)

      ttt.equal(loadedOptions.save, options.save)
    })

    tt.end()
  })

  t.end()
})
