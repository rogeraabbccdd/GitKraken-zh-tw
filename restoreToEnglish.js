#!/usr/bin/env node
const os = require("os");
const fs = require("fs");

const child_process = require("child_process");

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

fs.readFile("./strings.en.json", function(err, data) {
  if (err) throw err;
  getGitkrakenVersion().then(value => {
    console.log(value);
    replace_local_strings(data.toString(), value);
  });
});
