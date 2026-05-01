'use strict'

const express = require('express')
const cookieParser = require('cookie-parser')

const SERVER_PORT = 3000

const server = express()

// 静的ファイルの公開
server.use('/static', express.static('public'))

// リクエストボディのパース
server.use(express.json()) // application/json; charset=utf-8
server.use(express.urlencoded({ extended: true })) // application/x-www-form-urlencoded by qsパッケージ

// Cookie処理
server.use(cookieParser())

// 前段のプロキシ対応
// X-Forwarded-Host: req.hostname
// X-Forwarded-Proto: req.protocol
// X-Forwarded-For: req.ip, req.ips
server.enable('trust proxy')


// ToDo一覧
let todos = [
    { id: 1, title: 'ネーム', completed: false },
    { id: 2, title: '下書き', completed: true },
]


/* API */

// ToDo一覧の取得
server.get('/api/todos', (req, res) => {
    if (!req.query.completed) {
        return res.json(todos)
    }
    // completedクエリパラメータを指定された場合はToDoをフィルタリング
    const completed = req.query.completed === 'true'
    res.json(todos.filter(todo => todo.completed === completed))
})

// ToDoのIDの値を管理するための変数
let id = 2

// ToDoの新規登録
server.post('/api/todos', (req, res, next) => {
    const { title } = req.body
    if (typeof title !== 'string' || !title) {
        // titleがリクエストに含まれない場合ステータスコード400(Bad Request)
        const err = new Error('titile is required')
        err.statusCode = 400
        return next(err)
    }
    // ToDoの作成
    const todo = { id: id += 1, title, completed: false }
    todos.push(todo)

    // SSE送信関数の実行
    onUpdateTodos()

    // ステータスコード201(Created)で結果を返す
    res.status(201).json(todo)
})

/* SSE */

// 全クライアントに対するSSE送信関数を保持する配列
let sseSenders = []
// SSEのIDを管理するための変数
let sseId = 1

// ToDo一覧の取得(SSE)
server.get('/api/todos/events', (req, res) => {
    // タイムアウトを抑止
    req.socket.setTimeout(0)

    // 1秒でタイムアウトする
    // req.socket.setTimeout(1000)

    res.set({
        // Content-TypeでSSEであることを示す
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform', // 圧縮やキャッシュを防止
        'Connection': 'keep-alive',
        'Content-Encoding': 'none', // 重要：圧縮を無効化
    })

    // クラアントにSSEを送信する関数を作成して登録
    const send = (id, data) => res.write(`id: ${id}\ndata: ${data}\n\n`)

    /* サーバーサイドでのデータ更新に伴ってクライアントにSSEを送信するには、
       データ更新時にsseSendersの配列に含まれる関数を実行する必要がある.
    */
    sseSenders.push(send)

    // リクエスト発生時点の状態を送信
    send(sseId, JSON.stringify(todos))

    // リクエストがクローズされたらレスポンスを終了してSSE送信関数を配列から削除
    req.on('close', () => {
        res.end()
        sseSenders = sseSenders.filter(_send => _send !== send)
    })
})

/* ToDoの更新に伴い、全クライアントに対してSSEを送信する */
function onUpdateTodos() {
    sseId += 1
    const data = JSON.stringify(todos)
    sseSenders.forEach(send => send(sseId, data))
}


/* Errors */

// 包括的エラーハンドリング
server.use((err, req, res, next) => {
    console.error(err)
    res.status(err.statusCode || 500).json({ error: err.message })
})


// Next.jsによるルーティング
const next = require('next')
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler() // ハンドラを先に定義しておくのが一般的です

nextApp.prepare().then(() => {
    // 全てのルート ('*') を Next.js にハンドリングさせる
    // 修正ポイント: callback関数内で明示的に呼び出す
    // 修正：文字列 "(.*)" ではなく、正規表現 /.*/ を使用
    server.all(/.*/, (req, res) => {
        return handle(req, res)
    })
    
    // サーバーの起動は Next.js の準備が整った後に行うのがベストプラクティスです
    server.listen(SERVER_PORT, (err) => {
        if (err) throw err
        console.log(`ポート番号${SERVER_PORT}でexpress/next.jsサーバを起動しました.`)
    })
}).catch((err) => {
    console.error('Next.jsの起動に失敗しました:', err)
    process.exit(1)
})


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