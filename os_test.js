const fs = require('fs')
const os = require('os')
const child_process = require('child_process');


// 判斷不同平台並設立正確的 strings_path
const platform_type = os.type()
let strings_path
console.log(`platform_type is ${platform_type}`);
if (platform_type == 'Linux') {
  // 在 Linux 上
  strings_path = "/usr/share/gitkraken/resources/app.asar.unpacked/src"
  fs.access(strings_path, fs.constants.F_OK, (err) => {
    console.log(`${strings_path} ${err ? '不存在' : '存在'}`);
    if (err) {
      // 不正確噴錯
      logger.error(err)
    } else {
      // 取代 loacl 的語言檔
      fs.writeFile('./strings.json', newStringsJSON, 'utf8', () => {
        console.log('finished')
      })
    }
  });
} else if (platform_type == 'Darwin') {
  // 在 Darwin(macOS) 上
  strings_path = [
    "/Applications/GitKraken.app/Contents/",
    "Resources/app.asar.unpacked/src/strings.json"
  ].join('')
  fs.access(strings_path, fs.constants.F_OK, (err) => {
    console.log(`${strings_path} ${err ? '不存在' : '存在'}`);
    if (err) {
      // 不正確噴錯
      logger.error(err)
    } else {
      // 取代 loacl 的語言檔
      fs.writeFile('./strings.json', newStringsJSON, 'utf8', () => {
        console.log('finished')
      })
    }
  });
} else {
  // 在 Windows_NT 上
  // 生出 strings_path
  await child_process.exec('gitkraken -v', (error, stdout, stderr) => {
    let gitkraken_version = stdout
    strings_path = [
      process.env['LOCALAPPDATA'],
      "\\gitkraken\\app-",
      gitkraken_version,
      `\\resources\\app.asar.unpacked\\src\\strings.json`,
    ].join('').replace('\n', '')
    console.log(`strings_path:\n${strings_path}`);

    // 檢查生出來的 path 是否正確
    fs.access(strings_path, fs.constants.F_OK, (err) => {
      console.log(`${strings_path} ${err ? '不存在' : '存在'}`);
      if (err) {
        // 不正確噴錯
        logger.error(err)
      } else {
        // 取代 loacl 的語言檔
        fs.writeFile('./strings.json', newStringsJSON, 'utf8', () => {
          console.log('finished')
        })
      }
    });
  })
}
