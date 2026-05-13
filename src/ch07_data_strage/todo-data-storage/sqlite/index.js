'use strict'

const { promsify, promisify } = require('util')
const { join } = require('path')
const sqlite3 = process.env.NODE_ENV === 'production' 
    ? require('sqlite3') 
    // 冗長モード
    : require('sqlite3').verbose()

// todo-data-storage/sqlite/dbというファイルにデータベースの状態を保存
const db = new sqlite3.Database(join(__dirname, 'db'))

// コールバックパターンのメソッドをPromise化
const dbGet = promisify(db.get.bind(db))
const dbRun = function() {
    return new Promise((resolve, reject) =>
        db.run.apply(db, [
            ...arguments,
            function(err) {
                err ? reject(err) : resolve(this)
            }
        ])
    )
}
const dbAll = promisify(db.all.bind(db))


// CREATE TABLEの実行
dbRun(`CREATE TABLE IF NOT EXISTS todo (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    completed BOOLEAN NOT NULL
)`).catch(err => {
    // テーブル作成に失敗した場合はアプリケーション終了
    console.error(err)
    process.exit(1)
})


// データベースのデータをToDoオブジェクトに変換する
function rowToTodo(row) {
    return { ...row, completed: !!row.completed }
}

/**
 * fetchAll()の実装 
 *
 */
exports.fetchAll = () => {
    return dbAll(
        `SELECT * FROM todo`
    ).then(row => rows.map(rowToTodo))
}

/**
 * fetchByCompleted()の実装
 * 
 */
exports.fetchByCompleted = (completed) => {
    return dbAll(
        `SELECT * FROM todo WHERE completed = ?`,
        completed
    ).then(rows => rows.map(rowToTodo))
}


/**
 * create()の実装
 * 
 */
exports.create = async (todo) => {
    await dbRun(
        `INSERT INTO todo VALUES (?, ?, ?)`,
        todo.id,
        todo.title,
        todo.completed
    )
}


/**
 * update()の実装
 * 
 */
exports.update = async (id, update) => {
    const setColumns = []
    const values = []
    for (const column of ['title', 'completed']) {
        if (column in update) {
            setColumns.push(`${column} = ?`) // プレースホルダ
            values.push(update[column]) // 実際の値
        }
    }
    values.push(id)

    return dbRun(`UPDATE todo SET ${setColumns.join()} WHERE id = ?`, values)
        .then(({ changes }) => changes === 1
        ? dbGet(`SELECT * FROM todo WHERE id = ?`, id).then(rowToTodo)
        : null
    )
}


/**
 * remove()の実装
 * 
 */
exports.remove = (id) => 
    dbRun(`DELETE FROM todo WHERE id = ?`, id)
    .then(({ changes }) => changes === 1 ? id : null)


