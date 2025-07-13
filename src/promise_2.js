'use strict'

// コンストラクタを使ってfulfilledなPromiseインスタンスを生成
console.log(new Promise(resolve => resolve({ foo: 1})))

// Promise.resolve()を使ってfulfilledなPromiseインスタンスを生成
console.log(Promise.resolve({ foo: 2 }))

// コンストラクタを使ってrejectedなPromiseインスタンスを生成
console.log(new Promise((resolve, rejecte) => rejecte(new Error('エラー1'))))

// Promise.reject()を使ってrejectedなPromiseインスタンスを生成
console.log(Promise.reject(new Error('エラー2')))


// Promise.resolve()の引数にPromiseインスタンスを渡した場合、引数がそのまま返される.
const barPromise = Promise.resolve('bar')
console.log('barPromise', barPromise)
console.log(barPromise === Promise.resolve(barPromise))




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