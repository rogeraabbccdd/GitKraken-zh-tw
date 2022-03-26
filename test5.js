const fs = require('fs')
const path = require('path');
const rp = require('request-promise')

const config = require('./config.json')

function merge(enJSON, twJSON) {
  for (let key1st in enJSON) {
    for (let key2nd in enJSON[key1st]) {
      if (twJSON[key1st][key2nd]) {
        enJSON[key1st][key2nd] = twJSON[key1st][key2nd]
      }
    }
  }
  return JSON.stringify(enJSON, null, 2)
}

async function getRemoteStringsJSON_by_language(config, remote_strings_url) {
  // 先從 ./update_version.json 中拿到設定並組出正確獲取翻譯 json 的 url
  const rpl = new URL(config['remote_repo_url'])
  const remote_strings_tw_url = [
    `${config['usercontent_base_url']}${rpl['pathname']}/`,
    `${config['aims_branche']}/${remote_strings_url}`,
  ].join('')

  // 發出請求以獲得結果
  return await rp({
    url: remote_strings_tw_url,
    json: true,
  })
}

async function getRemoteStringsJSON_tw(config) {
  return await getRemoteStringsJSON_by_language(
    config, config['remote_strings_tw_name'])
}

async function getRemoteStringsJSON_en(config) {
  return await getRemoteStringsJSON_by_language(
    config, config['remote_strings_en_name'])
}

let values = await Promise.all([
  getRemoteStringsJSON_en(config),
  getRemoteStringsJSON_tw(config)
]);
const enJSON = values[0]
const twJSON = values[1]

const newStringsJSON = merge(enJSON, twJSON)



//
