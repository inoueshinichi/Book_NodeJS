'use strict'

const http = require('node:http')

const PORT = 3000

// ToDo一覧
const todos = [
    { id: 1, title: 'Tiny', completed: false },
    { id: 2, title: 'Tank', completed: true },
]

// HTTPサーバの初期化
const server = http.createServer()

server.on('request', async (req, res) => {
    // リクエストのURLやHTTPメソッドに応じて適切なレスポンスを返す
    if (req.url === '/api/todos') {
        if (req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            return res.end(JSON.stringify(todos))
        }
        // GET以外のHTTPメソッドはサポートしないため405(Method Not Allowed)
        res.statusCode = 405
    } else {
        // /api/todos以外のURLはないので404(Not Found)
        res.statusCode = 404
    }
    res.end()
})

server.listen(PORT, () => console.log(`サーバーを${PORT}ポート番号で起動しています。`))


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
    console.error(err)
    process.exit(1)
})

