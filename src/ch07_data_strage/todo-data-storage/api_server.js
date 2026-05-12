/* Data Storage */
'use strict'

/* Import */
const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()
const http = require('http')
const { v4: uuidv4 } = require('uuid')

// 実行されたスクリプトの名前に応じてデータストレージの実装を切り替える
const dataStorage = require(`./${process.env.npm_lifecycle_event}`)

/* Setting */
const dev = process.env.NODE_ENV !== 'production'
const SERVER_PORT = 3000
const WS_NS_TODOS = '/todos'
const WS_ROOM_SSB88 = 'ssb88'

// 静的ファイルの公開
app.use('/static', express.static('public'))

// リクエストボディのパース
app.use(express.json()) // Content-Type: application/json; charset=utf-8
app.use(express.urlencoded({ extended: true })) // Content-Type: application/x-www-form-urlencoded

// Cookieの処理
app.use(cookieParser())

// 前段のプロキシ対応
// X-Forwarded-Host: req.hostname
// X-Forwarded-Proto: req.protocol
// X-Forwarded-For: req.ip, req.ips
app.enable('trust proxy')


/* API */

// ToDo一覧の取得
app.get('/api/todos', (req, res, next) => {
    if (!req.query.completed) {
        return dataStorage.fetchAll().then(todos => res.json(todos), next)
    }
    const completed = req.query.completed === 'true'
    dataStorage.fetchByCompleted(completed).then(todos => res.json(todos), next)
})


// ToDoの新規登録
app.post('/api/todos', (req, res, next) => {
    const {title} = req.body
    if (typeof title !== 'string' || !title) {
        // titleがリクエストに含まれていない場合はステータスコード400(Bad Request)
        const err = new Error('title is required.')
        err.statusCode = 400
        return next(err)
    }

    // Todoの作成
    const todo = {id: /*UUDIの生成*/uuidv4(), title, completed: false}
    dataStorage.create(todo).then(() => res.status(201).json(todo), next)
})


// Completedの設定、解除の共通処理
function completedHandler(completed) {
    return (req, res, next) => 
        (dataStorage.update(req.params.id, {completed})
            .then(todo => {
                if (todo) {
                    return res.json(todo)
                }
                const err = new Error('ToDo not found')
                err.statusCode = 404
                next(err)
            }, next)
        )
}

// ToDoのCompletedの設定, 解除
app.route('/api/todos/:id/completed')
    .put(completedHandler(true))
    .delete(completedHandler(false))


// ToDoの削除
app.delete('/api/todos/:id', (req, res, next) => {
    dataStorage.remove(req.params.id).then(id => {
        if (id !== null) {
            return res.status(204).end()
        }
        const err = new Error('ToDo not found')
        err.statusCode = 404
        next(err)
    }, next)
})




/* Errors */

// 包括的エラーハンドリング
app.use((err, req, res, next) => {
    console.error(err)
    res.status(err.statusCode || 500).json({ error: err.message })
})



/* Expressをhttp server経由で作成 */
const httpServer = http.createServer(app)

// サーバーの起動
httpServer.listen(SERVER_PORT, () => {
    console.log(`ポート番号${SERVER_PORT}でexpress/next.jsサーバを起動しました.`)
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
