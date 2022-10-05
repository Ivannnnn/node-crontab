#!/usr/bin/env node

const exec = (command, options = {}) =>
  require('child_process').execSync(command, { encoding: 'utf-8', ...options })
const fs = require('fs')
const { checkJSON } = require('./helpers')
const crontab = require('./crontab.js')

function isCLICall() {
  const stackLine = new Error().stack.split('\n')[2]
  const callerModuleName = /\((.*):\d+:\d+\)$/.exec(stackLine)[1]
  return require.main.filename === callerModuleName
}

function editCrontabJson() {
  const old = fs.readFileSync('./crontab.json', 'utf-8')

  exec('"${EDITOR:-nano}" -w crontab.json')

  const fresh = fs.readFileSync('./crontab.json', 'utf-8')

  if (!checkJSON(fresh)) return console.error('Not valid JSON!')
  if (fresh === old) console.log('No changes made!')

  crontab.jsonCrontabToLinuxCrontab()
}

if (isCLICall()) editCrontabJson()

exports.addOrUpdate = crontab.addOrUpdate
exports.remove = crontab.remove
