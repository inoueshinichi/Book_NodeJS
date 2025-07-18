'use strict'


const sleep = (ms, v) => setTimeout(() => console.log(`Sleep ${ms}ms: `, v), ms)

// Promise.all()
// Promise.race()
// Promise.allSettled()
// Promise.any()

/* Promise.all() */
const allResoleved = Promise.all([
    1, // Promise以外もOK -> fullfiledなPromiseとして扱われる
    Promise.resolve('foo'),
    Promise.resolve(true),
])
console.log('allResolved', allResoleved)
sleep(1000, allResoleved)

const containsRejected = Promise.all([
    1, 
    Promise.resolve('foo'),
    Promise.reject(new Error("エラー")),
    Promise.resolve(true),
])
console.log('containsRejected', containsRejected)
sleep(1000, containsRejected)

// 空配列は解決ずみ
sleep(1000, Promise.all([]))

// 1秒かかる処理
function asyncFunc() {
    return new Promise(resolve => setTimeout(resolve, 1000))
}

// 1秒かかる処理を直列で処理する
let start = performance.now()
asyncFunc()
    .then(asyncFunc)
    .then(asyncFunc)
    .then(asyncFunc)
    .then(() => {
        const end = performance.now()
        const elapsed = end - start
        console.log("逐次実行時間[ms]", elapsed)
    })

// 1秒かかる処理を並列で処理する
start = performance.now()
Promise.all([
    asyncFunc(),
    asyncFunc(),
    asyncFunc(),
    asyncFunc(),
]).then(() => {
    const end = performance.now()
    const elapsed = end - start
    console.log("並列実行時間[ms]", elapsed)
})


/* Promise.race() */
function wait(time) {
    return new Promise(resolve => setTimeout(resolve, time))
}

// 最初にfulfilledになるケース
const fulfilledFirst = Promise.race([
    wait(10).then(() => 1),
    wait(30).then(() => 'foo'),
    wait(20).then(() => Promise.reject(new Error("Promise.race エラー1")))
])
sleep(1000, fulfilledFirst)

// 最初にrejectedになるケース
const rejectedFirst = Promise.race([
    wait(20).then(() => 1),
    wait(30).then(() => 'foo'),
    wait(10).then(() => Promise.reject(new Error("Promise.race エラー2")))
])
sleep(1000, rejectedFirst)

// Promiseインスタンス以外の値が含まれるケース
const containsNonPromise = Promise.race([
    wait(10).then(() => 1),
    'bar',
    wait(20).then(() => Promise.reject(new Error("Promise.race エラー3")))
])
sleep(1000, containsNonPromise)


// Promise.race([]) 空配列の場合、解決されることのないPending状態のPromiseインスタンスを返す
const raceWithEmptyArray = Promise.race([])
sleep(1000, raceWithEmptyArray)

// Promise.race()によるタイムアウト処理の実装
function withTimeout(promise, timeout) {
    return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error("タイムアウト")), timeout))
    ])
}
// 20ミリ秒で完了する非同期処理
const promise = new Promise(resolve => setTimeout(() => resolve('tiny-tank'), 20))
// タイムアウト30ミリで実行
const shouldBeResolved = withTimeout(promise, 30)
shouldBeResolved.then(console.log).catch(console.log)

// タイムアウト10ミリで実行
const shouldBeRejected = withTimeout(promise, 10)
shouldBeRejected.then(console.log).catch(console.log)


/* Promise.allSettled() */
const allSettled = Promise.allSettled([
    1,
    Promise.resolve('foo'),
    Promise.reject(new Error("Promise.allSettled エラー")),
    Promise.resolve(true),
])
allSettled.then(console.log)
console.log(Promise.allSettled([]).then(console.log))


/* Promise.any() */
const anyFulfilled = Promise.any([
    Promise.resolve("anyFulfilled"),
    Promise.reject(new Error("anyFulfilled エラー")),
    Promise.resolve(true),
])
anyFulfilled.then(console.log)

const noneFulfilled = Promise.any([
    Promise.reject(new Error("any Error 1")),
    Promise.reject(new Error("any Error 2")),
]) // AggregateError
noneFulfilled.then(console.log).catch(console.error)

// errorsプロパティが空配列のAggregateErrorインスタンス
Promise.any([]).catch(err => console.log(`Promise.any([]): ${err.errors}`))


/* util.promisify() */
// Promiseを返す関数を提供する
const util = require('node:util')
const fs = require('node:fs')
const readdir = util.promisify(fs.readdir)
readdir('.').then(console.log)

// [util.promisify.custom]プロパティにカスタマイズした
// util.promisify()を定義可能
console.log("setTimeout[util.promisify.custom]", setTimeout[util.promisify.custom])
const setTimeoutPromise = util.promisify(setTimeout)
setTimeoutPromise(1000).then(() => console.log("1秒経過"))

// fs Promise API
fs.promises.readdir('.').then(console.log)

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