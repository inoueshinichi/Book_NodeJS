'use strict'

const { Level } = require('level')
const { join } = require('path')
const db = new Level(join(__dirname, 'db'))

/**
 * fetchAll()の実装
 */
exports.fetchAll = async () => {
    const result = []
    for await (const [k, v] of db.iterator({ gt: 'todo:', lt: 'todo;' }))
    {
        result.push(JSON.parse(v))
    }
    return result
}


/**
 * fetchByCompleted()の実装
 */
exports.fetchByCompleted = async (completed) => {
    const promises = []
    for await (const id of db.iterator({ 
        gt: `todo-completed-${completed}:`,
        lt: `todo-completed-${completed};`
    })) {
        promises.push(
            db.get(`todo:${id}`).then(JSON.parse)
        )
    }
    return Promise.all(promises)
}


/**
 * create()の実装
 * ファーストインデックスとセカンダリインデックス両方を保存できてcommit
 */
exports.create = (todo) => db.batch()
    // ToDoの保存
    .put(`todo:${todo.id}`, JSON.stringify(todo))
    // セカンダリインデックスの保存
    .put(`todo-completed-${todo.completed}:${todo.id}`, todo.id)
    .write()


/**
 * update()の実装
 * セカンダリインデックスの削除/更新も忘れずに
 */
exports.update = (id, update) => 
    db.get(`todo:${id}`).then(
        // resolve
        content => {
            const oldTodo = JSON.parse(content)
            const newTodo = {
                ...oldTodo,
                ...update
            }
            let batch = db.batch().put(`todo:${id}`, JSON.stringify(newTodo))
            
            // completedの値が変化した場合は、セカンダリインデックスも操作する
            if (oldTodo.completed !== newTodo.completed) {
                batch = batch
                    .del(`todo-completed-${oldTodo.completed}:${id}`)
                    .put(`todo-completed-${newTodo.completed}:${id}`, id)
            }
            return batch.write()
        },
        // error
        err => (err === undefined || err === null || err.notFound) ? null : Promise.reject(err)
    )


/**
 * remove()の実装
 * 
 */
exports.remove = (id) => {
    return db.get(`todo:${id}`).then(
        // resolve
        content => db.batch()
            .del(`todo:${id}`)
            .del(`todo-completed-true:${id}`)
            .del(`todo-completed-false:${id}`)
            .write()
            .then(() => id)
        // reject
        (err === undefined || err === null || err.notFound) ? null : Promise.reject(err)
    )
}

