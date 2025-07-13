'use strict'


// stringで解決されるPromiseインスタンスの生成
const stringPromise = Promise.resolve('{ "foo": 1 }')
console.log('stringPromise', stringPromise)

// numberで解決される新しいPromiseインスタンスの生成(onRejected()を省略)
const numberPromise = stringPromise.then(str => str.length)
console.log('numberPromise', numberPromise)

setTimeout(() => {
    console.log('numberPromise after 1s:', numberPromise)
}, 1000)


// 元のPromiseインスタンスが何ならかの理由で拒否された時、onRejectedを省略すると
// then()の戻り値のPromiseインスタンスも同じ理由で拒否される。
const unrecoveredPromise = Promise.reject(new Error('エラー')).then(() => 1)
setTimeout(() => {
    console.log('unrecoveredPromise after 1s:', unrecoveredPromise)
}, 1000)


// onRejectedを省略せずに何かを返すようにすると、その値で解決され得たPromiseインスタンスが得られる.
const recoveredPromise = Promise.reject(new Error('エラー resolved')).then(() => 1, err => err.message)
setTimeout(() => {
    console.log('recoveredPromise', recoveredPromise)
}, 1000)


// thenの中で非同期処理の結果, つまりPromiseを戻り値としてoK
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

const objPromise = stringPromise.then(parseJSONAsync)
setTimeout(() => {
    console.log('objPromise', objPromise)
}, 2000)


// Promise Chainによる各非同期処理をコード上で同期的に書ける

// catch()による非同期処理のエラー処理. 
// ※ catchにPromise Chainのいずれかで発生するエラーを集約できる
const withoutOnFulfilled = Promise.reject(new Error("withoutOnFulfilled エラー")).then(undefined, () => 0)
setTimeout(() => {
    console.log('withoutOnFulfilled', withoutOnFulfilled)
}, 1000)

const catchedPromise = Promise.reject(new Error('Catched Error')).catch(() => -1)
setTimeout(() => {
    console.log('catchedPromise', catchedPromise)
}, 1000)


// finallyは、非同期処理が成功したかどうかに関わらず、Promiseインスタンスが
// settled状態になった時に実行されるコールバック
const onFinally = () => console.log('finallyのコールバック')

// fulfilledなPromiseインスタンスに対して呼び出される場合
console.log(Promise.resolve().finally(onFinally))

// rejectedなPromiseインスタンスに対して呼び出される場合
console.log(Promise.reject().finally(onFinally))

// resolve状態の場合finallyはPromiseの戻り値に影響を与えない
const returnValueInFinally = Promise.resolve(100).finally(() => 2)
setTimeout(() => {
    console.log('returnValueInFinally', returnValueInFinally)
}, 1000)

// rejected状態の場合finallyの結果はPromiseの戻り値に影響を与える
// finally内でthrow new Error('エラー')でrejected状態にした場合
const throwErrorInFinally = Promise.resolve(100).finally(() => { throw new Error('Finally Error')})
setTimeout(() => {
    console.log('throwErrorInFinally', throwErrorInFinally)
}, 1000)


// 正常系、異常系問わずコールバックの戻り値がPromiseインスタンスの場合、
// finally()の返すPromiseインスタンスはコールバックの返すPromiseインスタンス
// が解決されるまで、解決されない.
// 正常系・異常系のPromiseはfinallyのPromiseが解決後に解決される.
Promise
    .resolve('Promise is resolved aflter finally promise has resolved.')
    .finally(() =>
        new Promise(resolve =>
            setTimeout(
                () => {
                    console.log("finally()で1秒経過")
                    resolve()
                },
                1000
            )
        )
    )
    .then(console.log)


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