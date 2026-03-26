'use strict'

const events = require('node:events')

// 注意: この実装には一部問題がある
function createFizzBuzzEventEmitter(until) {
    const eventEmitter = new events.EventEmitter()
    // _emitFizzBuzz(eventEmitter, until)

    /*覚えておくべきこと：EventEmitterインスタンスの生成処理の中で同期的にイベントを発行してはならない */

    // 常に非同期で実行させる
    process.nextTick(() => _emitFizzBuzz(eventEmitter, until))

    return eventEmitter
}

// async/await構文が使えるように、イベントを発行する部分を別関数に切り出す
async function _emitFizzBuzz(eventEmitter, until) {
    eventEmitter.emit('start') // ここバグ! on()で受け取る前にイベント発行してしまっていて、捕獲できない.
    let count = 1
    while (count <= until) {
        await new Promise(resolve => setTimeout(resolve, 100))
        if (count % 15 === 0) {
            eventEmitter.emit('FizzBuzz', count)
        } else if (count % 3 === 0) {
            eventEmitter.emit('Fizz', count)
        } else if (count % 5 === 0) {
            eventEmitter.emit('Buzz', count)
        }
        count += 1
    }
    eventEmitter.emit('end') // ここもバグ
}


// リスナ一覧
function startListener() {
    console.log('start')
}
function fizzListener(count) {
    console.log('Fizz', count)
}
function buzzListener(count) {
    console.log('Buzz', count)
}
function fizzBuzzListener(count) {
    console.log('FizzBuzz', count)
}
function endListener() {
    console.log('end')
    this // thisはEventEmitterインスタンス
        // すべてのイベントからリスナを削除
        .off('start', startListener)
        .off('Fizz', fizzBuzzListener)
        .off('Buzz', buzzListener)
        .off('FizzBuzz', fizzBuzzListener)
        .off('end', endListener)
}


// 実行 : 注意) EventEmitter(Subject)に登録したリスナの関数は同期的に実行されるので注意.
createFizzBuzzEventEmitter(40)
    .on('start', startListener)
    .on('Fizz', fizzListener)
    .on('Buzz', buzzListener)
    .on('FizzBuzz', fizzBuzzListener)
    .on('end', endListener)


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