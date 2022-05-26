#!/usr/bin/env node
const os = require("os");
const fs = require("fs");
const child_process = require("child_process");

const rp = require("request-promise");
const JSON5 = require("json5");
require("json5/lib/register");

const config_path = "./config.json5";

/**
 * 單純合併兩個 JSON 語言檔
 * @param {object} enJSON
 * @param {object} twJSON
 * @returns {string} 組合後的 JSON 語言檔
 */
function merge(enJSON, twJSON) {
  for (let key1st in enJSON) {
    for (let key2nd in enJSON[key1st]) {
      if (twJSON[key1st][key2nd]) {
        enJSON[key1st][key2nd] = twJSON[key1st][key2nd];
      }
    }
  }
  return JSON.stringify(enJSON, null, 2);
}

/**
 * 爬取並回傳指定語言的 JSON 語言檔
 * @param {object} config
 * @param {string} remote_strings_url
 * @returns {Promise<object>} 返回 JSON 語言檔
 */
async function getRemoteStringsJSON_by_language(config, remote_strings_url) {
  // 先從 ./update_version.json 中拿到設定並組出正確獲取翻譯 json 的 url
  const rpl = new URL(config["remote_repo_url"]);
  const remote_strings_tw_url = [
    `${config["usercontent_base_url"]}${rpl["pathname"]}/`,
    `${config["aims_branche"]}/${remote_strings_url}`
  ].join("");

  // 用上面種里的 url 發出請求以獲得結果
  return await rp({
    url: remote_strings_tw_url,
    json: true
  });
}

/**
 * 爬 tw 語言檔
 * @param {object} config
 * @returns {Promise<object>}
 */
async function getRemoteStringsJSON_tw(config) {
  return await getRemoteStringsJSON_by_language(
    config,
    config["remote_strings_tw_name"]
  );
}

/**
 * 爬 en 語言檔
 * @param {object} config
 * @returns {Promise<object>}
 */
async function getRemoteStringsJSON_en(config) {
  return await getRemoteStringsJSON_by_language(
    config,
    config["remote_strings_en_name"]
  );
}

/**
 * @function getGitkrakenVersion
 * @description 獲取 gitKraken 版本
 * @access public
 *
 * @return {Promise<string>} gitKraken version
 */
async function getGitkrakenVersion() {
  return await new Promise(function(resolve) {
    child_process.exec("gitkraken -v", (error, stdout) => {
      let gitkraken_version = String(stdout).trim();
      resolve(gitkraken_version);
    });
  });
}

/**
 * @function replace_local_strings
 * @description 替換 GitKraken 的語言檔
 * @access public
 *
 * @param {string} newStringsJSON   已翻譯過的語言檔字串
 * @param {string} gitkrakenVersion 這台電腦的 GitKraken 版本
 *
 * @return {void} 沒回傳只能看log
 */
async function replace_local_strings(newStringsJSON, gitkrakenVersion) {
  // 判斷不同平台並設立正確的 strings_path
  const platform_type = os.type();
  let strings_path;
  console.log(`Platform type is ${platform_type}`);

  /**
   * @function writeStringsFile
   * @description 給 replace_local_strings 用來取代 local_strings
   * @access private
   *
   * @param {string} strings_path 要取代的 strings 位置
   *
   * @return {void} 沒回傳只能看log
   */
  function writeStringsFile(strings_path) {
    fs.access(strings_path, fs.constants.F_OK, err => {
      console.log(`${strings_path} ${err ? "不存在" : "存在"}`);
      if (err) {
        // 不正確噴錯
        console.error(err);
      } else {
        // 取代 loacl 的語言檔
        fs.writeFile(strings_path, newStringsJSON, "utf8", () => {
          console.log("取代完成！");
          console.log("輸入任意鍵結束...");
        });
      }
    });
  }

  // 生出 strings_path
  if (platform_type == "Linux") {
    // 在 Linux 上
    strings_path = "/usr/share/gitkraken/resources/app.asar.unpacked/src";
  } else if (platform_type == "Darwin") {
    // 在 Darwin(macOS) 上
    strings_path = [
      "/Applications/GitKraken.app/Contents/",
      "Resources/app.asar.unpacked/src/strings.json"
    ].join("");
  } else {
    // 在 Windows_NT 上
    strings_path = [
      process.env["LOCALAPPDATA"],
      "\\gitkraken\\app-",
      gitkrakenVersion,
      `\\resources\\app.asar.unpacked\\src\\strings.json`
    ]
      .join("")
      .trim();
  }
  writeStringsFile(strings_path);
}

/**
 * @function inputAnyKeyToExit
 * @description 呼叫後輸入任一鍵繼續(給使用者確認終端機輸出資訊用)
 * @access public
 *
 * @return {void}
 */
function inputAnyKeyToExit() {
  console.log("input Any Key To Exit... 輸入任意鍵結束...");
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }
  process.stdin.resume();
  process.stdin.on("data", process.exit.bind(process, 0));
}

async function main(config_path) {
  try {
    var config_str = fs.readFileSync(config_path, "utf8");
    var config = JSON5.parse(config_str);
  } catch (e) {
    console.log("'./config.json5'不存在或格式錯誤");
    inputAnyKeyToExit();
    return 1;
  }

  // 抓遠端語言 JSON 下來
  let values = await Promise.all([
    getRemoteStringsJSON_en(config),
    getRemoteStringsJSON_tw(config),
    getGitkrakenVersion()
  ]);
  const enJSON = values[0];
  const twJSON = values[1];
  const gitkrakenVersion = values[2];

  if (gitkrakenVersion === "") {
    const can_not_use_gitkraken_txt = [
      "無法獲取 GitKraken 版本，",
      "請確認是否未安裝或未將 gitkraken 指令登入環境變數"
    ].join("");
    console.log(can_not_use_gitkraken_txt);
  } else {
    console.log(`Loacl GitKraken version = ${gitkrakenVersion}`);
    // 進行取代後輸出新的 JSON 語言檔
    const newStringsJSON = merge(enJSON, twJSON);
    replace_local_strings(newStringsJSON, gitkrakenVersion);
  }
  inputAnyKeyToExit();
}

main(config_path); // 施展魔法 (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧
