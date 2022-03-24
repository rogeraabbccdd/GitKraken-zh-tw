const fs = require('fs')
const path = require('path');
const request = require("request")

const config = require('./config.json')

// 先從 ./update_version.json 中拿到設定並組出正確獲取翻譯 json 的 url
const rpl = new URL(config['remote_repo_url'])
const remote_strings_tw_url = [
  `${config['usercontent_base_url']}${rpl['pathname']}/`,
  `${config['aims_branche']}/${config['remote_strings_tw_name']}`,
].join('')

// 直接從遠端 repo 覆蓋 local strings.json
request({
  url: remote_strings_tw_url,
  method: "get",
  json: true,
  headers: {
    "content-type": "application/json",
  },
}, function(error, response, body) {
  if (!error && response.statusCode == 200) {
    // console.log(body)
    const directoryPath = path.join(path.resolve(),
      `./${config['remote_strings_tw_name']}`);
    fs.writeFile(directoryPath, JSON.stringify(body, null, 2), err => {
      if (err) throw err;
      console.log('update done.');
    })
  }
})
