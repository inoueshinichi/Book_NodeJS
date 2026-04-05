'use strict'

const http = require('node:http')
const os = require('node:os')
const ThreadPool = require('../thread-pool')

// CPUコア数と同じサイズのスレッドプールを生成
const threadPool = new ThreadPool(os.cpus().length / 2, `${__dirname}/fibonacci.js`)

let reqCount = 0

const server = http.createServer()
server.on('request', async (req, res) => {
    // http://localhost:3000/10へのリクエストはreq.urlでは'/10'になるので、
    
    // そこから1文字目を取り除いてnを取得する
    const [slash, ...rest] = Array.from(req.url)
    // console.log('rest', rest)
    // console.log('rest.join()', rest.join(""))

    reqCount++;
    const n = Number(rest.join(""))
    console.log(`[${reqCount}] n: ${n}`)

    if (Number.isNaN(n)) {
        return res.end()
    }

    // スレッドプールにあるスレッドを使い回す.
    const result = await threadPool.executeInThread(n) // fibonacci(n)

    res.end(result.toString())
})


server.listen(3000, 'localhost', () => {
    console.info('サーバーが起動しました')
})


