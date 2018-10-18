
let prevMessage = ''
let dotCount = 0

export function log() {
  let message = ''
  for (let i = 0; i < arguments.length; i++) {
    message += _toString(arguments[i])
  }
  _log(message)
}

export function logAppend() {
  let message = ''
  for (let i = 0; i < arguments.length; i++) {
    message += _toString(arguments[i])
  }
  _log(message, true)
}

function _log(message, append = false) {
  // do not repeat the previous message, just output a dot
  if (message === prevMessage) {
    process.stdout.write('.')
    dotCount += 1
  } else {
    prevMessage = message
    if (dotCount > 0) {
      dotCount = 0
    }
    if (!append) {
      message = '\n' + message
    }
    process.stdout.write(message)
  }
}

function _toString(item) {
  if (typeof item === 'object') {
    return JSON.stringify(item)
  }
  return item
}
