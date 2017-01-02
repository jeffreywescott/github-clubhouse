import path from 'path'
import fs from 'fs'

const CONFIG_PATHNAME = path.resolve(process.env.HOME, '.github-clubhouse')

export function saveConfig(options) {
  fs.writeFileSync(CONFIG_PATHNAME, JSON.stringify(options), {encoding: 'utf8'})
}

export function createConfigIfNotExists(options) {
  try {
    fs.statSync(CONFIG_PATHNAME)
  } catch (err) {
    saveConfig(options)
  }
}

export function loadConfig() {
  try {
    const config = fs.readFileSync(CONFIG_PATHNAME, {encoding: 'utf8'})
    return JSON.parse(config)
  } catch (err) {
    return {}
  }
}
