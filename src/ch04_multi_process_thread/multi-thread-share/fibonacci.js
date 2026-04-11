'use strict'

const fibonacci = require('../fibonacci')

// workerDataでInt32Arrayインスタンスを受け取る
const { workerData: int32Array, parentPort } = require('node:worker_threads')

parentPort.on('message', n => {
    console.log('woker-thread: ', n)
    parentPort.postMessage(fibonacci(n))

    // 処理のたびに最初の値をインクリメント
    // int32Array[0] += 1 // スレッドセーフでない

    // Atomics.add()でアトミックに値をインクリメント=スレッドセーフ
    Atomics.add(int32Array, 0, 1) // in32Arrayの0番目に1を足す
})

