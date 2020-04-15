// 'use strict';
// //fsはファイルを読み込むためのモジュールの追加
// const fs = require('fs');

// //readlineはファイルを１行ずつ読み込むためのモジュールの追加
// const readline = require('readline');

// //第一引数に与えたファイルを読み込むための準備段階のオブジェクト
// //接点（インタフェース）を作るだけで、まだ読み込んでいない
// //JSとファイルを繋ぐ
// const rs = fs.createReadStream('./popu-pref.csv');

// //rsオブジェクトを使い、ファイルを１行１行読んでくれるオブジェクトを作る
// //接点（インタフェース）を作るだけで、まだ読み込んでいない
// //その繋がった接点から、どのようにファイルを読み込むかを決定→readline：１行ずつにしよう！
// const rl = readline.createInterface({ 'input': rs, 'output': {} });

// //集計されたデータを格納するオブジェクト
// const prefectureDataMap = new Map();

//読み込まれた時の無名関数を定義
//1行読み込まれたら、コンソールに出力してね命令
//node.jsが暇な時に、さっき作った接点から情報を読み込む（空き時間にやるのがストリーム）
//空き時間にやるから、すぐ実行ではなく「予約」！
// rl.on('line', (lineString) => {
//     const columns = lineString.split(',');
//     //parseIntは整数を返す
//     const year = parseInt(columns[0]);
//     const prefecture = columns[1];
// 　　//parseIntは整数を返す
//     const popu = parseInt(columns[3]);

'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト

rl.on('line', (lineString) => {
  const columns = lineString.split(',');
  const year = parseInt(columns[0]);
  const prefecture = columns[1];
  const popu = parseInt(columns[3]);
  
  if (year === 2010 || year === 2015) {
    let value = prefectureDataMap.get(prefecture);
    if (!value) {
      value = {
        popu10: 0,
        popu15: 0,
        change: null
      };
    }
    if (year === 2010) {
      value.popu10 = popu;
    }
    if (year === 2015) {
      value.popu15 = popu;
    }
    prefectureDataMap.set(prefecture, value);
  }
});

//全ての行を読み込み終わった際に呼び出される
rl.on('close', () => {
    for (let [key, value] of prefectureDataMap) { 
      value.change = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
      return pair2[1].change - pair1[1].change;
    });
    const rankingStrings = rankingArray.map(([key, value]) => {
      return key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change;
    });
    console.log(rankingStrings);
  });