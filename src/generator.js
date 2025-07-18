'use strict'

/**
 * ジェネレータ関数
 */
function* generatorFunc() {
    console.log("ジェネレータ関数開始")
    console.log("yield 1")
    yield 1
    console.log("yield 2")
    yield 2
    console.log("yield 3")
    yield 3
}
const generator = generatorFunc()
generator.next()
generator.next()
generator.next()

/**
 * イテレータプロトコル：値の配列を生成するための標準的な方法を定義したもの
 * ジェネレータ=イテレータ
 * [Symbol.iterator]()メソッドによってイテレータが返される
 * イテラブル：[Symbol.iterator]()メソッドを持ったオブジェクト.
 * 配列, Map, Setなども全てイテラブルなオブジェクｔ
 */
const generator2 = generatorFunc()
const iterator = generator2[Symbol.iterator]()
iterator.next()
iterator.next()
iterator.next()
console.log("iterator === generator2", iterator === generator2)

// イテラブルは反復可能オブジェクトなのでfor...of構文が使える
const generator3 = generatorFunc()
for (const v of generator3) { console.log(`for...of`, v) }

const arrIter = [1,2,3][Symbol.iterator]()
for (const v of arrIter) { console.log('for...of', v) }






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
    process.exit(1)
})