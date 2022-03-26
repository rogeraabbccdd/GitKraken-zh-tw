# GitKraken 正體中文 (台灣) 翻譯

ℹ️ 目前支援版本: 8.3.3
[GitKraken](https://www.gitkraken.com/) 正體中文 (台灣) 翻譯補丁  
目前以緩慢速度翻譯中，8.3.3 除部分 Npm 與 Yarn 指令說明外其他皆翻譯完畢

![screenshot](./screenshot.png)

## 準備環境

1. 安裝 [Node.js](https://nodejs.org/en/)
2. 安裝下列模組

```
npm install --save request
npm install --save request-promise
```

## 使用及更新方法

不管是第一次安裝或更新後都可以直接照下面說的做

- 下載專案後打開資料夾，並在該資料夾打開終端機後執行 `node update.js`
  (Windows 使用者可以直接執行 `update.bat`)
- 重新開啟 GitKraken 後，至 Preference -> UI Customization -> Language 切換語言
  ![screenshot](./preferences.png)

## 改壞了怎麼辦？

1. 下載 `strings.en.json` 並改名為 `strings.json`
2. 依你的 OS 把`strings.json`丟過去取代
   - Windows: `%LOCALAPPDATA%\gitkraken\app-8.3.3\resources\app.asar.unpacked\src\strings.json`
   - Mac: `/Applications/GitKraken.app/Contents/Resources/app.asar.unpacked/src/strings.json`
   - Linux: `/usr/share/gitkraken/resources/app.asar.unpacked/src/strings.json`
3. 重開你的 GitKraken

## config.json 設定

```
{
  // 這份專案的翻譯版本(預計給使用者比較用，但目前沒有任何效果)
  "local_strings_version": "8.3.3",
  // 翻譯來源的倉庫，改成自己喜歡的作者就好
  "remote_repo_url": "https://github.com/we684123/GitKraken-zh-tw",
  // 直接獲取json的基本網址 (你應該不會碰到?
  "usercontent_base_url":"https://raw.githubusercontent.com",
  // 翻譯來源倉庫的分支名稱
  "aims_branche": "master",
  // 翻譯來源倉庫的原始英文語言JSON檔名稱
  "remote_strings_en_name": "strings.en.json",
  // 翻譯來源倉庫的中文語言JSON檔名稱
  "remote_strings_tw_name": "strings.json"
}
```

## 翻譯參考

- [VSCode 繁體中文語言包](https://github.com/microsoft/vscode-loc/tree/master/i18n/vscode-language-pack-zh-hant)
- [k-skye 的 gitkraken-chinese](https://github.com/k-skye/gitkraken-chinese)
- [gitg 繁體中文 (台灣) 翻譯](https://gitlab.gnome.org/GNOME/gitg/-/blob/master/po/zh_TW.po)
- [《Pro Git》第二版中文文件翻譯對照表與規範](https://gist.github.com/fntsrlike/cf1e96d60b6f34fab725599b06dfcb2a)
