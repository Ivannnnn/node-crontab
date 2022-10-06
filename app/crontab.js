const { basename, dirname } = require('path')
const fs = require('fs')
const { difference, crontabRead, crontabWrite } = require('./helpers')

const CRONTAB_JSON_PATH = __dirname + '/../crontab.json'

function transformToCrontabString(name, cronjobObj) {
  const { time, path, env = 'node' } = cronjobObj
  const logsDir = dirname(path) + '/.logs'
  const fileName = basename(path).split(' ')[0]

  if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir)

  return (
    [
      time,
      'export NODE_PATH=$(npm root --quiet --location=global) &&',
      `$(which ${env})`,
      path,
      `>> ${logsDir + '/' + fileName} 2>&1`,
    ].join(' ') + ` #@${name}@`
  )
}

function jsonCrontabToLinuxCrontab() {
  const crontabJson = require(CRONTAB_JSON_PATH)
  const crontab = crontabRead().split('\n')

  const newNames = difference(Object.keys(crontabJson), crontab.map(getName))

  const replaced = crontab
    .map((line) => {
      const name = getName(line)
      if (!name) return line
      return crontabJson[name]
        ? transformToCrontabString(name, crontabJson[name])
        : null
    })
    .filter((l) => l !== null)
    .join('\n')

  const added = newNames
    .map((name) => transformToCrontabString(name, crontabJson[name]))
    .join('\n')

  crontabWrite(replaced + '\n' + added)
}

const getName = (line) => line.match(/#@(.+)@$/)?.[1]

function remove(name) {
  const crontabJson = require(CRONTAB_JSON_PATH)
  delete crontabJson[name]
  fs.writeFileSync(CRONTAB_JSON_PATH, JSON.stringify(crontabJson, null, 2))
  jsonCrontabToLinuxCrontab()
}
function addOrUpdate(name, obj) {
  const crontabJson = require(CRONTAB_JSON_PATH)
  crontabJson[name] = obj
  fs.writeFileSync(CRONTAB_JSON_PATH, JSON.stringify(crontabJson, null, 2))
  jsonCrontabToLinuxCrontab()
}

module.exports = { addOrUpdate, remove, jsonCrontabToLinuxCrontab }
