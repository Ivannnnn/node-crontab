#!/usr/bin/env node

const exec = (command, options = {}) =>
  require('child_process').execSync(command, { encoding: 'utf-8', ...options })
const fs = require('fs')
const { checkJSON } = require('./helpers')
const crontab = require('./crontab.js')

const CRONTAB_JSON_PATH = __dirname + '/../crontab.json'

function isCLICall() {
  const stackLine = new Error().stack.split('\n')[2]
  const callerModuleName = /\((.*):\d+:\d+\)$/.exec(stackLine)[1]
  return require.main.filename === callerModuleName
}

function editCrontabJson() {
  const old = fs.readFileSync(CRONTAB_JSON_PATH, 'utf-8')
  exec(`code -w ${CRONTAB_JSON_PATH}`)
  //exec('"${EDITOR:-nano}" -w ' + CRONTAB_JSON_PATH) // doesn't work
  const fresh = fs.readFileSync(CRONTAB_JSON_PATH, 'utf-8')

  if (!checkJSON(fresh)) return console.error('Not valid JSON!')
  if (fresh === old) console.log('No changes made!')

  crontab.jsonCrontabToLinuxCrontab()
}

if (isCLICall()) editCrontabJson()


exports.addOrUpdate = crontab.addOrUpdate
exports.remove = crontab.remove
