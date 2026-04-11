'use strict'
// Worker Thread

const { parentPort, workerData } = require('node:worker_threads')

parentPort.postMessage(
    workerData.buffer,
    // postMessage()の第二引数に転送対象オブジェクトを指定
    workerData.transfer ? [workerData.buffer] : []
)


