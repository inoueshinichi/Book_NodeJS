'use strict'

const v8 = require('node:v8')

// Dateインスタンスを含むオブジェクトの生成
const dateObj = {
    lastDayOfHeisei: new Date(2019, /*0-11: 3:4月*/3, /*day*/30, /*hour*/9)
}

// JSON.stringify()で文字列にシリアライズ
const stringifiedDateObj = JSON.stringify(dateObj)
console.log(stringifiedDateObj)

// JSON.parse()でパース
console.log(JSON.parse(stringifiedDateObj))


// JSONは循環参照に対応していない
const circular = { bar: 1 }
// 循環参照させる
circular.foo = circular
console.log(circular)

// エラー
// JSON.stringify(circular)

/*構造化クローンアルゴリズム*/
const featuresMemo = `
1. Symbolを除くすべてのプリミティブ型を正しくクローンする
2. Booleanオブジェクト
3. Stringオブジェクト
4. Dateオブジェクト
5. RegExpオブジェクト, ただしlastIndexフィールドはコピーされない
6. ArrayBuffer, SharedArrayBuffer, TypedArray
7. Array, Map, Set
8. プレーンなオブジェクト. e.g. { foo: 1 }のようにオブジェクトリテラルで作られたオブジェクト
※ 循環参照に対応している

APIメソッド
v8.serialize()
v8.deserialize()
`

const circularWithDate = {
    lastDayOfHeisei: new Date(2019, 3, 30, 9)
}
circularWithDate.foo = circularWithDate // 循環参照
console.log('circularWithDate', circularWithDate)

// シリアライズ
const serializedCircularWithDate = v8.serialize(circularWithDate)
console.log('serializedCircularWithDate', serializedCircularWithDate)

// デシリアライズ
const deserializedCircularWithDate = v8.deserialize(serializedCircularWithDate)
console.log('deserializedCircularWithDate', deserializedCircularWithDate)

// lastDayOfHeiseiがDateインスタンスであることをチェック
console.log('[Check] deserializedCircularWithDate.lastDayOfHeisei instanceof Date: ', deserializedCircularWithDate.lastDayOfHeisei instanceof Date)


/* Nodejsオンリーな処理 */
process.on('unhandledRejection', 
    (
        err, // Promiseの拒否理由
        promise // 放置されたrejectedなPromise
    ) => {
        // unhandledRejecction発生の原因を調べられるよう、ログ出力などの対応を行う
        console.error('unhandledRejection発生', err)
    }
)
process.on('uncaughtException', err => {
    // プロセス終了前に必要な後片付けやログ出力を行う
    // process.exit(1)により必ずプロセスをエラー終了させること
    console.error(err)
    process.exit(1)
})