'use strict'

function parseJSONAsync(json) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                // fullfilled状態にする
                resolve(JSON.parse(json))
            } catch (err) {
                // rejected状態にする
                reject(err)
                // throw new Error(err) // こっちでもPromiseをpending状態からrejected状態に遷移できる.
            }
        }, 1000)
    })
}


const toBeFulfilled = parseJSONAsync('{ "foo": 1 }')
const toBeRejected = parseJSONAsync('不正なJSON')
console.log("* Promise生成直後 *")
console.log(toBeFulfilled)
console.log(toBeRejected)
setTimeout(() => {
    console.log("* 1秒後 *")
    console.log(toBeFulfilled)
    console.log(toBeRejected)
}, 1000)


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