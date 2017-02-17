# 課程行事曆製作工具

[![Build Status](https://travis-ci.org/Yukaii/ics-scheduler.svg?branch=master)](https://travis-ci.org/Yukaii/ics-scheduler)

![preview](./docs/images/screenshot-1.png)

一個把學校課表轉成 ics 格式(iCalendar, [RFC 5545](https://tools.ietf.org/html/rfc5545)) 的工具 :heart:。支援各平臺行事曆軟體。

技術方面，本專案前端採用 Bootstrap v4 alpha 以及 jQuery 3。雖然已經 2016，不過做架構簡單的東西，這樣就夠了。

However, [it's not the future](https://hackernoon.com/how-it-feels-to-learn-javascript-in-2016-d3a717dd577f) :joy:


## 支援學校列表

* 臺灣科技大學

更多請[自行貢獻](https://github.com/Yukaii/ics-scheduler/wiki/Contribution)或是拍打餵食專案作者 :sweat_smile:

## Development

請確定已安裝 [Node.js](https://nodejs.org)。

本專案採用 [brunch](http://brunch.io) 作為建置工具，總之設定檔比 webpack 少寫很多 :laughing:

```bash
npm install
npm install brunch -g
brunch watch --server
```

### Build for production

```bash
brunch build --production
```

### Troubleshooting

#### ENFILE: file table overflow

Reference to this issue: https://github.com/karma-runner/karma/issues/1979, run

```bash
sudo launchctl limit maxfiles 16384 16384 && ulimit -n 16384
```

## Deployment

本專案使用 Travis CI 做 Continous Deployment，自動部屬到 GitHub Pages 上。更多內容請參考本專案 Wiki

[https://github.com/Yukaii/ics-scheduler/wiki/Deployment](https://github.com/Yukaii/ics-scheduler/wiki/Deployment
)

## Contribution

參照本專案 Wiki 的 [Contribution Guide](https://github.com/Yukaii/ics-scheduler/wiki/Contribution)

## Credits

本專案改寫自 [Neson](https://github.com/Neson) 四年前的專案 [NTUST-ics-Class-Schedule](https://github.com/Neson/NTUST-ics-Class-Schedule)。為了用 GitHub Pages 免費部屬，由 PHP 改為客端 JavaScript 重寫。去掉資料庫，取而代之是純粹的 JSON 檔案儲存。

更多實作細節可參考本專案 wiki [Architecture](https://github.com/Yukaii/ics-scheduler/wiki/Architecture)
 部分。

## License

MIT
