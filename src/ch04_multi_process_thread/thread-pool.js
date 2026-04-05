'use strict'

const { Worker } = require('node:worker_threads')

module.exports = class ThreadPool {
    // 空きスレッド、キューを初期化
    avairableWorkers = []
    queue = []

    constructor(size, filePath, options) {
        // 引数で指定された通りにスレッドを生成してプールする
        for (let i = 0; i < size; i++) {
            this.avairableWorkers.push(new Worker(filePath, options))
        }
    }

    // 外部から処理要求を受け付けるメソッド
    executeInThread(arg) {
        return new Promise(resolve => {
            const request = { resolve, arg }
            // 空きスレッドがあればリクエストを処理し、なければキューに積む
            const worker = this.avairableWorkers.pop()
            worker ? this.#process(worker, request) : this.queue.push(request)
        })
    }

    // 実際にスレッドで処理を実行するprivateメソッド
    #process(worker, { resolve, arg }) {
        worker.once('message', result => {
            // リクエスト元に結果を返す
            resolve(result) // ここがフィボナッチ関数になる

            // キューに積まれたリクエストがあれば処理し、なければ空きスレッドに戻す
            const request = this.queue.shift()
            request
                ? this.#process(worker, request) // 取り出したスレッドで処理
                : this.avairableWorkers.push(worker) // スレッド自体をリストに戻す
        })
        worker.postMessage(arg)
    }
}





