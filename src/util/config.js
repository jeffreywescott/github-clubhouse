import path from 'path'
import fs from 'fs'

export const CONFIG_PATHNAME = path.resolve(process.env.HOME, '.github-clubhouse')

export function saveConfig(options, pathname = CONFIG_PATHNAME) {
  fs.writeFileSync(pathname, JSON.stringify(options), {encoding: 'utf8'})
}

export function loadConfig(pathname = CONFIG_PATHNAME) {
  try {
    const config = fs.readFileSync(pathname, {encoding: 'utf8'})
    return JSON.parse(config)
  } catch (err) {
    // no config file exists
    return {}
  }
}
