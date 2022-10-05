const exec = (command, options = {}) =>
  require('child_process').execSync(command, { encoding: 'utf-8', ...options })

function debounce(fn, wait = 0) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn.call(this, ...args), wait)
  }
}

function checkJSON(str) {
  if (/^\s*(\{|\[)/.test(str)) {
    try {
      return JSON.parse(str)
    } catch (e) {
      return false
    }
  }
}

const crontabRead = () => exec('crontab -l').trim()
const crontabWrite = (str) => exec(`echo "${str}" | crontab`)

const difference = (arr1, arr2) => arr1.filter((x) => !arr2.includes(x))

module.exports = { debounce, checkJSON, difference, crontabRead, crontabWrite }
