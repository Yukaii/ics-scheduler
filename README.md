# 課程行事曆產生工具

繼承原專案 [Neson/NTUST-ics-Class-Schedule](https://github.com/Neson/NTUST-ics-Class-Schedule)，為了用 GitHub Pages 免費部屬，改成完全用 Client Side JavaScript 的架構 :heart:

架構保留擴充其它學校的可能。

## Dependencies

* Node Js (6.2 up)

## Development

```bash
npm install
npm install brunch -g
brunch watch --server
```

### Build

```bash
brunch build --production
```

### Run crawler

```bash
./bin/ntust
```

會在 `app/assets/data/ntust` 底下儲存抓下的課程資料檔。格式範例為：

```js
/* 3N1102702.json */
{
  "code": "3N1102702",
  "name": "東亞現代化城市發展",
  "lecturer": "王恩美",
  "periods": [
    {
      "day": 2,
      "time": "09:10-10:00",
      "location": "本部 樸407"
    },
    {
      "day": 2,
      "time": "10:20-11:10",
      "location": "本部 樸407"
    },
    {
      "day": 2,
      "time": "11:20-12:10",
      "location": "本部 樸407"
    }
  ]
}
```
