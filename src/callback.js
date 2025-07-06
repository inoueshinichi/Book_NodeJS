'use strict'


function parseJSONAsync(json, callback) {
    setTimeout(() => {
        try {
            callback(null, JSON.parse(json))
        } catch (err) {
            callback(err)
        }
    }, 1000)
}

const cache = {}

function parseJSONAsyncWithCache(json, callback) {
    const cached = cache[json]
    if (cached) {
        // Node.jsのみを対象としたコードの場合
        // process.nextTick()を用いてタスクをnextTickQueueに積む
        // process.nextTick(() => callback(cached.err, cached.result))

        // Web標準を対象としたコードの場合
        // 1. queueMicrotask()を用いてタスクをmicroTaskQueueに積む
        // queueMicrotask(() => callback(cached.err, cached.result))
        // 2. Promiseを使ってタスクをmicroTaskQueueに積む
        Promise.resolve().then(() => callback(cached.err, cached.result))
        return
    }

    parseJSONAsync(json, (err, result) => {
        cache[json] = { err, result }
        callback(err, result)
    })
}

// 1回目の実行
parseJSONAsyncWithCache(
    '{ "message": "Hello", "to": "World" }',
    (err, result) => {
        console.log("1回目の結果", err, result)

        // コールバックの中で2回目を実行
        parseJSONAsyncWithCache(
            '{ "message": "Hello", "to": "World" }',
            (err, result) => {
                console.log("2回目の結果", err, result)
            }
        )
        console.log("2回目の呼び出し完了")
    }
)
console.log("1回目の呼び出し完了")

